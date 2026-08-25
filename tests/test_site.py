"""
Test suite for the Develo website (develo/ folder).

Implements the SEO / LLM-discoverability requirements from
develo/fix_indentation.md plus functional and performance checks.

Run:  pytest tests/ -v
"""

import json
import os
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

EXPECTED_PAGES = [
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
    "/es/technologies/",
    "/industries/ecommerce-retail/",
    "/case-studies/",
    "/case-studies/tecnoland-distriland/",
    "/insights/",
    "/insights/ai-agents-vs-chatbots/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/terms-and-conditions/",
    "/es/",
]

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
    if page == "/es/":
        assert soup.html.get("lang") == "es"


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
    assert items and items[0].get("name") == "Home"
    assert items[0].get("item") == BASE + "/"
    assert crumbs[0]["itemListElement"][-1].get("name"), f"{page}: last breadcrumb has no name"


@pytest.mark.parametrize("page", EXPECTED_PAGES)
def test_breadcrumb_nav(page):
    soup = soup_of(page)
    if page in ("/", "/es/"):
        return
    nav = soup.find("nav", attrs={"aria-label": re.compile("breadcrumb", re.I)})
    assert nav, f"{page}: missing breadcrumb <nav>"
    home_link = nav.find("a", href="/")
    assert home_link, f"{page}: breadcrumb must link to home"


def test_footer_navigation_consistent():
    for page in EXPECTED_PAGES:
        soup = soup_of(page)
        footer = soup.find("footer")
        assert footer, f"{page}: missing <footer>"
        for target in ("/about/", "/solutions/", "/contact/", "/technologies/"):
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


def _heading_texts(page: str):
    soup = soup_of(page)
    return [h.get_text(" ", strip=True) for h in soup.select("main h1, main h2")]


def test_en_home_llm_viz_position():
    headings = _heading_texts("/")
    assert headings.count("What we do") == 1
    i = headings.index("What we do")
    assert "AI systems you can understand, control and put into production." in headings[i + 1]
    assert headings[i + 2] == "Our method: from insight to impact"
    soup = soup_of("/")
    assert soup.find("a", href="/technologies/")
    assert "tiny GPT-style model" in soup.get_text(" ", strip=True)
    assert len(soup.select("[data-llm-viz]")) == 1
    assert soup.select_one("[data-llm-viz] canvas")["aria-hidden"] == "true"
    assert soup.select_one("[data-llm-explore]").name == "button"


def test_es_home_llm_viz_position():
    headings = _heading_texts("/es/")
    i = headings.index("Qué hacemos")
    assert "Sistemas de IA que podés entender, controlar y llevar a producción." in headings[i + 1]
    assert headings[i + 2].startswith("Nuestro método")
    soup = soup_of("/es/")
    assert soup.find("a", href="/es/technologies/")
    assert len(soup.select("[data-llm-viz]")) == 1


def test_en_technologies_llm_viz_position():
    headings = _heading_texts("/technologies/")
    i = headings.index("LLMs, RAG and fine-tuning")
    assert "AI systems you can understand, control and put into production." in headings[i + 1]
    assert headings[i + 2] == "Data & search layer"


def test_es_technologies_llm_viz_position():
    headings = _heading_texts("/es/technologies/")
    i = headings.index("Fine-tuning de LLMs")
    assert "Sistemas de IA que podés entender, controlar y llevar a producción." in headings[i + 1]
    assert headings[i + 2] == "Evaluación y observabilidad"


def test_llm_viz_assets_present():
    base = SITE_ROOT / "llm-viz" / "bycroft-9da9374"
    for name in ("gpt-nano-sort-model.json", "gpt-nano-sort-t0-partials.json", "native.wasm"):
        p = base / name
        assert p.is_file() and p.stat().st_size > 0, name
    assert (base / "fonts" / "font-atlas.png").stat().st_size > 0
    assert (base / "fonts" / "font-def.json").stat().st_size > 0


def test_llm_viz_unit_node():
    node = shutil.which("node")
    assert node, "node not installed"
    result = subprocess.run(
        [node, "--test", str(REPO_ROOT / "tests" / "llm-visualization" / "test_unit.mjs")],
        capture_output=True, text=True, timeout=30,
    )
    assert result.returncode == 0, f"llm viz unit tests failed:\n{result.stdout}\n{result.stderr}"


def test_llm_viz_scroll_over_canvas(live_server):
    node = shutil.which("node")
    assert node, "node not installed"
    result = subprocess.run(
        [node, str(REPO_ROOT / "tests" / "llm-visualization" / "e2e_scroll.js"), live_server],
        capture_output=True, text=True, timeout=90,
    )
    if "SKIP: no Chrome" in (result.stdout + result.stderr):
        pytest.skip("no Chrome/Chromium for scroll E2E")
    assert result.returncode == 0, f"scroll e2e failed:\n{result.stdout}\n{result.stderr}"


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
