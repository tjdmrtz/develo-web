"""
HTML rendering (Template Method pattern: shared head/nav/footer skeleton,
data-driven body blocks).
"""

import html
import json
import re

from . import schemas
from .schemas import BASE, EMAIL

NAV = [
    ("Home", "/"),
    ("Solutions", "/solutions/"),
    ("Technologies", "/technologies/"),
    ("Industries", "/industries/ecommerce-retail/"),
    ("Case Studies", "/case-studies/"),
    ("Insights", "/insights/"),
    ("About", "/about/"),
]

NAV_ES = [
    ("Inicio", "/"),
    ("Soluciones", "/solutions/"),
    ("Tecnologías", "/technologies/"),
    ("Industrias", "/industries/ecommerce-retail/"),
    ("Casos de éxito", "/case-studies/"),
    ("Contenido", "/insights/"),
    ("Nosotros", "/about/"),
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

FOOTER_SOLUTIONS_ES = [
    ("Software a medida", "/solutions/custom-software-development/"),
    ("Inteligencia artificial", "/solutions/artificial-intelligence/"),
    ("Agentes de IA", "/solutions/ai-agents/"),
    ("Automatización de atención", "/solutions/customer-service-automation/"),
    ("IA para WhatsApp", "/solutions/ai-for-whatsapp/"),
    ("d-ialog", "/solutions/d-ialog/"),
]

FOOTER_COMPANY_ES = [
    ("Acerca de Develo", "/about/"),
    ("Tecnologías", "/technologies/"),
    ("Casos de éxito", "/case-studies/"),
    ("Contenido", "/insights/"),
    ("Contacto", "/contact/"),
]

LOGO_SVG = (
    '<span class="brand-wordmark" aria-label="Develo">&lt;develo&gt;</span>'
)


def esc(t: str) -> str:
    return html.escape(t, quote=True)


AMP = '<span class="amp">&amp;</span>'


def display_text(t: str) -> str:
    """Escape plain display copy and render ampersands with a reliable glyph."""
    return esc(t).replace("&amp;", AMP)


def localized_path(path: str, lang: str) -> str:
    """Return the same internal page in the requested locale."""
    absolute = path.startswith(BASE)
    value = path[len(BASE):] if absolute else path
    if not value.startswith("/"):
        return path
    if lang == "es":
        if value == "/":
            value = "/es/"
        elif not value.startswith("/es/"):
            value = "/es" + value
    elif value == "/es/":
        value = "/"
    elif value.startswith("/es/"):
        value = value[3:]
    return (BASE if absolute else "") + value


def rich_text(t: str, page: dict | None = None) -> str:
    """Keep trusted inline markup while normalizing literal ampersands."""
    if page:
        t = re.sub(
            r'href=(["\'])(/[^"\']*)\1',
            lambda match: f'href={match.group(1)}{localized_path(match.group(2), page["lang"])}{match.group(1)}',
            t,
        )
    return re.sub(r"&(?![A-Za-z0-9#]+;)", AMP, t)


def build_head(page: dict) -> str:
    url = BASE + page["path"]
    lang = page["lang"]
    og_image = BASE + "/assets/develo-social-card.png"
    parts = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f"<title>{esc(page['title'])}</title>",
        f'<meta name="description" content="{esc(page["description"])}">',
        f'<link rel="canonical" href="{url}">',
        '<meta name="theme-color" content="#ffffff">',
        '<link rel="icon" type="image/png" sizes="192x192" href="/assets/develo-mark.png">',
        '<link rel="apple-touch-icon" href="/assets/develo-mark.png">',
        f'<meta property="og:title" content="{esc(page["title"])}">',
        f'<meta property="og:description" content="{esc(page["description"])}">',
        f'<meta property="og:url" content="{url}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:image" content="{og_image}">',
        '<meta property="og:site_name" content="Develo">',
        f'<meta property="og:locale" content="{"en_US" if lang == "en" else "es_AR"}">',
        '<meta name="twitter:card" content="summary">',
        f'<meta name="twitter:title" content="{esc(page["title"])}">',
        f'<meta name="twitter:description" content="{esc(page["description"])}">',
        f'<meta name="twitter:image" content="{og_image}">',
    ]
    english_path = localized_path(page["path"], "en")
    spanish_path = localized_path(page["path"], "es")
    for lang_code, href in (
        ("en", BASE + english_path),
        ("es", BASE + spanish_path),
        ("x-default", BASE + english_path),
    ):
        parts.append(f'<link rel="alternate" hreflang="{lang_code}" href="{href}">')
    parts.append('<link rel="stylesheet" href="/css/style.css">')
    return "\n  ".join(parts)


def build_schemas(page: dict) -> str:
    blocks = [schemas.organization(page["lang"]), schemas.webpage(
        page["path"], page["title"], page["description"], page["lang"])]
    if "website" in page.get("schema", []):
        blocks.append(schemas.website())
    if page.get("crumbs"):
        blocks.append(schemas.breadcrumb(page["crumbs"], page["lang"]))
    for key in page.get("schema", []):
        if key == "service":
            blocks.append(schemas.service(
                page["path"], page["h1"].split(" with ")[0], page["description"], page["lang"]))
        elif key == "software":
            sw = page["software"]
            blocks.append(schemas.software(
                page["path"], sw["name"], sw["description"], sw["features"], page["lang"]))
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
    lang = page["lang"]
    ui = {
        "menu": "Menú" if lang == "es" else "Menu",
        "product": "Producto" if lang == "es" else "Product",
        "platform": "Plataforma de IA conversacional" if lang == "es" else "Conversational AI platform",
        "cases": "Casos de éxito" if lang == "es" else "Case studies",
        "intervan": "Copiloto y backoffice empresarial" if lang == "es" else "Enterprise copilot and backoffice",
        "distriland": "Experiencia digital de clientes" if lang == "es" else "Digital customer experience",
        "all_cases": "Ver todos los casos de éxito" if lang == "es" else "View all case studies",
        "meeting": "Agendar reunión" if lang == "es" else "Book a Meeting",
        "nav_label": "Navegación principal" if lang == "es" else "Main navigation",
        "toggle": "Abrir o cerrar navegación" if lang == "es" else "Toggle navigation",
    }
    items = []
    comparable_path = localized_path(page["path"], "en")
    for label, href in (NAV_ES if lang == "es" else NAV):
        active = " active" if (href == comparable_path or
                               (href != "/" and comparable_path.startswith(href))) else ""
        items.append(
            f'<a class="nav-link{active}" href="{localized_path(href, lang)}">{display_text(label)}</a>'
        )
    switch_href = localized_path(page["path"], "es" if lang == "en" else "en")
    switch_label = "Español" if lang == "en" else "English"
    home_href = localized_path("/", lang)
    ticker = (
        "SOLUCIONES DIGITALES // EXPERIENCIAS DE CLIENTE // AGENTES DE IA // AUTOMATIZACIÓN //"
        if lang == "es" else
        "DEVELOP DIGITAL SOLUTIONS // ELEVATE YOUR CUSTOMER EXPERIENCE // AI AGENTS // AUTOMATION //"
    )
    return f"""
  <a class="brand" href="{home_href}">{LOGO_SVG}</a>
  <div class="header-ticker" data-ticker aria-hidden="true">
    <span>{ticker}</span>
    <span>{ticker}</span>
  </div>
  <div class="header-tools">
    <a class="header-language" href="{switch_href}" hreflang="{'es' if lang == 'en' else 'en'}">{display_text(switch_label)}</a>
    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav-menu" aria-label="{ui['toggle']}">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="nav" id="nav-menu" data-nav-menu aria-label="{ui['nav_label']}">
    <div class="nav-panel">
      <p class="nav-label">{ui['menu']}</p>
      <div class="nav-primary">{"".join(items)}</div>
      <div class="nav-featured">
        <p class="nav-group-label">{ui['product']}</p>
        <a href="{localized_path('/solutions/d-ialog/', lang)}"><strong>d-ialog</strong><span>{ui['platform']}</span></a>
        <p class="nav-group-label">{ui['cases']}</p>
        <a href="{localized_path('/case-studies/intervan/', lang)}"><strong>Intervan</strong><span>{ui['intervan']}</span></a>
        <a href="{localized_path('/case-studies/tecnoland-distriland/', lang)}"><strong>Tecnoland <span class="amp">&amp;</span> Distriland</strong><span>{ui['distriland']}</span></a>
        <a class="nav-all-cases" href="{localized_path('/case-studies/', lang)}">{ui['all_cases']} →</a>
      </div>
      <div class="nav-actions">
        <a class="nav-language" href="{switch_href}" hreflang="{'es' if lang == 'en' else 'en'}">{display_text(switch_label)}</a>
        <a class="btn btn-small" href="mailto:info@develo.ar?subject={'Agendar%20una%20reunion%20con%20Develo' if lang == 'es' else 'Book%20a%20meeting%20with%20Develo'}">{ui['meeting']} <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </nav>
"""


def build_spatial_hero() -> str:
    """Code-native version of the animated perspective room on develo.ar."""
    ceiling = "".join(
        f'<line x1="{x}" y1="24" x2="{365 + i * 29}" y2="142"/>'
        for i, x in enumerate(range(28, 1174, 76))
    )
    floor = "".join(
        f'<line x1="{x}" y1="476" x2="{365 + i * 29}" y2="358"/>'
        for i, x in enumerate(range(28, 1174, 76))
    )
    sides = "".join(
        f'<path d="M28 {y} L365 {148 + i * 20} H835 L1172 {y}"/>'
        for i, y in enumerate(range(54, 476, 38))
    )
    back_grid = "".join(
        f'<line class="back-grid-line" x1="{365 + i * 39.17:.1f}" y1="142" '
        f'x2="{365 + i * 39.17:.1f}" y2="358"/>'
        for i in range(1, 12)
    )
    depth_frames = "".join(
        '<rect class="depth-frame" '
        f'x="{28 + (365 - 28) * step / 8:.1f}" '
        f'y="{24 + (142 - 24) * step / 8:.1f}" '
        f'width="{1144 + (470 - 1144) * step / 8:.1f}" '
        f'height="{452 + (216 - 452) * step / 8:.1f}"/>'
        for step in range(1, 8)
    )
    planes = [
        (200, 206, 38, 25, "blue"), (306, 269, 45, 42, "deep"),
        (434, 112, 64, 20, "soft"), (492, 294, 92, 20, "blue"),
        (542, 246, 72, 42, "soft"), (610, 226, 65, 20, "soft"),
        (754, 318, 105, 19, "deep"), (801, 214, 52, 22, "blue"),
        (850, 124, 106, 20, "blue"), (913, 117, 48, 44, "orange"),
        (972, 177, 61, 24, "orange"), (1032, 198, 34, 55, "blue"),
        (242, 349, 66, 21, "deep"), (950, 350, 66, 20, "blue"),
        (338, 341, 70, 10, "orange"), (878, 344, 78, 10, "orange"),
    ]
    rendered_planes = []
    travel = (-25, 18, -15, 27, -22, 16, -19, 24, -14, 21, -17, 26, -20, 15, -24, 19)
    for i, (x, y, w, h, color) in enumerate(planes):
        motion = "" if color == "orange" else f' data-motion="{"y" if i % 2 == 0 else "x"}" data-travel="{travel[i]}"'
        rendered_planes.append(
            f'<rect class="floating-plane {color}"{motion} '
            f'x="{x}" y="{y}" width="{w}" height="{h}"/>'
        )
    plane_svg = "".join(rendered_planes)
    return f"""
      <div class="spatial-hero" data-spatial-hero aria-hidden="true">
        <svg viewBox="0 0 1200 500" focusable="false">
          <g class="room-lines">
            <rect x="28" y="24" width="1144" height="452"/>
            <rect x="365" y="142" width="470" height="216"/>
            {depth_frames}
            <path d="M28 24 L365 142 M1172 24 L835 142 M28 476 L365 358 M1172 476 L835 358"/>
            {ceiling}{floor}{sides}{back_grid}
          </g>
          <g class="planes">{plane_svg}</g>
        </svg>
      </div>
"""


def build_breadcrumbs(page: dict) -> str:
    if not page.get("crumbs"):
        return ""
    lang = page["lang"]
    home_label = "Inicio" if lang == "es" else "Home"
    items = [f'<a href="{localized_path("/", lang)}">{home_label}</a>']
    for name, url in page["crumbs"][:-1]:
        items.append(f'<a href="{localized_path(url, lang)}">{display_text(name)}</a>')
    items.append(f'<span aria-current="page">{display_text(page["crumbs"][-1][0])}</span>')
    aria = "Ruta de navegación" if lang == "es" else "Breadcrumb"
    return (f'<nav class="breadcrumbs" aria-label="{aria}">'
            "<ol>" + "".join(f"<li>{it}</li>" for it in items) + "</ol></nav>")


def render_block(b: dict, page: dict) -> str:
    t = b["t"]
    lang = page["lang"]
    if t == "p":
        return f'<p>{rich_text(b["html"], page)}</p>'
    if t == "h2":
        return f"<h2>{display_text(b['text'])}</h2>"
    if t == "h3":
        return f"<h3>{display_text(b['text'])}</h3>"
    if t == "list":
        return "<ul class='list'>" + "".join(f"<li>{display_text(i)}</li>" for i in b["items"]) + "</ul>"
    if t == "grid":
        cards = []
        for it in b["items"]:
            image = ""
            card_class = "card"
            if it.get("image"):
                card_class += " case-card"
                image = (
                    '<div class="card-logo"><img class="client-logo" '
                    f'src="{it["image"]}" alt="{esc(it["image_alt"])}" '
                    f'width="{it["image_width"]}" height="{it["image_height"]}" loading="lazy"></div>'
                )
            inner = image + f'<h3>{display_text(it["title"])}</h3><p>{rich_text(it["body"], page)}</p>'
            if it.get("href"):
                more = "Ver más" if lang == "es" else "Learn more"
                inner += f'<span class="card-more">{more} →</span>'
                cards.append(
                    f'<a class="{card_class}" href="{localized_path(it["href"], lang)}">{inner}</a>'
                )
            else:
                cards.append(f'<div class="{card_class}">{inner}</div>')
        return f'<div class="grid cols-{b.get("cols", 3)}">' + "".join(cards) + "</div>"
    if t == "product_showcase":
        labels = {
            "operations": "Operación en vivo" if lang == "es" else "Live operations",
            "conversations": "Conversaciones" if lang == "es" else "Conversations",
            "conversation_copy": (
                "Revise cada respuesta, fuente y derivación desde una única vista operativa."
                if lang == "es" else
                "Review every answer, source and escalation from one operational view."
            ),
            "service": "Servicio medible" if lang == "es" else "Measurable service",
            "metrics": "Métricas" if lang == "es" else "Metrics",
            "metrics_copy": (
                "Mida adopción, calidad de respuesta, fuentes y demanda por área de negocio."
                if lang == "es" else
                "Track adoption, response quality, sources and demand by business area."
            ),
            "conversation_alt": (
                "Consola de conversaciones de d-ialog con filtros, respuestas del copiloto y fuentes de conocimiento"
                if lang == "es" else
                "d-ialog conversation operations console with filters, copilot responses and knowledge sources"
            ),
            "metrics_alt": (
                "Panel de métricas de d-ialog con analítica de respuestas, fuentes, uso y cobertura de conocimiento"
                if lang == "es" else
                "d-ialog copilot metrics dashboard with response, source, usage and knowledge coverage analytics"
            ),
        }
        return f"""
    <div class="product-showcase" data-product-showcase>
      <div class="product-shot product-shot-primary">
        <figure class="product-shot-visual">
          <div class="product-window"><span></span><span></span><span></span><em>{labels['operations']}</em></div>
          <div class="product-screen-frame">
            <img class="product-screen" src="/assets/products/dialog-conversations.png"
                 alt="{labels['conversation_alt']}"
                 width="2963" height="2067" fetchpriority="high" decoding="async">
          </div>
        <figcaption><strong>{labels['conversations']}</strong><span>{labels['conversation_copy']}</span></figcaption>
        </figure>
      </div>
      <div class="product-shot product-shot-secondary">
        <figure class="product-shot-visual">
          <div class="product-window"><span></span><span></span><span></span><em>{labels['service']}</em></div>
          <div class="product-screen-frame">
            <img class="product-screen" src="/assets/products/dialog-metrics.png"
                 alt="{labels['metrics_alt']}"
                 width="2976" height="1971" loading="lazy" decoding="async">
          </div>
        <figcaption><strong>{labels['metrics']}</strong><span>{labels['metrics_copy']}</span></figcaption>
        </figure>
      </div>
    </div>
"""
    if t == "brand":
        return (
            '<figure class="client-brand">'
            f'<img class="client-logo" src="{b["src"]}" alt="{esc(b["alt"])}" '
            f'width="{b["width"]}" height="{b["height"]}" loading="eager">'
            f'<figcaption>{display_text(b["caption"])}</figcaption></figure>'
        )
    if t == "faq":
        faq_items = page.get("faq", [])
        parts = []
        for q in faq_items:
            parts.append(
                f'<details class="faq-item"><summary>{display_text(q["q"])}</summary>'
                f'<p>{display_text(q["a"])}</p></details>')
        return '<div class="faq">' + "".join(parts) + "</div>"
    if t == "code":
        return f'<pre class="diagram"><code>{display_text(b["text"])}</code></pre>'
    if t == "callout":
        return (f'<div class="callout"><h3>{display_text(b["title"])}</h3>'
                f'<p>{rich_text(b["body"], page)}</p></div>')
    if t == "links":
        more = "Ir a la página" if lang == "es" else "Go to page"
        cards = "".join(
            f'<a class="card card-link" href="{localized_path(it["href"], lang)}"><h3>{display_text(it["label"])}</h3>'
            f'<p>{display_text(it["note"])}</p><span class="card-more">{more} →</span></a>'
            for it in b["items"])
        return f'<div class="grid cols-{min(len(b["items"]), 3)}">{cards}</div>'
    if t == "quote":
        return (f'<blockquote class="quote"><p>“{display_text(b["text"])}”</p>'
                f'<cite>— {display_text(b["cite"])}</cite></blockquote>')
    if t == "form":
        labels = {
            "name": "Nombre" if lang == "es" else "Your name",
            "company": "Empresa" if lang == "es" else "Company",
            "message": "Mensaje" if lang == "es" else "Message",
            "submit": "Preparar correo" if lang == "es" else "Prepare email",
        }
        return f"""
    <form class="contact-form" data-contact-form action="mailto:{EMAIL}" method="post" enctype="text/plain">
      <label>{labels['name']}<input type="text" name="name" autocomplete="name"></label>
      <label>{labels['company']}<input type="text" name="company" autocomplete="organization"></label>
      <label>Email<input type="email" name="email" autocomplete="email" required></label>
      <label class="form-message">{labels['message']}<textarea name="message" rows="6" required></textarea></label>
      <button class="btn" type="submit">{labels['submit']} <span aria-hidden="true">⟨›⟩</span></button>
    </form>
"""
    if t == "cta":
        meeting = "Agendar reunión" if lang == "es" else "Book a Meeting"
        subject = "Agendar%20una%20reunion%20con%20Develo" if lang == "es" else "Book%20a%20meeting%20with%20Develo"
        return f"""
    <div class="cta">
      <h2>{display_text(b["title"])}</h2>
      <p>{rich_text(b["body"], page)}</p>
      <a class="btn" href="mailto:info@develo.ar?subject={subject}">{meeting}</a>
    </div>
"""
    raise ValueError(f"Unknown block type: {t}")


def build_footer(page: dict) -> str:
    lang = page["lang"]
    solutions = FOOTER_SOLUTIONS_ES if lang == "es" else FOOTER_SOLUTIONS
    company = FOOTER_COMPANY_ES if lang == "es" else FOOTER_COMPANY
    sol = "".join(
        f'<li><a href="{localized_path(href, lang)}">{display_text(label)}</a></li>'
        for label, href in solutions
    )
    comp = "".join(
        f'<li><a href="{localized_path(href, lang)}">{display_text(label)}</a></li>'
        for label, href in company
    )
    labels = {
        "summary": (
            "Software a medida, agentes de IA y automatización para operaciones digitales. Buenos Aires, Argentina."
            if lang == "es" else
            "Custom software, AI agents and automation for digital business operations. Buenos Aires, Argentina."
        ),
        "solutions": "Soluciones" if lang == "es" else "Solutions",
        "all_solutions": "Todas las soluciones" if lang == "es" else "All Solutions",
        "company": "Empresa" if lang == "es" else "Company",
        "legal": "Legal",
        "privacy": "Política de privacidad" if lang == "es" else "Privacy Policy",
        "terms": "Términos y condiciones" if lang == "es" else "Terms & Conditions",
        "rights": "Todos los derechos reservados." if lang == "es" else "All rights reserved.",
    }
    home_href = localized_path("/", lang)
    return f"""
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="{home_href}">{LOGO_SVG}</a>
          <p>{labels['summary']}</p>
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
          <h3>{labels['solutions']}</h3>
          <ul>{sol}<li><a href="{localized_path('/solutions/', lang)}">{labels['all_solutions']}</a></li></ul>
        </div>
        <div>
          <h3>{labels['company']}</h3>
          <ul>{comp}</ul>
        </div>
        <div>
          <h3>{labels['legal']}</h3>
          <ul>
            <li><a href="{localized_path('/privacy-policy/', lang)}">{labels['privacy']}</a></li>
            <li><a href="{localized_path('/terms-and-conditions/', lang)}">{display_text(labels['terms'])}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> Develo. {labels['rights']}</p>
      </div>
    </footer>
"""


def render_page(page: dict) -> str:
    sections = "\n".join(
        f'<section class="content-block" data-reveal>{render_block(b, page)}</section>'
        for b in page["sections"]
    )
    lang = page["lang"]
    home = page["path"] in ("/", "/es/")
    spatial_hero = build_spatial_hero() if home else ""
    body_class = "home-page" if home else "inner-page"
    rendered = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  {build_head(page)}
  {build_schemas(page)}
</head>
<body class="{body_class}">
  <a class="skip-link" href="#main">{'Saltar al contenido' if lang == 'es' else 'Skip to content'}</a>
  <header class="site-header">
    {build_nav(page)}
  </header>
  <main id="main">
    <div class="container">
      {build_breadcrumbs(page)}
      {spatial_hero}
      <section class="hero" data-reveal>
        <h1>{display_text(page["h1"])}</h1>
        <div class="hero-summary">
          <p class="intro">{rich_text(page["intro"], page)}</p>
          <a class="hero-action" href="mailto:info@develo.ar?subject={'Agendar%20una%20reunion%20con%20Develo' if lang == 'es' else 'Book%20a%20meeting%20with%20Develo'}">{"Agendar reunión" if lang == "es" else "Book a Meeting"} <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <div class="content">
{sections}
      </div>
    </div>
  </main>
{build_footer(page)}
  <script src="/js/main.js"></script>
</body>
</html>
"""
    return "\n".join(line.rstrip() for line in rendered.splitlines()) + "\n"
