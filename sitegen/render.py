"""
HTML rendering (Template Method pattern: shared head/nav/footer skeleton,
data-driven body blocks).
"""

import html
import json

from . import schemas
from .schemas import BASE, EMAIL, LOGO

NAV = [
    ("Home", "/"),
    ("Solutions", "/solutions/"),
    ("Technologies", "/technologies/"),
    ("Industries", "/industries/ecommerce-retail/"),
    ("Case Studies", "/case-studies/"),
    ("Insights", "/insights/"),
    ("About", "/about/"),
]

FOOTER_SOLUTIONS = [
    ("Custom Software", "/solutions/custom-software-development/"),
    ("Artificial Intelligence", "/solutions/artificial-intelligence/"),
    ("AI Agents", "/solutions/ai-agents/"),
    ("Customer Service Automation", "/solutions/customer-service-automation/"),
    ("AI for WhatsApp", "/solutions/ai-for-whatsapp/"),
    ("d-ialog", "/solutions/d-ialog/"),
]

FOOTER_COMPANY = [
    ("About Develo", "/about/"),
    ("Technology Stack", "/technologies/"),
    ("Case Studies", "/case-studies/"),
    ("Insights", "/insights/"),
    ("Contact", "/contact/"),
]

LOGO_SVG = (
    '<svg class="logo" viewBox="0 0 132 32" role="img" aria-label="Develo" width="132" height="32">'
    '<text x="0" y="24" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" '
    'font-size="26" font-weight="700" fill="currentColor">develo</text>'
    '<circle cx="122" cy="24" r="4.5" fill="#38bdf8"/></svg>'
)


def esc(t: str) -> str:
    return html.escape(t, quote=True)


def build_head(page: dict) -> str:
    url = BASE + page["path"]
    lang = page["lang"]
    og_image = LOGO
    parts = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f"<title>{esc(page['title'])}</title>",
        f'<meta name="description" content="{esc(page["description"])}">',
        f'<link rel="canonical" href="{url}">',
        '<meta name="theme-color" content="#0f172a">',
        f'<link rel="icon" type="image/png" sizes="32x32" href="{LOGO}">',
        f'<link rel="apple-touch-icon" href="{LOGO}">',
        f'<meta property="og:title" content="{esc(page["title"])}">',
        f'<meta property="og:description" content="{esc(page["description"])}">',
        f'<meta property="og:url" content="{url}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:image" content="{og_image}">',
        f'<meta property="og:site_name" content="Develo">',
        f'<meta property="og:locale" content="{"en_US" if lang == "en" else "es_AR"}">',
        '<meta name="twitter:card" content="summary">',
        f'<meta name="twitter:title" content="{esc(page["title"])}">',
        f'<meta name="twitter:description" content="{esc(page["description"])}">',
        f'<meta name="twitter:image" content="{og_image}">',
    ]
    if page.get("hreflang"):
        for lang_code, href in page["hreflang"].items():
            parts.append(f'<link rel="alternate" hreflang="{lang_code}" href="{href}">')
    parts.append('<link rel="stylesheet" href="/css/style.css">')
    return "\n  ".join(parts)


def build_schemas(page: dict) -> str:
    blocks = [schemas.organization(), schemas.webpage(
        page["path"], page["title"], page["description"], page["lang"])]
    if "website" in page.get("schema", []):
        blocks.append(schemas.website())
    if page.get("crumbs"):
        blocks.append(schemas.breadcrumb(page["crumbs"]))
    for key in page.get("schema", []):
        if key == "service":
            blocks.append(schemas.service(
                page["path"], page["h1"].split(" with ")[0], page["description"]))
        elif key == "software":
            sw = page["software"]
            blocks.append(schemas.software(
                page["path"], sw["name"], sw["description"], sw["features"]))
        elif key == "article":
            blocks.append(schemas.article(
                page["path"], page["title"].split(" | ")[0], page["description"]))
        elif key == "faq" and page.get("faq"):
            blocks.append(schemas.faq(page["faq"]))
    out = []
    for b in blocks:
        out.append(
            '<script type="application/ld+json">' +
            json.dumps(b, ensure_ascii=False, indent=None).replace("</", "<\\/") +
            "</script>")
    return "\n  ".join(out)


def build_nav(page: dict) -> str:
    items = []
    for label, href in NAV:
        active = " active" if (href == page["path"] or
                               (href != "/" and page["path"].startswith(href))) else ""
        items.append(f'<a class="nav-link{active}" href="{href}">{esc(label)}</a>')
    es_href = "/es/" if page["lang"] == "en" else "/"
    es_label = "Español" if page["lang"] == "en" else "English"
    return f"""
  <a class="brand" href="/">{LOGO_SVG}</a>
  <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation">
    <span></span><span></span><span></span>
  </button>
  <nav class="nav" id="nav-menu" data-nav-menu aria-label="Main">
    {"".join(items)}
    <a class="nav-link lang-switch" href="{es_href}">{esc(es_label)}</a>
    <a class="btn btn-small" href="mailto:info@develo.ar?subject=Book%20a%20meeting%20with%20Develo">Book a Meeting</a>
  </nav>
"""


def build_breadcrumbs(page: dict) -> str:
    if not page.get("crumbs"):
        return ""
    items = ['<a href="/">Home</a>']
    for name, url in page["crumbs"][:-1]:
        items.append(f'<a href="{url}">{esc(name)}</a>')
    items.append(f'<span aria-current="page">{esc(page["crumbs"][-1][0])}</span>')
    return ('<nav class="breadcrumbs" aria-label="Breadcrumb">'
            "<ol>" + "".join(f"<li>{it}</li>" for it in items) + "</ol></nav>")


def render_block(b: dict, page: dict) -> str:
    t = b["t"]
    if t == "p":
        return f'<p>{b["html"]}</p>'
    if t == "h2":
        return f"<h2>{esc(b['text'])}</h2>"
    if t == "h3":
        return f"<h3>{esc(b['text'])}</h3>"
    if t == "list":
        return "<ul class='list'>" + "".join(f"<li>{esc(i)}</li>" for i in b["items"]) + "</ul>"
    if t == "grid":
        cards = []
        for it in b["items"]:
            cls = "card"
            inner = f'<h3>{esc(it["title"])}</h3><p>{it["body"]}</p>'
            if it.get("href"):
                inner += f'<span class="card-more">Learn more →</span>'
                cards.append(f'<a class="card" href="{it["href"]}">{inner}</a>')
            else:
                cards.append(f'<div class="card">{inner}</div>')
        return f'<div class="grid cols-{b.get("cols", 3)}">' + "".join(cards) + "</div>"
    if t == "faq":
        faq_items = page.get("faq", [])
        parts = []
        for q in faq_items:
            parts.append(
                f'<details class="faq-item"><summary>{esc(q["q"])}</summary>'
                f'<p>{esc(q["a"])}</p></details>')
        return '<div class="faq">' + "".join(parts) + "</div>"
    if t == "code":
        return f'<pre class="diagram"><code>{esc(b["text"])}</code></pre>'
    if t == "callout":
        return (f'<div class="callout"><h3>{esc(b["title"])}</h3>'
                f'<p>{b["body"]}</p></div>')
    if t == "links":
        cards = "".join(
            f'<a class="card card-link" href="{it["href"]}"><h3>{esc(it["label"])}</h3>'
            f'<p>{esc(it["note"])}</p><span class="card-more">Go to page →</span></a>'
            for it in b["items"])
        return f'<div class="grid cols-{min(len(b["items"]), 3)}">{cards}</div>'
    if t == "quote":
        return (f'<blockquote class="quote"><p>“{esc(b["text"])}”</p>'
                f'<cite>— {esc(b["cite"])}</cite></blockquote>')
    if t == "cta":
        return f"""
    <div class="cta">
      <h2>{esc(b["title"])}</h2>
      <p>{b["body"]}</p>
      <a class="btn" href="mailto:info@develo.ar?subject=Book%20a%20meeting%20with%20Develo">Book a Meeting</a>
    </div>
"""
    raise ValueError(f"Unknown block type: {t}")


def build_footer() -> str:
    sol = "".join(f'<li><a href="{h}">{esc(l)}</a></li>' for l, h in FOOTER_SOLUTIONS)
    comp = "".join(f'<li><a href="{h}">{esc(l)}</a></li>' for l, h in FOOTER_COMPANY)
    return f"""
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/">{LOGO_SVG}</a>
          <p>Custom software, AI agents and automation for digital business operations. Buenos Aires, Argentina.</p>
          <p class="footer-contact">
            <a href="mailto:{EMAIL}">{EMAIL}</a><br>
            <a href="tel:+541132090851">+54 11 3209-0851</a>
          </p>
          <p class="footer-social">
            <a href="https://www.linkedin.com/company/wearedevelo" rel="noopener" target="_blank">LinkedIn</a>
            <a href="https://www.instagram.com/develo.arg" rel="noopener" target="_blank">Instagram</a>
          </p>
        </div>
        <div>
          <h3>Solutions</h3>
          <ul>{sol}<li><a href="/solutions/">All Solutions</a></li></ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>{comp}</ul>
        </div>
        <div>
          <h3>Legal</h3>
          <ul>
            <li><a href="/privacy-policy/">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> Develo. All rights reserved.</p>
      </div>
    </footer>
"""


def render_page(page: dict) -> str:
    sections = "\n".join(render_block(b, page) for b in page["sections"])
    lang = page["lang"]
    home = page["path"] in ("/", "/es/")
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  {build_head(page)}
  {build_schemas(page)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    {build_nav(page)}
  </header>
  <main id="main">
    <div class="container">
      {build_breadcrumbs(page)}
      <section class="hero">
        <h1>{esc(page["h1"])}</h1>
        <p class="intro">{page["intro"]}</p>
      </section>
      <div class="content">
{sections}
      </div>
    </div>
  </main>
{build_footer()}
  <script src="/js/main.js"></script>
</body>
</html>
"""
