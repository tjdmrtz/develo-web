"""Static assets: CSS, JS and SEO files (robots.txt, sitemap.xml, llms.txt)."""

from .content import PAGES
from .schemas import BASE, EMAIL

CSS = r"""
:root {
  --bg: #0f172a;
  --bg-soft: #111c33;
  --surface: #16233d;
  --surface-2: #1c2c4a;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --accent: #38bdf8;
  --accent-dark: #0284c7;
  --line: #24365c;
  --ok: #34d399;
  --radius: 12px;
  --maxw: 1100px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; }

.container {
  max-width: var(--maxw);
  width: 100%;
  margin: 0 auto;
  padding: 0 1.25rem;
}

img { max-width: 100%; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--accent);
  color: #082f49;
  padding: 0.5rem 1rem;
  z-index: 100;
}
.skip-link:focus { left: 0; }

/* ---------- Header ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.site-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.brand { color: var(--text); }
.brand:hover { text-decoration: none; }
.logo { display: block; }

.nav {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
}
.nav-link {
  color: var(--text);
  font-size: 0.95rem;
  padding: 0.25rem 0;
}
.nav-link:hover { color: var(--accent); text-decoration: none; }
.nav-link.active { color: var(--accent); font-weight: 600; }
.lang-switch { color: var(--muted); border-left: 1px solid var(--line); padding-left: 1rem; }

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 6px;
}
.nav-toggle span {
  width: 24px; height: 2px;
  background: var(--text);
  border-radius: 2px;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-block;
  background: var(--accent);
  color: #082f49;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn:hover { background: #7dd3fc; text-decoration: none; transform: translateY(-1px); }
.btn-small { padding: 0.45rem 1rem; font-size: 0.9rem; }

/* ---------- Hero ---------- */
.hero {
  padding: 3.5rem 0 2rem;
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}
.hero h1 {
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.2rem;
  background: linear-gradient(90deg, #f1f5f9, #bae6fd);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.intro {
  font-size: 1.12rem;
  color: var(--muted);
  max-width: 46rem;
  margin: 0 auto;
}

/* ---------- Breadcrumbs ---------- */
.breadcrumbs { padding-top: 1.25rem; font-size: 0.85rem; color: var(--muted); }
.breadcrumbs ol {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.breadcrumbs li { display: flex; gap: 0.35rem; align-items: center; }
.breadcrumbs li + li::before { content: "/"; color: var(--line); }
.breadcrumbs a { color: var(--muted); }
.breadcrumbs a:hover { color: var(--accent); }
.breadcrumbs [aria-current] { color: var(--text); }

/* ---------- Content ---------- */
.content { padding: 1.5rem 0 3rem; }
.content h2 {
  font-size: 1.55rem;
  margin: 2.75rem 0 1rem;
  letter-spacing: -0.01em;
}
.content p { margin-bottom: 1rem; color: #cbd5e1; max-width: 65ch; }
.content .hero + .content { margin-top: 0; }

.list { margin: 0 0 1rem 1.2rem; color: #cbd5e1; max-width: 65ch; }
.list li { margin-bottom: 0.45rem; }
.list li::marker { color: var(--accent); }

/* ---------- Cards / grids ---------- */
.grid {
  display: grid;
  gap: 1rem;
  margin: 1.25rem 0;
}
.grid.cols-1 { grid-template-columns: 1fr; }
.grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid.cols-4 { grid-template-columns: repeat(4, 1fr); }

.card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.25rem;
  transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
  color: var(--text);
}
a.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  text-decoration: none;
  background: var(--surface-2);
}
.card h3 { font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text); }
.card p { font-size: 0.92rem; color: var(--muted); margin: 0; }
.card-more { display: inline-block; margin-top: 0.7rem; font-size: 0.85rem; color: var(--accent); font-weight: 600; }
.card-link { color: var(--text); }

/* ---------- Callout / quote ---------- */
.callout {
  background: var(--surface);
  border-left: 4px solid var(--accent);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
}
.callout h3 { margin-bottom: 0.4rem; font-size: 1.05rem; }
.callout p { margin: 0; color: var(--muted); }

.quote {
  margin: 1.5rem 0;
  padding: 1.5rem 2rem;
  border-left: 4px solid var(--ok);
  background: var(--surface);
  border-radius: 0 var(--radius) var(--radius) 0;
}
.quote p { font-size: 1.1rem; font-style: italic; color: var(--text); margin-bottom: 0.5rem; }
.quote cite { color: var(--muted); font-style: normal; font-size: 0.9rem; }

/* ---------- FAQ ---------- */
.faq { margin: 1rem 0 1.5rem; max-width: 56rem; }
.faq-item {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: 0.6rem;
  overflow: hidden;
}
.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.9rem 1.2rem;
  list-style: none;
  position: relative;
  padding-right: 2.5rem;
}
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after {
  content: "+";
  position: absolute;
  right: 1.1rem;
  color: var(--accent);
  font-size: 1.3rem;
  top: 50%;
  transform: translateY(-50%);
}
.faq-item[open] summary::after { content: "–"; }
.faq-item p { padding: 0 1.2rem 1rem; color: var(--muted); margin: 0; }

/* ---------- Diagram ---------- */
.diagram {
  background: #0b1220;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  margin: 1rem 0 1.5rem;
}
.diagram code {
  font-family: ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace;
  font-size: 0.85rem;
  color: #93c5fd;
  white-space: pre;
  line-height: 1.6;
}

/* ---------- CTA ---------- */
.cta {
  text-align: center;
  background: linear-gradient(135deg, var(--surface) 0%, #12315e 100%);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 3rem 1.5rem;
  margin: 3rem 0 1rem;
}
.cta h2 { margin: 0 0 0.75rem; font-size: 1.7rem; }
.cta p { color: var(--muted); max-width: 40rem; margin: 0 auto 1.5rem; }

/* ---------- Footer ---------- */
footer {
  background: var(--bg-soft);
  border-top: 1px solid var(--line);
  margin-top: 2rem;
}
.footer-grid {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 2.5rem 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
}
.footer-grid h3 { font-size: 0.95rem; margin-bottom: 0.7rem; color: var(--text); }
.footer-grid ul { list-style: none; }
.footer-grid li { margin-bottom: 0.45rem; }
.footer-grid a { color: var(--muted); font-size: 0.92rem; }
.footer-grid a:hover { color: var(--accent); }
.footer-brand p { color: var(--muted); font-size: 0.92rem; margin-top: 0.75rem; max-width: 30ch; }
.footer-contact { line-height: 1.8; }
.footer-social { display: flex; gap: 1rem; }
.footer-bottom {
  border-top: 1px solid var(--line);
  text-align: center;
  padding: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
}

/* ---------- Mobile ---------- */
@media (max-width: 860px) {
  .grid.cols-2, .grid.cols-3, .grid.cols-4 { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .nav-toggle { display: flex; }
  .nav {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.75rem 0 0.5rem;
  }
  .nav.open { display: flex; }
  .lang-switch { border-left: 0; padding-left: 0; }
  .hero { padding: 2.25rem 0 1rem; }
  .content h2 { margin-top: 2rem; }
}

/* ---------- LLM visualization ---------- */
.llm-viz-shell {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  padding: 1rem;
  margin: 1.25rem 0 1.5rem;
}
.llm-viz-caption {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}
.llm-viz-dims { color: var(--muted); font-size: 0.85rem; margin: 0.2rem 0 0.75rem; }
.llm-viz-stage {
  position: relative;
  height: clamp(520px, 46vw, 680px);
  min-height: 360px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  touch-action: pan-y;
}
.llm-viz-stage canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 250ms ease;
}
.llm-viz-shell.is-ready .llm-viz-stage canvas { opacity: 1; }
.llm-viz-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
}
.llm-viz-shell.is-ready:not(.is-fallback) .llm-viz-fallback { opacity: 0; pointer-events: none; transition: opacity 250ms ease; }
.llm-viz-diagram { width: 100%; height: auto; }
.llm-viz-dom-overlay {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.75rem;
  pointer-events: none;
}
.llm-viz-stage-title { font-weight: 700; margin: 0; color: var(--text); }
.llm-viz-stage-desc, .llm-viz-probs, .llm-viz-hint { margin: 0.2rem 0 0; color: var(--muted); font-size: 0.9rem; }
.llm-viz-controls { margin-top: 0.85rem; }
.llm-viz-progress {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  list-style: none;
  color: var(--muted);
  font-size: 0.78rem;
  margin: 0 0 0.7rem;
}
.llm-viz-progress .is-active { color: var(--accent); font-weight: 700; }
.llm-viz-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.llm-viz-shell button.btn {
  border: 0;
  cursor: pointer;
  font: inherit;
}
.llm-viz-shell .btn[hidden] { display: none !important; }
.llm-viz-disclaimer { color: var(--muted); font-size: 0.82rem; margin: 0.75rem 0 0; max-width: none; }
@media (max-width: 860px) {
  .llm-viz-stage { height: clamp(360px, 105vw, 500px); }
}
@media (prefers-reduced-motion: reduce) {
  .llm-viz-stage canvas, .llm-viz-shell.is-ready:not(.is-fallback) .llm-viz-fallback { transition: none; }
}
"""

JS = r"""
(function () {
  "use strict";

  function setYear(doc) {
    var el = doc.getElementById("year");
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  function initNav(doc) {
    var btn = doc.querySelector("[data-nav-toggle]");
    var menu = doc.querySelector("[data-nav-menu]");
    if (!btn || !menu) { return; }
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (menu.classList) { menu.classList.toggle("open", !open); }
    });
  }

  function showEdgeInfo(doc, win) {
    var el = doc.getElementById("deploy-info");
    if (!el || typeof win === "undefined" || !win || !win.location) { return; }
    if (typeof fetch === "undefined") { return; }
    try {
      fetch(win.location.href, { method: "HEAD" }).then(function (res) {
        var region = res.headers.get("X-Edge-Location");
        if (region) { el.textContent = "Served from CloudFront edge: " + region; }
      }).catch(function () { /* header not exposed — no problem */ });
    } catch (e) { /* not in a browser context */ }
  }

  if (typeof document !== "undefined") {
    setYear(document);
    initNav(document);
    showEdgeInfo(document, typeof window !== "undefined" ? window : undefined);
  }
})();
"""

ROBOTS = f"""\
# Develo — crawler policy
# All content is public and intended for search engines and AI assistants.

User-agent: *
Allow: /

# AI search crawlers — deliberately allowed so Develo is
# discoverable in ChatGPT Search, Claude and other LLM-powered search.
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: {BASE}/sitemap.xml
"""

LLMS_TXT = f"""\
# Develo

> Develo is a software engineering and artificial intelligence company based in
> Buenos Aires, Argentina. We build custom software, AI agents and automation
> platforms for customer service, WhatsApp, marketplaces (including Mercado
> Libre) and digital business operations. We engineer on AWS, run large
> language models through Amazon Bedrock, build autonomous AI agents with tool
> access over the Model Context Protocol (MCP), and apply RAG and LLM
> fine-tuning where they measurably improve quality.

## Company

- About Develo: {BASE}/about/
- Contact: {BASE}/contact/
- Technology stack (AWS, Amazon Bedrock, AI agents, MCP, LLM fine-tuning): {BASE}/technologies/

## Solutions

- All solutions: {BASE}/solutions/
- Custom software development: {BASE}/solutions/custom-software-development/
- Artificial intelligence for business: {BASE}/solutions/artificial-intelligence/
- AI agent development: {BASE}/solutions/ai-agents/
- Customer service automation: {BASE}/solutions/customer-service-automation/
- AI agents for WhatsApp customer service: {BASE}/solutions/ai-for-whatsapp/
- Marketplace & ecommerce automation: {BASE}/solutions/marketplace-automation/
- AI automation for Mercado Libre sellers: {BASE}/solutions/ai-for-mercado-libre/
- API & system integrations: {BASE}/solutions/api-integrations/

## Products

- d-ialog (conversational AI platform): {BASE}/solutions/d-ialog/
- Develo Multi-Agent (agent orchestration platform): {BASE}/solutions/develomultiagent/

## Industries, proof and knowledge

- Ecommerce & retail: {BASE}/industries/ecommerce-retail/
- Case studies: {BASE}/case-studies/
- Tecnoland & Distriland case study: {BASE}/case-studies/tecnoland-distriland/
- Insights: {BASE}/insights/
- AI agents vs traditional chatbots: {BASE}/insights/ai-agents-vs-chatbots/

## Legal

- Privacy policy: {BASE}/privacy-policy/
- Terms & conditions: {BASE}/terms-and-conditions/

## Contact

- Email: {EMAIL}
- Phone: +54 11 3209-0851
- Location: Buenos Aires, Argentina
"""


def sitemap_xml() -> str:
    urls = [BASE + p["path"] for p in PAGES]
    rows = "".join(f"  <url><loc>{u}</loc></url>\n" for u in sorted(set(urls)))
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + rows
        + "</urlset>\n"
    )
