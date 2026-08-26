"""
Test suite for the Develo website (develo/ folder).

Implements the SEO / LLM-discoverability requirements from
develo/fix_indentation.md plus functional and performance checks.

Run:  pytest tests/ -v
"""

import json
import re
import shutil
import socket
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import pytest
import requests
from bs4 import BeautifulSoup

REPO_ROOT = Path(__file__).resolve().parent.parent
SITE_ROOT = REPO_ROOT / "develo"
BASE = "https://develo.software"

ENGLISH_PAGES = [
    "/",
    "/solutions/",
    "/solutions/custom-software-development/",
    "/solutions/artificial-intelligence/",
    "/solutions/ai-agents/",
    "/solutions/customer-service-automation/",
    "/solutions/ai-for-whatsapp/",
    "/solutions/marketplace-automation/",
    "/solutions/ai-for-mercado-libre/",
    "/solutions/api-integrations/",
    "/solutions/d-ialog/",
    "/solutions/develomultiagent/",
    "/technologies/",
    "/industries/ecommerce-retail/",
    "/case-studies/",
    "/case-studies/tecnoland-distriland/",
    "/case-studies/intervan/",
    "/insights/",
    "/insights/ai-agents-vs-chatbots/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/terms-and-conditions/",
]


def spanish_path(path: str) -> str:
    return "/es/" if path == "/" else "/es" + path


SPANISH_PAGES = [spanish_path(path) for path in ENGLISH_PAGES]
EXPECTED_PAGES = ENGLISH_PAGES + SPANISH_PAGES

FORBIDDEN_PLACEHOLDERS = [
    "lorem ipsum",
    "add a title",
    "setting up faqs",
    "what is an faq section",
    "wix.com",
    "wixstatic",
    "wixcode",
    "replace this content",
    "hello, cloudfront",
]

SOLUTION_PAGES = [
    "/solutions/custom-software-development/",
    "/solutions/artificial-intelligence/",
    "/solutions/ai-agents/",
    "/solutions/customer-service-automation/",
    "/solutions/ai-for-whatsapp/",
    "/solutions/marketplace-automation/",
    "/solutions/ai-for-mercado-libre/",
    "/solutions/api-integrations/",
]


def soup_of(path: str) -> BeautifulSoup:
    return BeautifulSoup((SITE_ROOT / path.lstrip("/") / "index.html").read_text(encoding="utf-8"), "html.parser")


def jsonld_by_type(soup: BeautifulSoup, schema_type: str):
    out = []
    for tag in soup.find_all("script", type="application/ld+json"):
        data = json.loads(tag.string or "null")
        items = data if isinstance(data, list) else [data]
        for item in items:
            if isinstance(item, dict) and item.get("@type") == schema_type:
                out.append(item)
    return out


# ---------------------------------------------------------------------------
# Filesystem / structure
# ---------------------------------------------------------------------------

def test_expected_pages_exist_on_disk():
    missing = [p for p in EXPECTED_PAGES if not (SITE_ROOT / p.lstrip("/") / "index.html").is_file()]
    assert not missing, f"Missing pages: {missing}"


def test_no_unexpected_html_pages():
    actual = {("/" + str(p.parent.relative_to(SITE_ROOT)) + "/") if p.parent != SITE_ROOT else "/"
              for p in SITE_ROOT.rglob("index.html")}
    actual.discard("/index.html")
    extra = actual - set(EXPECTED_PAGES)
    assert not extra, f"Unexpected pages: {extra}"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_page_size_performance(page):
    """Each page must be light (the old Wix pages were ~1.8 MB)."""
    size = (SITE_ROOT / page.lstrip("/") / "index.html").stat().st_size
    assert size < 150_000, f"{page} is {size} bytes (>150KB hurts performance)"


# ---------------------------------------------------------------------------
# Per-page SEO metadata (fix_indentation.md §16)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_html_basics(page):
    html = (SITE_ROOT / page.lstrip("/") / "index.html").read_text(encoding="utf-8")
    assert html.lstrip().lower().startswith("<!doctype html>"), page
    soup = soup_of(page)
    assert soup.html is not None
    assert soup.html.get("lang") in ("en", "es"), f"{page}: bad/missing <html lang>"
    if page.startswith("/es/"):
        assert soup.html.get("lang") == "es"
    else:
        assert soup.html.get("lang") == "en"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_title(page):
    soup = soup_of(page)
    title = soup.title.get_text(strip=True) if soup.title else ""
    assert 10 <= len(title) <= 70, f"{page}: title too long/short: {title!r} ({len(title)})"
    assert re.search(r"\|\s+(Develo|d-ialog|Develo Multi-Agent)$", title), \
        f"{page}: title should end with brand: {title!r}"


def test_titles_unique_across_site():
    titles = {}
    for page in EXPECTED_PAGES:
        soup = soup_of(page)
        t = soup.title.get_text(strip=True)
        assert t not in titles, f"Duplicate title {t!r} on {page} and {titles[t]}"
        titles[t] = page


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_meta_description(page):
    soup = soup_of(page)
    meta = soup.find("meta", attrs={"name": "description"})
    assert meta, f"{page}: missing meta description"
    desc = meta["content"].strip()
    assert 70 <= len(desc) <= 170, f"{page}: meta description length {len(desc)}: {desc!r}"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_single_h1_in_main(page):
    soup = soup_of(page)
    h1s = soup.find_all("h1")
    assert len(h1s) == 1, f"{page}: expected exactly one <h1>, found {len(h1s)}"
    assert h1s[0].find_parent("main") is not None, f"{page}: <h1> must be inside <main>"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_canonical_url(page):
    soup = soup_of(page)
    canonical = soup.find("link", rel="canonical")
    assert canonical, f"{page}: missing canonical"
    assert canonical["href"] == BASE + page, f"{page}: canonical {canonical['href']!r}"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_opengraph_tags(page):
    soup = soup_of(page)
    for prop in ("og:title", "og:description", "og:url", "og:type", "og:image"):
        tag = soup.find("meta", attrs={"property": prop})
        assert tag and tag.get("content", "").strip(), f"{page}: missing/empty {prop}"
    assert soup.find("meta", attrs={"property": "og:url"})["content"] == BASE + page


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_jsonld_organization_and_webpage(page):
    soup = soup_of(page)
    orgs = jsonld_by_type(soup, "Organization")
    assert orgs, f"{page}: missing Organization JSON-LD"
    assert orgs[0].get("name") == "Develo"
    assert jsonld_by_type(soup, "WebPage"), f"{page}: missing WebPage JSON-LD"


@pytest.mark.parametrize("page", [p for p in EXPECTED_PAGES if p not in ("/", "/es/")])
def test_jsonld_breadcrumbs(page):
    soup = soup_of(page)
    crumbs = jsonld_by_type(soup, "BreadcrumbList")
    assert crumbs, f"{page}: missing BreadcrumbList JSON-LD"
    items = crumbs[0].get("itemListElement", [])
    home_name = "Inicio" if page.startswith("/es/") else "Home"
    home_url = BASE + ("/es/" if page.startswith("/es/") else "/")
    assert items and items[0].get("name") == home_name
    assert items[0].get("item") == home_url
    assert crumbs[0]["itemListElement"][-1].get("name"), f"{page}: last breadcrumb has no name"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_breadcrumb_nav(page):
    soup = soup_of(page)
    if page in ("/", "/es/"):
        return
    label = re.compile("ruta de navegación", re.I) if page.startswith("/es/") else re.compile("breadcrumb", re.I)
    nav = soup.find("nav", attrs={"aria-label": label})
    assert nav, f"{page}: missing breadcrumb <nav>"
    home_path = "/es/" if page.startswith("/es/") else "/"
    home_link = nav.find("a", href=home_path)
    assert home_link, f"{page}: breadcrumb must link to home"


def test_footer_navigation_consistent():
    for page in EXPECTED_PAGES:
        soup = soup_of(page)
        footer = soup.find("footer")
        assert footer, f"{page}: missing <footer>"
        prefix = "/es" if page.startswith("/es/") else ""
        for target in ("/about/", "/solutions/", "/contact/", "/technologies/"):
            target = prefix + target
            link = footer.find("a", href=target)
            assert link, f"{page}: footer missing link {target}"
        assert "develo" in footer.get_text().lower()


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_no_placeholder_or_template_text(page):
    text = soup_of(page).get_text(" ", strip=True).lower()
    for bad in FORBIDDEN_PLACEHOLDERS:
        assert bad not in text, f"{page}: contains forbidden text {bad!r}"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_every_page_references_css_js_and_schema(page):
    soup = soup_of(page)
    assert soup.find("link", rel="stylesheet", href="/css/style.css"), f"{page}: missing css"
    assert soup.find("script", src="/js/main.js"), f"{page}: missing main.js"
    assert soup.find("link", rel="icon") or soup.find("link", rel="apple-touch-icon"), f"{page}: missing favicon"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_runtime_assets_are_local_and_reproducible(page):
    """The local site must not need Wix (or any other CDN) to render."""
    soup = soup_of(page)
    stylesheet = soup.find("link", rel="stylesheet")
    script = soup.find("script", src=True)
    icon = soup.find("link", rel="icon")
    assert stylesheet and stylesheet["href"].startswith("/"), page
    assert script and script["src"].startswith("/"), page
    assert icon and icon["href"].startswith("/assets/"), page

    for prop in ("og:image", "twitter:image"):
        image = soup.find("meta", attrs={"property": prop}) or soup.find(
            "meta", attrs={"name": prop}
        )
        assert image, f"{page}: missing {prop}"
        assert image["content"].startswith(BASE + "/assets/"), (
            f"{page}: {prop} must be hosted with the site"
        )
        assert image["content"].endswith(".png"), f"{page}: {prop} needs a broadly supported raster preview"


def test_original_visual_language_is_preserved():
    """Regression contract derived from the live develo.ar visual audit."""
    soup = soup_of("/")
    room = soup.select_one("[data-spatial-hero]")
    assert room, "home needs the original perspective-room hero"
    planes = room.select(".floating-plane")
    assert len(planes) >= 10
    assert len(room.select(".depth-frame")) >= 6, "the room needs visible 3D depth"
    assert len(room.select(".back-grid-line")) >= 10, \
        "the back wall needs vertical lines so the room reads as a complete 3D grid"
    assert room.select('.floating-plane[data-motion="x"]')
    assert room.select('.floating-plane[data-motion="y"]')
    assert all(not plane.has_attr("data-motion") for plane in room.select(".floating-plane.orange")), \
        "red planes must stay fixed"
    assert soup.select_one("[data-ticker]"), "home needs the moving mono ticker"
    assert soup.select_one(".brand-wordmark"), "use the <develo> wordmark"
    assert len(soup.select("[data-reveal]")) >= 8, "sections should reveal on scroll"

    css = (SITE_ROOT / "css" / "style.css").read_text(encoding="utf-8").lower()
    for token in ("#1d2cf3", "#d8400e", "space grotesk", "azeret mono"):
        assert token in css, f"missing original design token {token}"
    assert "--pointer-x" in css and "--pointer-y" in css
    assert "prefers-reduced-motion: reduce" in css


def test_motion_is_progressively_enhanced():
    js = (SITE_ROOT / "js" / "main.js").read_text(encoding="utf-8")
    assert "IntersectionObserver" in js
    assert "prefers-reduced-motion" in js
    assert "data-reveal" in js
    assert 'queryselectorall("[data-motion]")' in js.lower()


def test_every_book_a_meeting_button_is_a_real_link():
    for page in EXPECTED_PAGES:
        soup = soup_of(page)
        for button in soup.select(".btn, .hero-action"):
            if "book a meeting" not in button.get_text(" ", strip=True).lower():
                continue
            assert button.name == "a", f"{page}: Book a Meeting must be an anchor"
            assert button.get("href", "").startswith("mailto:info@develo.ar"), page

    home = soup_of("/")
    hero_action = home.select_one(".hero .hero-action")
    assert hero_action, "the first Book a Meeting action must exist in the DOM"
    css = (SITE_ROOT / "css" / "style.css").read_text(encoding="utf-8")
    assert not re.search(r'content\s*:\s*["\']Book a Meeting', css, re.I), \
        "interactive actions cannot be generated with CSS"


def test_ampersands_use_a_readable_glyph_wrapper():
    for page in ("/", "/solutions/", "/solutions/d-ialog/", "/case-studies/"):
        soup = soup_of(page)
        visible_ampersands = [tag for tag in soup.select("h1, h2, h3, a") if "&" in tag.get_text()]
        for tag in visible_ampersands:
            assert tag.select_one(".amp"), f"{page}: unwrapped ampersand in {tag}"
    assert "�" not in " ".join(soup_of(page).get_text() for page in EXPECTED_PAGES)


def test_menu_exposes_product_and_both_case_studies():
    soup = soup_of("/")
    menu = soup.select_one("[data-nav-menu]")
    assert menu
    for href in (
        "/solutions/d-ialog/",
        "/case-studies/intervan/",
        "/case-studies/tecnoland-distriland/",
    ):
        assert menu.find("a", href=href), f"menu must link directly to {href}"


def test_contact_form_preserves_original_functionality():
    soup = soup_of("/contact/")
    form = soup.select_one("form[data-contact-form]")
    assert form, "contact page needs the original inquiry form"
    assert form.get("action") == "mailto:info@develo.ar"
    for name in ("name", "company", "email", "message"):
        field = form.find(attrs={"name": name})
        assert field, f"contact form is missing {name}"
    assert form.find(attrs={"name": "email"}).get("type") == "email"
    assert form.find(attrs={"name": "email"}).has_attr("required")
    assert form.find(attrs={"name": "message"}).has_attr("required")


# ---------------------------------------------------------------------------
# Technical SEO files (fix_indentation.md §17, §23, §24)
# ---------------------------------------------------------------------------

def test_robots_txt():
    text = (SITE_ROOT / "robots.txt").read_text(encoding="utf-8")
    assert "User-agent: *" in text
    assert "Allow: /" in text
    assert f"Sitemap: {BASE}/sitemap.xml" in text
    # AI search crawlers must be explicitly allowed (ChatGPT Search, etc.)
    assert "OAI-SearchBot" in text
    assert "GPTBot" in text
    assert "ChatGPT-User" in text
    assert "Claude-SearchBot" in text
    assert "Claude-User" in text
    assert not re.search(r"Disallow:\s*/", text), "robots.txt must not disallow anything"


def test_sitemap_xml_matches_site():
    path = SITE_ROOT / "sitemap.xml"
    assert path.is_file(), "missing sitemap.xml"
    root = ET.parse(path).getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = {el.text.strip() for el in root.findall(".//sm:url/sm:loc", ns)}
    expected = {BASE + p for p in EXPECTED_PAGES}
    assert locs == expected, f"sitemap mismatch.\n missing={expected - locs}\n extra={locs - expected}"
    for loc in locs:
        assert loc.startswith(BASE + "/"), f"non-absolute sitemap URL: {loc}"


def test_not_found_page_is_real_and_not_indexable():
    path = SITE_ROOT / "404.html"
    assert path.is_file(), "deployment needs a real 404 page"
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    robots = soup.find("meta", attrs={"name": "robots"})
    assert robots and "noindex" in robots.get("content", "").lower()
    assert soup.find("a", href="/"), "404 page must link back home"


def test_cloudfront_deployment_keeps_clean_urls_and_real_404s():
    deploy = (REPO_ROOT / "deploy.sh").read_text(encoding="utf-8")
    rewrite = REPO_ROOT / "cloudfront-clean-urls.js"
    assert rewrite.is_file(), "missing CloudFront clean-URL function"
    code = rewrite.read_text(encoding="utf-8")
    assert 'uri.endsWith("/")' in code
    assert 'uri += "/index.html"' in code
    assert "FunctionAssociations" in deploy
    assert 'ResponseCode: "404"' in deploy
    assert 'ResponseCode: "200"' not in deploy, "soft-404 fallback hurts indexing"


def test_llms_txt():
    text = (SITE_ROOT / "llms.txt").read_text(encoding="utf-8")
    assert "Develo" in text
    assert "artificial intelligence" in text.lower()
    assert BASE in text
    # Must point to the key pages
    for p in ("/solutions/", "/solutions/ai-agents/", "/about/", "/technologies/"):
        assert p in text, f"llms.txt should reference {p}"


# ---------------------------------------------------------------------------
# Crawl / internal linking (fix_indentation.md §15)
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def live_server():
    port = _free_port()
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--directory", str(SITE_ROOT)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    base = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            requests.get(base + "/", timeout=1)
            break
        except requests.RequestException:
            time.sleep(0.1)
    yield base
    proc.terminate()
    proc.wait()


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def test_crawl_all_internal_links_resolve(live_server):
    seen = set()
    broken = []
    queue = ["/"]
    while queue:
        url = queue.pop()
        if url in seen:
            continue
        seen.add(url)
        res = requests.get(live_server + url, timeout=5)
        if res.status_code != 200:
            broken.append((url, res.status_code))
            continue
        for a in soup_from(res.text).find_all("a", href=True):
            href = a["href"].split("#")[0]
            if not href or href.startswith(("mailto:", "tel:", "http")):
                continue
            target = href if href.startswith("/") else url.rstrip("/") + "/" + href
            if target not in seen:
                queue.append(target)
    assert not broken, f"Broken internal links: {broken}"
    reachable = {u for u in seen if u != "/favicon.ico"}
    html_pages = EXPECTED_PAGES
    missing = set(html_pages) - reachable
    assert not missing, f"Pages not reachable from home by internal links: {missing}"


def soup_from(text):
    return BeautifulSoup(text, "html.parser")


def test_solutions_hub_links_to_all_landing_pages():
    soup = soup_of("/solutions/")
    for p in SOLUTION_PAGES + ["/solutions/d-ialog/", "/solutions/develomultiagent/"]:
        assert soup.find("a", href=p), f"/solutions/ must link to {p}"


def test_pages_have_internal_links_into_the_network():
    for page in EXPECTED_PAGES:
        if page in ("/privacy-policy/", "/terms-and-conditions/"):
            continue
        soup = soup_of(page)
        internal = {a["href"] for a in soup.find_all("a", href=True)
                    if a["href"].startswith("/") and a["href"] != page}
        assert len(internal) >= 3, f"{page}: too few internal links ({internal})"


# ---------------------------------------------------------------------------
# Content requirements (fix_indentation.md §5, §9, §10, §12, §22)
# ---------------------------------------------------------------------------

def test_homepage_positioning():
    soup = soup_of("/")
    title = soup.title.get_text(strip=True)
    assert "Custom Software" in title and "Artificial Intelligence" in title
    h1 = soup.find("h1").get_text(" ", strip=True)
    assert "Artificial Intelligence" in h1
    # Within seconds a crawler should infer the entity relationships:
    text = soup.get_text(" ", strip=True)
    for concept in ("Develo", "software", "artificial intelligence", "automation",
                    "AI agents", "WhatsApp", "marketplace", "Argentina"):
        assert re.search(re.escape(concept), text, re.I), f"home should mention {concept!r}"
    # Home links into the main architecture
    for p in ("/solutions/", "/technologies/", "/case-studies/", "/insights/", "/about/"):
        assert soup.find("a", href=p), f"home must link {p}"


def test_home_featured_product_copy_is_clean_and_links_to_product_page():
    soup = soup_of("/")
    heading = next(
        (h for h in soup.find_all("h2") if "featured product" in h.get_text(" ", strip=True).lower()),
        None,
    )
    assert heading
    assert "by develo" not in heading.get_text(" ", strip=True).lower()
    assert soup.find("a", href="/solutions/d-ialog/"), "the product promotion must open its detail page"


def test_capabilities_include_multitenant_and_high_scale_products():
    text = " ".join(
        soup_of(path).get_text(" ", strip=True)
        for path in ("/", "/solutions/custom-software-development/", "/solutions/d-ialog/")
    )
    assert re.search(r"multi[- ]?tenant", text, re.I)
    assert re.search(r"highly scalable products", text, re.I)


def test_home_hreflang_es_en():
    soup = soup_of("/")
    for lang, href in (("en", BASE + "/"), ("es", BASE + "/es/"), ("x-default", BASE + "/")):
        tag = soup.find("link", attrs={"hreflang": lang})
        assert tag, f"home: missing hreflang {lang}"
        assert tag["href"] == href


def test_es_homepage():
    soup = soup_of("/es/")
    assert soup.html.get("lang") == "es"
    title = soup.title.get_text(strip=True)
    assert "Develo" in title
    # Alternate pointing back to the English home
    tag = soup.find("link", attrs={"hreflang": "en"})
    assert tag and tag["href"] == BASE + "/"
    text = soup.get_text(" ", strip=True)
    assert "inteligencia artificial" in text.lower()


@pytest.mark.parametrize("english_path", ENGLISH_PAGES)
def test_every_page_has_an_exact_reciprocal_language_version(english_path):
    spanish = spanish_path(english_path)
    en_soup = soup_of(english_path)
    es_soup = soup_of(spanish)

    for soup, lang, alternate in (
        (en_soup, "es", BASE + spanish),
        (es_soup, "en", BASE + english_path),
    ):
        link = soup.find("link", attrs={"hreflang": lang})
        assert link and link.get("href") == alternate

    en_switch = en_soup.select_one(".header-language")
    es_switch = es_soup.select_one(".header-language")
    assert en_switch and en_switch.get("href") == spanish
    assert es_switch and es_switch.get("href") == english_path


@pytest.mark.parametrize("page", SPANISH_PAGES)
def test_spanish_chrome_and_calls_to_action_are_fully_translated(page):
    soup = soup_of(page)
    visible = soup.get_text(" ", strip=True)
    menu = soup.select_one("[data-nav-menu]")
    footer = soup.find("footer")
    assert menu and footer

    for required in (
        "Inicio", "Soluciones", "Tecnologías", "Casos de éxito",
        "Nosotros", "Agendar reunión", "Todos los derechos reservados",
    ):
        assert required.lower() in visible.lower(), f"{page}: missing Spanish UI copy {required!r}"

    for forbidden in (
        "Book a Meeting", "Learn more", "Go to page", "View all case studies",
        "Your name", "Prepare email", "Skip to content", "All rights reserved",
    ):
        assert forbidden.lower() not in visible.lower(), f"{page}: untranslated UI copy {forbidden!r}"

    for link in soup.find_all("a", href=True):
        href = link["href"]
        if href.startswith("/") and not link.get("hreflang"):
            assert href.startswith("/es/"), f"{page}: Spanish page points outside locale: {href}"


@pytest.mark.parametrize("page", ENGLISH_PAGES)
def test_english_chrome_stays_fully_english(page):
    soup = soup_of(page)
    visible = soup.get_text(" ", strip=True)
    assert "Book a Meeting" in visible
    for forbidden in ("Agendar reunión", "Casos de éxito", "Todos los derechos reservados"):
        assert forbidden.lower() not in visible.lower(), f"{page}: Spanish UI leaked into English"
    for link in soup.find_all("a", href=True):
        href = link["href"]
        if href.startswith("/") and not link.get("hreflang"):
            assert not href.startswith("/es/"), f"{page}: English page points into Spanish locale: {href}"


def test_card_spacing_and_current_breadcrumb_design_contracts():
    css = (SITE_ROOT / "css" / "style.css").read_text(encoding="utf-8")
    final_card_rule = css.rsplit(".card {", 1)[-1].split("}", 1)[0]
    assert "justify-content: space-between" not in final_card_rule
    assert re.search(r"\.card h3\s*\{[^}]*margin-bottom:\s*(?:0?\.[0-9]+|[0-9]+)rem", css, re.S)
    assert re.search(r"\.breadcrumbs \[aria-current\]\s*\{[^}]*color:\s*var\(--orange\)", css, re.S)


def test_dialog_showcase_has_smooth_focus_layout_without_click_action():
    soup = soup_of("/solutions/d-ialog/")
    css = (SITE_ROOT / "css" / "style.css").read_text(encoding="utf-8")
    assert "data-product-showcase" in soup.decode()
    assert all(shot.select_one(":scope > .product-shot-visual") for shot in soup.select(".product-shot")), \
        "the stationary hover target and transformed visual layer must be separate"
    assert re.search(r"\.product-showcase[^\{]*:has\([^)]*product-shot-secondary:hover", css)
    assert "transition" in css[css.find(".product-shot-visual {"):css.find(".product-shot-visual {") + 500]
    assert "transition: grid-template-columns" not in css
    hover_rule = re.search(
        r"\.product-showcase:has\(\.product-shot-secondary:hover\)\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert hover_rule and "grid-template-columns" not in hover_rule.group(1), \
        "hover must use composited transforms without changing document flow"
    assert ".product-screen-link" not in css


def test_technologies_section():
    """New mandatory section: AWS, Bedrock, autonomous agents, MCP, AI, LLM fine-tuning."""
    soup = soup_of("/technologies/")
    text = soup.get_text(" ", strip=True)
    for term in ("AWS", "Amazon Bedrock", "autonomous agents",
                 "Model Context Protocol", "MCP", "fine-tuning",
                 "LLM", "Retrieval-Augmented Generation", "RAG", "vector"):
        assert re.search(re.escape(term), text, re.I), f"/technologies/ must mention {term!r}"
    assert jsonld_by_type(soup, "Service"), "/technologies/: missing Service JSON-LD"


def test_whatsapp_landing_page():
    soup = soup_of("/solutions/ai-for-whatsapp/")
    assert soup.title.get_text(strip=True) == "AI Agents for WhatsApp Customer Service | Develo"
    assert soup.find("h1").get_text(" ", strip=True) == "Automate WhatsApp Customer Service with AI"
    faq = jsonld_by_type(soup, "FAQPage")
    assert faq and len(faq[0].get("mainEntity", [])) >= 4, "whatsapp page: need FAQ (>=4 Qs)"
    assert jsonld_by_type(soup, "Service")
    assert soup.find("a", href="/solutions/d-ialog/"), "whatsapp page should link to d-ialog"


def test_ai_agents_landing_page():
    soup = soup_of("/solutions/ai-agents/")
    assert soup.title.get_text(strip=True) == "AI Agent Development for Businesses | Develo"
    assert soup.find("h1").get_text(" ", strip=True) == "Artificial Intelligence Agents for Business"
    assert jsonld_by_type(soup, "Service")
    text = soup.get_text(" ", strip=True).lower()
    for term in ("guardrail", "human-in-the-loop", "tool", "api"):
        assert term in text, f"/solutions/ai-agents/ should discuss {term!r}"


def test_custom_software_page():
    soup = soup_of("/solutions/custom-software-development/")
    assert soup.title.get_text(strip=True) == "Custom Software Development for Businesses | Develo"
    assert soup.find("h1").get_text(" ", strip=True) == "Custom Software Development"
    desc = soup.find("meta", attrs={"name": "description"})["content"]
    assert "custom software" in desc.lower()
    assert jsonld_by_type(soup, "Service")


def test_mercado_libre_page():
    soup = soup_of("/solutions/ai-for-mercado-libre/")
    assert soup.title.get_text(strip=True) == "AI Automation for Mercado Libre Sellers | Develo"
    assert soup.find("h1").get_text(" ", strip=True) == "Automate Mercado Libre Customer Questions with AI"
    assert jsonld_by_type(soup, "Service")


def test_dialog_repositioned():
    """d-ialog repositioned around what customers search for (audit §9)."""
    soup = soup_of("/solutions/d-ialog/")
    assert soup.title.get_text(strip=True) == "AI Agents for WhatsApp, Marketplaces & Customer Service | d-ialog"
    assert soup.find("h1").get_text(" ", strip=True) == "Automate Customer Service with Artificial Intelligence Agents"
    text = soup.get_text(" ", strip=True)
    assert re.search(r"d-ialog by Develo|d-ialog[^A-Za-z]{0,20}Develo", text, re.I), "must say 'd-ialog by Develo'"
    app = jsonld_by_type(soup, "SoftwareApplication")
    assert app, "d-ialog: missing SoftwareApplication JSON-LD"
    assert app[0].get("name") == "d-ialog"
    faq = jsonld_by_type(soup, "FAQPage")
    assert faq and len(faq[0].get("mainEntity", [])) >= 3, "d-ialog: need FAQ (>=3 Qs)"


def test_dialog_product_screens_are_integrated_as_real_local_media():
    soup = soup_of("/solutions/d-ialog/")
    showcase = soup.select_one(".product-showcase")
    assert showcase, "d-ialog should lead with a polished product showcase"
    images = showcase.select("img.product-screen")
    assert len(images) == 2
    assert images[0].get("fetchpriority") == "high"
    for image in images:
        src = image.get("src", "")
        assert src.startswith("/assets/products/dialog-")
        assert image.get("alt", "").strip()
        assert image.get("width") and image.get("height"), "reserve media space to prevent layout shift"
        assert (SITE_ROOT / src.lstrip("/")).is_file(), f"missing product image {src}"
        assert image.find_parent("a") is None, "product screenshots are presentations, not outbound links"

    first_h2 = soup.find("h2")
    first_content_block = soup.select_one(".content > .content-block")
    assert first_h2 and showcase.find_parent("section") is first_content_block, \
        "product screenshots should appear immediately after the product introduction"


def test_develomultiagent_page():
    soup = soup_of("/solutions/develomultiagent/")
    text = soup.get_text(" ", strip=True).lower()
    assert "multi-agent" in text or "multiagent" in text
    assert "orchestrat" in text
    app = jsonld_by_type(soup, "SoftwareApplication")
    assert app, "develomultiagent: missing SoftwareApplication JSON-LD"


def test_about_page_real_content():
    soup = soup_of("/about/")
    text = soup.get_text(" ", strip=True).lower()
    for term in ("buenos aires", "argentina", "develo", "artificial intelligence",
                 "aws", "bedrock", "how we work"):
        assert term in text, f"/about/ should mention {term!r}"
    # Answers the audit §12 questions
    for q in ("who we are", "what we build", "expertise", "clients"):
        assert q in text, f"/about/ should answer '{q}'"


def test_case_study():
    soup = soup_of("/case-studies/tecnoland-distriland/")
    text = soup.get_text(" ", strip=True)
    assert "Tecnoland" in text and "Distriland" in text
    for section in ("Challenge", "Solution", "Technology", "Results"):
        assert re.search(section, text), f"case study should have a '{section}' section"
    assert "Case Study" in soup.title.get_text(strip=True)
    assert jsonld_by_type(soup, "Article")


def test_case_study_logos_are_used_without_oversizing():
    expected = {
        "/case-studies/": {"distriland", "intervan"},
        "/case-studies/tecnoland-distriland/": {"distriland"},
        "/case-studies/intervan/": {"intervan"},
    }
    for page, brands in expected.items():
        soup = soup_of(page)
        logos = soup.select("img.client-logo")
        sources = " ".join(image.get("src", "") for image in logos).lower()
        for brand in brands:
            assert brand in sources, f"{page}: missing {brand} logo"
        for image in logos:
            assert image.get("width") and image.get("height")


def test_intervan_case_study_is_concise_complete_and_structured():
    soup = soup_of("/case-studies/intervan/")
    text = soup.get_text(" ", strip=True)
    assert jsonld_by_type(soup, "Article")
    assert "Intervan" in text
    for section in ("Need", "Solution", "Architecture", "Outcome"):
        assert soup.find(["h2", "h3"], string=re.compile(section, re.I)), section
    for term in (
        "1,000+ users",
        "copilot",
        "backoffice",
        "MCP",
        "dynamic knowledge base",
        "metrics",
        "configuration",
        "multitenant",
        "traceability",
    ):
        assert re.search(re.escape(term), text, re.I), f"Intervan case must mention {term}"
    assert len(text.split()) < 750, "the case study should stay concrete and scannable"
    assert not re.search(r"\bToba\b", text, re.I), \
        "the public case study must refer only to Intervan's system"


def test_case_studies_hub_links_both_real_implementations():
    soup = soup_of("/case-studies/")
    assert soup.find("a", href="/case-studies/intervan/")
    assert soup.find("a", href="/case-studies/tecnoland-distriland/")


def test_insights_article():
    soup = soup_of("/insights/ai-agents-vs-chatbots/")
    art = jsonld_by_type(soup, "Article")
    assert art, "insights article: missing Article JSON-LD"
    assert art[0].get("headline")
    assert art[0].get("author")
    assert soup.find("a", href="/solutions/ai-agents/"), "article should link to the AI agents solution"
    text = soup.get_text(" ", strip=True).lower()
    assert "chatbot" in text and "agent" in text


def test_industry_page():
    soup = soup_of("/industries/ecommerce-retail/")
    text = soup.get_text(" ", strip=True).lower()
    for term in ("ecommerce", "whatsapp", "marketplace"):
        assert term in text
    assert soup.find("a", href="/case-studies/tecnoland-distriland/")


# ---------------------------------------------------------------------------
# JavaScript functionality
# ---------------------------------------------------------------------------

def test_main_js_year_logic_node():
    """Functional test of js/main.js under Node with a DOM stub."""
    node = shutil.which("node")
    assert node, "node not installed"
    result = subprocess.run(
        [node, str(REPO_ROOT / "tests" / "test_main.js")],
        capture_output=True, text=True, timeout=30,
    )
    assert result.returncode == 0, f"node test failed:\n{result.stdout}\n{result.stderr}"


def test_all_pages_load_the_year_element():
    for page in EXPECTED_PAGES:
        soup = soup_of(page)
        assert soup.find(id="year"), f"{page}: footer must contain #year"


# ---------------------------------------------------------------------------
# LLM visualization section
# ---------------------------------------------------------------------------

LLM_VIZ_PAGES = ["/", "/es/", "/technologies/", "/es/technologies/"]
LLM_VIZ_ASSET_DIR = SITE_ROOT / "llm-viz" / "bycroft-9da9374"


def _viz(soup: BeautifulSoup):
    nodes = soup.select("[data-llm-viz]")
    assert len(nodes) == 1, f"expected exactly one visualization, got {len(nodes)}"
    return nodes[0]


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_section_is_present_once(page):
    viz = _viz(soup_of(page))
    expected_lang = "es" if page.startswith("/es") else "en"
    assert viz["data-lang"] == expected_lang
    assert viz["data-variant"] == ("home" if page in ("/", "/es/") else "tech")


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_meaning_does_not_depend_on_the_canvas(page):
    """The canvas is decorative: the story must be crawlable HTML."""
    viz = _viz(soup_of(page))
    canvas = viz.select_one("canvas[data-llm-canvas]")
    assert canvas and canvas.get("aria-hidden") == "true"
    assert not canvas.get_text(strip=True)

    diagram = viz.select_one(".llm-viz-diagram")
    assert diagram and diagram.get("aria-label")
    assert len(diagram.find_all("li")) >= 5, f"{page}: static diagram needs the pipeline steps"
    rows = diagram.select("li.llm-viz-diagram-tokens")
    assert len(rows) == 2, f"{page}: diagram needs an input and an output row"
    input_cells = [c.get_text(strip=True) for c in rows[0].select(".llm-viz-cells span")]
    output_cells = [c.get_text(strip=True) for c in rows[1].select(".llm-viz-cells span")]
    assert "".join(input_cells) == "CBABBC", f"{page}: input tokens must be the real model input"
    assert output_cells == ["A", "B", "C"], f"{page}: output row must expose the token vocabulary"

    stage = viz.select_one(".llm-viz-stage")
    assert stage and stage.get("role") == "region" and stage.get("aria-label")


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_headings_and_disclaimer(page):
    soup = soup_of(page)
    viz = _viz(soup)
    heading = viz.find("h2")
    assert heading and heading.get_text(strip=True)
    assert len(soup.select("main h1")) == 1, f"{page}: heading hierarchy must stay valid"

    disclaimer = viz.select_one(".llm-viz-disclaimer")
    assert disclaimer, f"{page}: the tiny-model disclaimer is mandatory"
    text = disclaimer.get_text(" ", strip=True).lower()
    if page.startswith("/es"):
        assert "pequeño" in text and "producción" in text
    else:
        assert "tiny" in text and "production" in text


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_controls_start_hidden_and_are_buttons(page):
    viz = _viz(soup_of(page))
    for attr in ("data-llm-explore", "data-llm-reset", "data-llm-replay"):
        btn = viz.select_one(f"[{attr}]")
        assert btn is not None, f"{page}: missing {attr}"
        assert btn.name == "button", f"{page}: {attr} must be a real button (keyboard accessible)"
        assert btn.get("type") == "button"
        assert btn.has_attr("hidden"), f"{page}: {attr} must not appear before the runtime is ready"

    msg = viz.select_one("[data-llm-fallback-msg]")
    assert msg is not None and msg.has_attr("hidden"), (
        f"{page}: the unavailable message only shows when the runtime cannot start"
    )
    assert viz.select_one("[data-llm-fallback]"), f"{page}: fallback must exist before the engine is ready"


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_cta_points_to_the_localized_technology_page(page):
    viz = _viz(soup_of(page))
    cta = viz.select_one(".llm-tech-copy a.btn")
    assert cta, f"{page}: missing technology CTA"
    assert cta["href"] == ("/es/technologies/" if page.startswith("/es") else "/technologies/")


@pytest.mark.parametrize("page", LLM_VIZ_PAGES)
def test_llm_viz_script_is_a_deferred_module(page):
    soup = soup_of(page)
    script = soup.find("script", src="/js/llm-visualization/index.js")
    assert script, f"{page}: missing visualization entry point"
    assert script.get("type") == "module", f"{page}: must not block parsing"


@pytest.mark.parametrize("page", [p for p in EXPECTED_PAGES if p not in LLM_VIZ_PAGES])
def test_llm_viz_is_not_loaded_on_other_pages(page):
    soup = soup_of(page)
    assert not soup.select("[data-llm-viz]"), f"{page}: visualization must not appear here"
    assert not soup.find("script", src="/js/llm-visualization/index.js"), (
        f"{page}: pages without the section must not download the runtime"
    )


def _main_headings_with_viz(page: str):
    """Ordered list of the main-content headings, with the visualization inlined."""
    soup = soup_of(page)
    main = soup.find("main")
    nodes = main.select("h2, h3, [data-llm-viz]")
    out = []
    for node in nodes:
        if node.has_attr("data-llm-viz"):
            out.append("<viz>")
        elif not node.find_parent(attrs={"data-llm-viz": True}):
            out.append(node.get_text(" ", strip=True))
    return out


def test_llm_viz_home_sits_between_what_we_do_and_our_method():
    for page, before, after in [
        ("/", "What we do", "Our method"),
        ("/es/", "Qué hacemos", "Nuestro método"),
    ]:
        headings = _main_headings_with_viz(page)
        viz_at = headings.index("<viz>")
        before_at = next(i for i, h in enumerate(headings) if h.startswith(before))
        after_at = next(i for i, h in enumerate(headings) if h.startswith(after))
        assert before_at < viz_at < after_at, (
            f"{page}: expected {before!r} < visualization < {after!r}, got {headings}"
        )
        # The old standalone technology section must not survive as a duplicate.
        heading = "La tecnología detrás de Develo" if page.startswith("/es") else "The technology behind Develo"
        assert str(soup_of(page)).count(heading) == 0, (
            f"{page}: {heading!r} was replaced by the visualization section"
        )


def test_llm_viz_technology_pages_sit_after_fine_tuning():
    for page, before, after in [
        ("/technologies/", "LLMs, RAG and fine-tuning", "Data"),
        ("/es/technologies/", "Fine-tuning de LLMs", "Evaluación y observabilidad"),
    ]:
        headings = _main_headings_with_viz(page)
        viz_at = headings.index("<viz>")
        before_at = next(i for i, h in enumerate(headings) if h.startswith(before))
        after_at = next(i for i, h in enumerate(headings) if h.startswith(after))
        assert before_at < viz_at < after_at, (
            f"{page}: expected {before!r} < visualization < {after!r}, got {headings}"
        )


def test_llm_viz_runtime_assets_are_served_from_our_own_origin():
    for name in ("gpt-nano-sort-model.json", "gpt-nano-sort-t0-partials.json",
                 "native.wasm", "fonts/font-atlas.png", "fonts/font-def.json"):
        asset = LLM_VIZ_ASSET_DIR / name
        assert asset.is_file(), f"missing runtime asset {name}"
        assert asset.stat().st_size > 0, f"empty runtime asset {name}"

    runtime = SITE_ROOT / "js" / "llm-visualization"
    assert (runtime / "index.js").is_file()
    for module in runtime.glob("*.js"):
        source = module.read_text(encoding="utf-8")
        assert "http://" not in source and "https://" not in source.replace("https://develo.software", ""), (
            f"{module.name}: runtime must not fetch from third-party origins"
        )


def test_llm_viz_never_calls_upstream_origins_in_production():
    forbidden = ("bbycroft.net", "github.com", "raw.githubusercontent.com", "unpkg.com", "cdn.jsdelivr.net")
    targets = list((SITE_ROOT / "js" / "llm-visualization").glob("*.js"))
    targets += [SITE_ROOT / p.lstrip("/") / "index.html" for p in LLM_VIZ_PAGES]
    for target in targets:
        source = target.read_text(encoding="utf-8")
        for host in forbidden:
            assert host not in source, f"{target.name} must not reference {host}"


def test_llm_viz_states_the_real_model_shape():
    for page, expected in [
        ("/", ["3 layers", "3 attention heads", "48-dimensional"]),
        ("/es/", ["3 capas", "3 cabezas de atención", "48 dimensiones"]),
    ]:
        dims = _viz(soup_of(page)).select_one(".llm-viz-dims").get_text(" ", strip=True)
        for fragment in expected:
            assert fragment in dims, f"{page}: model dimensions must state {fragment!r}, got {dims!r}"


def test_llm_viz_asset_urls_are_pinned_to_the_upstream_commit():
    assets = (SITE_ROOT / "js" / "llm-visualization" / "assets.js").read_text(encoding="utf-8")
    assert "/llm-viz/bycroft-9da9374" in assets, "asset URLs must stay pinned to the upstream commit"


def test_llm_viz_third_party_notice_credits_upstream():
    notices = (REPO_ROOT / "THIRD_PARTY_NOTICES.md").read_text(encoding="utf-8")
    assert "bbycroft" in notices or "Bycroft" in notices, "upstream author must be credited"
    assert "9da93742382f1bf36c020c38a1ace454e82c4490" in notices, "pinned commit must be documented"
    assert "MIT" in notices


def test_llm_viz_deploy_sets_wasm_mime_and_immutable_cache():
    deploy = (REPO_ROOT / "deploy.sh").read_text(encoding="utf-8")
    assert "application/wasm" in deploy, "WASM needs an explicit MIME for instantiateStreaming"
    assert "public, max-age=31536000, immutable" in deploy, "versioned assets must be cached immutably"


def test_llm_viz_unit_tests_pass_under_node():
    node = shutil.which("node")
    assert node, "node not installed"
    result = subprocess.run(
        [node, "--test", str(REPO_ROOT / "tests" / "llm-visualization" / "test_unit.mjs")],
        capture_output=True, text=True, timeout=120,
    )
    assert result.returncode == 0, f"unit tests failed:\n{result.stdout}\n{result.stderr}"


# ---------------------------------------------------------------------------
# Visual smoke tests (headless Chrome screenshots)
# ---------------------------------------------------------------------------

NODE = shutil.which("node")


@pytest.mark.screenshot
def test_screenshots_render(live_server, tmp_path):
    """Deterministic viewport screenshots via tests/shoot.js (puppeteer-core)."""
    assert NODE, "node not installed (needed for puppeteer-core screenshots)"
    (REPO_ROOT / "tests" / "screenshots").mkdir(parents=True, exist_ok=True)
    shots = {
        "home": (live_server + "/", 1440, 900),
        "solutions": (live_server + "/solutions/", 1440, 900),
        "technologies": (live_server + "/technologies/", 1440, 900),
        "dialog": (live_server + "/solutions/d-ialog/", 1440, 900),
        "about": (live_server + "/about/", 1440, 900),
        "home-mobile": (live_server + "/", 390, 844),
    }
    for name, (url, w, h) in shots.items():
        out = REPO_ROOT / "tests" / "screenshots" / f"{name}.png"
        result = subprocess.run(
            [NODE, str(REPO_ROOT / "tests" / "shoot.js"), url, str(w), str(h), str(out)],
            timeout=120, capture_output=True, text=True,
        )
        assert result.returncode == 0, f"screenshot {name} failed: {result.stderr}"
        assert out.stat().st_size > 20_000, f"screenshot {name} looks empty ({out.stat().st_size} bytes)"


@pytest.mark.screenshot
def test_browser_interactions(live_server):
    """Exercise the menu, motion, responsive layout and resource loading."""
    result = subprocess.run(
        [NODE, str(REPO_ROOT / "tests" / "browser_check.js"), live_server],
        timeout=120, capture_output=True, text=True,
    )
    assert result.returncode == 0, f"browser interaction test failed:\n{result.stdout}\n{result.stderr}"


@pytest.mark.screenshot
def test_llm_viz_page_scroll_is_never_hijacked(live_server):
    """Release blocker: the wheel over the canvas must always scroll the page."""
    assert NODE, "node not installed"
    result = subprocess.run(
        [NODE, str(REPO_ROOT / "tests" / "llm-visualization" / "e2e_scroll.js"), live_server],
        cwd=str(REPO_ROOT / "tests"), timeout=180, capture_output=True, text=True,
    )
    assert result.returncode == 0, f"scroll blocker failed:\n{result.stdout}\n{result.stderr}"


@pytest.mark.screenshot
def test_llm_viz_end_to_end(live_server):
    """Position, lazy loading, autoplay, explore/reset/replay and fallbacks."""
    assert NODE, "node not installed"
    result = subprocess.run(
        [NODE, str(REPO_ROOT / "tests" / "llm-visualization" / "e2e_viz.js"), live_server],
        cwd=str(REPO_ROOT / "tests"), timeout=600, capture_output=True, text=True,
    )
    assert result.returncode == 0, f"visualization e2e failed:\n{result.stdout}\n{result.stderr}"
