"""
JSON-LD / Schema.org builders (factory pattern: one builder per entity type).

See develo/fix_indentation.md §18 and §22: explicit entities and
relationships are what search engines and LLM retrieval systems consume.
"""

BASE = "https://develo.software"

LOGO = BASE + "/assets/develo-mark.png"
EMAIL = "info@develo.ar"
PHONE = "+54 11 3209-0851"
PUBLISH_DATE = "2026-08-14"


def _org_ref():
    return {"@type": "Organization", "name": "Develo", "url": BASE + "/"}


def organization(lang="en"):
    spanish = lang == "es"
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": BASE + "/#organization",
        "name": "Develo",
        "legalName": "Develo",
        "url": BASE + "/",
        "logo": LOGO,
        "description": (
            "Develo desarrolla software a medida, agentes de inteligencia artificial y "
            "automatización para atención al cliente, WhatsApp, marketplaces y operaciones digitales."
            if spanish else
            "Develo builds custom software, artificial intelligence agents and "
            "automation solutions for customer service, WhatsApp, marketplaces "
            "and digital business operations."
        ),
        "email": EMAIL,
        "telephone": PHONE,
        "foundingLocation": {"@type": "Place",
                             "name": "Buenos Aires",
                             "addressCountry": "AR"},
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Buenos Aires",
            "addressRegion": "Ciudad Autónoma de Buenos Aires",
            "addressCountry": "AR",
        },
        "areaServed": ["AR", "US", "ES", "MX", "BR", "CL", "CO"],
        "knowsAbout": ([
            "desarrollo de software a medida", "inteligencia artificial", "agentes de IA",
            "automatización de atención al cliente", "automatización de WhatsApp",
            "automatización de Mercado Libre", "integraciones API", "Amazon Web Services",
            "Amazon Bedrock", "fine-tuning de LLMs",
        ] if spanish else [
            "custom software development", "artificial intelligence", "AI agents",
            "customer service automation", "WhatsApp automation", "Mercado Libre automation",
            "API integrations", "Amazon Web Services", "Amazon Bedrock", "LLM fine-tuning",
        ]),
        "sameAs": [
            "https://www.linkedin.com/company/wearedevelo",
            "https://www.instagram.com/develo.arg",
        ],
    }


def webpage(path, title, description, lang="en"):
    url = BASE + path
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": description,
        "inLanguage": lang,
        "isPartOf": {"@id": BASE + "/#website"},
        "about": _org_ref(),
    }


def website():
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": BASE + "/#website",
        "url": BASE + "/",
        "name": "Develo",
        "publisher": {"@id": BASE + "/#organization"},
        "inLanguage": ["en", "es"],
    }


def breadcrumb(crumbs, lang="en"):
    """crumbs: list of (name, url) tuples after 'Home'; last one is the page itself."""
    items = [{
        "position": 1,
        "name": "Inicio" if lang == "es" else "Home",
        "item": BASE + ("/es/" if lang == "es" else "/"),
    }]
    for i, (name, url) in enumerate(crumbs, start=2):
        items.append({"position": i, "name": name, "item": url})
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items,
    }


def service(path, name, description, lang="en"):
    url = BASE + path
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": url + "#service",
        "name": name,
        "description": description,
        "url": url,
        "serviceType": name,
        "provider": {"@id": BASE + "/#organization"},
        "areaServed": "Américas" if lang == "es" else "Americas",
        "audience": {"@type": "BusinessAudience",
                     "name": "Empresas y organizaciones" if lang == "es" else "Companies and organizations"},
    }


def software(path, name, description, features, lang="en"):
    url = BASE + path
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": url + "#software",
        "name": name,
        "description": description,
        "url": url,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "featureList": features,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD",
                   "description": "Contacte a Develo para solicitar una cotización" if lang == "es" else "Contact Develo for a quote"},
        "provider": {"@id": BASE + "/#organization"},
    }


def article(path, headline, description, date=PUBLISH_DATE):
    url = BASE + path
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": url + "#article",
        "headline": headline,
        "description": description,
        "url": url,
        "mainEntityOfPage": url,
        "datePublished": date,
        "dateModified": date,
        "author": {"@id": BASE + "/#organization"},
        "publisher": {"@id": BASE + "/#organization"},
    }


def faq(items):
    """items: [{"q": ..., "a": ...}]"""
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q["q"],
                "acceptedAnswer": {"@type": "Answer", "text": q["a"]},
            }
            for q in items
        ],
    }
