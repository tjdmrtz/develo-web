"""Static assets: CSS, JS and SEO files (robots.txt, sitemap.xml, llms.txt)."""

from .content import PAGES
from .schemas import BASE, EMAIL

MARK_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#FFFFFF"/>
  <path d="M36 55 8 96l28 41h24L32 96l28-41H36Zm120 0 28 41-28 41h-24l28-41-28-41h24Z" fill="#243CE6"/>
  <rect x="67" y="48" width="58" height="96" rx="3" fill="#243CE6"/>
</svg>\n"""

SOCIAL_CARD_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <g stroke="#111" stroke-width="2" opacity=".42" fill="none">
    <rect x="55" y="55" width="1090" height="410"/><rect x="340" y="165" width="520" height="210"/>
    <path d="M55 55 340 165M1145 55 860 165M55 465 340 375M1145 465 860 375M220 55 410 165M410 55 480 165M600 55V165M790 55 720 165M980 55 790 165M220 465 410 375M410 465 480 375M600 465V375M790 465 720 375M980 465 790 375"/>
  </g>
  <g fill="#243CE6"><rect x="248" y="250" width="74" height="24"/><rect x="474" y="205" width="102" height="30"/><rect x="728" y="286" width="118" height="28"/></g>
  <g fill="#D8400E"><rect x="830" y="185" width="82" height="32"/><rect x="358" y="350" width="72" height="16"/></g>
  <text x="55" y="560" font-family="monospace" font-size="64" font-weight="700" fill="#243CE6">&lt;develo&gt;</text>
  <text x="570" y="548" font-family="monospace" font-size="25" fill="#000000">CUSTOM SOFTWARE // AI AGENTS // AUTOMATION</text>
</svg>\n"""

NOT_FOUND_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>Page Not Found | Develo</title>
  <meta name="description" content="The requested page could not be found. Return to Develo to explore custom software, artificial intelligence agents and automation.">
  <link rel="icon" type="image/png" href="/assets/develo-mark.png">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="inner-page">
  <main id="main">
    <section class="hero error-hero">
      <h1>404 — Page not found</h1>
      <p class="intro">The route you requested does not exist or has moved. <a href="/">Return to the Develo homepage</a> or explore <a href="/solutions/">our solutions</a>.</p>
    </section>
  </main>
</body>
</html>
"""

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
"""

# Visual system reconstructed from the public develo.ar site.  Keeping this as
# an override makes the generated bundle self-contained while preserving the
# base accessibility rules above.
CSS += r"""
@font-face {
  font-family: "Space Grotesk";
  src: url("/assets/space-grotesk.woff2") format("woff2");
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}
@font-face {
  font-family: "Azeret Mono";
  src: url("/assets/azeret-mono.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Azeret Mono";
  src: url("/assets/azeret-mono-bold.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

:root {
  --brand-blue: #243CE6;
  --brand-navy: #100D28;
  --brand-black: #000000;
  --brand-white: #FFFFFF;
  --paper: var(--brand-white);
  --ink: var(--brand-black);
  --blue: var(--brand-blue);
  --blue-soft: color-mix(in srgb, var(--brand-blue) 58%, var(--brand-white));
  --orange: var(--brand-blue);
  --accent: var(--brand-blue);
  --grid-line: rgba(255,255,255,.105);
  --line-dark: rgba(16, 13, 40, .55);
  --mono: "Azeret Mono", "Courier New", ui-monospace, monospace;
  --display: "Space Grotesk", Arial, sans-serif;
  --maxw: 1280px;
  --radius: 0;
}

html { background: var(--paper); }
body {
  display: block;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.65;
  overflow-x: hidden;
}
body.nav-open { overflow: hidden; }
main { display: block; overflow: hidden; }
.container { max-width: none; padding: 0; }
a { color: inherit; }
a:hover { text-decoration: none; }

.skip-link {
  background: var(--orange);
  color: var(--paper);
  font-family: var(--mono);
  z-index: 1000;
}

/* ---------- Header / moving strapline ---------- */
.site-header {
  position: relative;
  top: auto;
  min-height: 122px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 190px;
  align-items: center;
  gap: 2rem;
  padding: 1.7rem max(3rem, calc((100vw - 1320px) / 2));
  background: var(--paper);
  backdrop-filter: none;
  color: var(--ink);
  border: 0;
  z-index: 80;
}
.brand { color: var(--brand-navy); white-space: nowrap; line-height: 1; }
.brand-wordmark {
  display: inline-block;
  font-family: var(--mono);
  font-size: clamp(2rem, 3vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -.08em;
}
.header-ticker {
  display: flex;
  gap: 4rem;
  overflow: hidden;
  color: var(--blue);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}
.header-ticker span {
  flex: 0 0 auto;
  min-width: max-content;
  animation: ticker-run 22s linear infinite;
}
@keyframes ticker-run { to { transform: translateX(calc(-100% - 4rem)); } }
.header-tools { display: flex; align-items: center; justify-content: flex-end; gap: 1.4rem; }
.header-language { color: var(--orange); font-size: 11px; }
.nav-toggle {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: .6rem;
  position: relative;
  z-index: 1002;
}
.nav-toggle span {
  width: 38px;
  height: 2px;
  background: var(--orange);
  border-radius: 0;
  transition: transform .25s ease, opacity .25s ease;
}
.nav-toggle[aria-expanded="true"] span:first-child { transform: translateY(9px) rotate(45deg); }
.nav-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav-toggle[aria-expanded="true"] span:last-child { transform: translateY(-9px) rotate(-45deg); }
.nav {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  align-items: center;
  justify-items: center;
  padding: clamp(5.5rem, 10vh, 8rem) 2rem 2.5rem;
  background-color: var(--brand-black);
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  transition: opacity .25s ease, visibility .25s ease;
  z-index: 1000;
}
.nav.open { display: grid; opacity: 1; visibility: visible; pointer-events: auto; }
.nav-panel {
  position: relative;
  width: min(980px, 100%);
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 1.25rem clamp(2rem, 6vw, 6rem);
  z-index: 1;
}
.nav-label { grid-column: 1 / -1; color: var(--orange); text-transform: uppercase; letter-spacing: .16em; }
.nav-primary { display: grid; align-content: start; }
.nav-link {
  color: var(--paper);
  font-family: var(--display);
  font-size: clamp(1.6rem, 4vw, 3.5rem);
  line-height: 1.15;
  border-bottom: 1px solid rgba(255,255,255,.28);
  padding: .4rem 0;
}
.nav-link:hover, .nav-link.active { color: var(--blue); }
.nav-featured { align-self: start; display: grid; gap: .65rem; }
.nav-group-label {
  margin: .1rem 0 .25rem;
  color: var(--orange);
  font-family: var(--mono);
  font-size: .65rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.nav-group-label:not(:first-child) { margin-top: 1.15rem; }
.nav-featured > a:not(.nav-all-cases) {
  display: grid;
  gap: .1rem;
  padding: .8rem 0;
  color: var(--paper);
  border-bottom: 1px solid rgba(255,255,255,.28);
}
.nav-featured strong { font-family: var(--display); font-size: 1.3rem; font-weight: 500; }
.nav-featured a > span { color: rgba(255,255,255,.62); font-size: .65rem; }
.nav-featured a:hover strong, .nav-all-cases:hover { color: var(--blue); }
.nav-all-cases { margin-top: .55rem; color: var(--orange); font-size: .68rem; text-transform: uppercase; }
.nav-actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 1.25rem; margin-top: .25rem; }
.nav-language { color: var(--paper); font-size: .72rem; }
.nav .btn { justify-self: start; }

/* ---------- Perspective-room hero ---------- */
.spatial-hero {
  --pointer-x: 0;
  --pointer-y: 0;
  width: min(1324px, calc(100vw - 7rem));
  margin: .2rem auto 3.2rem;
  perspective: 900px;
}
.spatial-hero svg { display: block; width: 100%; height: auto; overflow: visible; }
.room-lines { fill: none; stroke: var(--ink); stroke-width: .72; vector-effect: non-scaling-stroke; opacity: .7; }
.depth-frame { opacity: .76; }
.floating-plane {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform .22s cubic-bezier(.2,.75,.25,1), opacity .22s ease;
  will-change: transform;
  opacity: .88;
}
.floating-plane[data-motion="x"] { transform: translateX(var(--plane-shift, 0px)); }
.floating-plane[data-motion="y"] { transform: translateY(var(--plane-shift, 0px)); }
.floating-plane.blue { fill: #584dff; }
.floating-plane.deep { fill: #3034c9; }
.floating-plane.soft { fill: #8d87ff; }
.floating-plane.orange { fill: #d8400e; opacity: 1; }

/* ---------- White editorial hero ---------- */
.hero {
  width: min(1324px, calc(100vw - 7rem));
  max-width: none;
  min-height: 280px;
  display: grid;
  grid-template-columns: 1fr .82fr;
  align-items: center;
  gap: clamp(3rem, 10vw, 11rem);
  margin: 0 auto;
  padding: 1.6rem 0 4.2rem;
  text-align: left;
}
.hero h1 {
  margin: 0;
  color: var(--ink);
  background: none;
  -webkit-text-fill-color: currentColor;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.55rem, 4.15vw, 4.9rem);
  line-height: 1.14;
  letter-spacing: -.035em;
}
.intro {
  position: relative;
  color: var(--ink);
  font-family: var(--mono);
  font-size: clamp(.85rem, 1.25vw, 1.08rem);
  line-height: 1.72;
  max-width: 48ch;
  margin: 0;
}
.hero-summary { align-self: center; }
.hero-action {
  display: block;
  width: max-content;
  margin: 1.2rem 0 0 auto;
  color: var(--orange);
  font-family: var(--mono);
  font-size: .78rem;
}
.hero-action:hover { color: var(--brand-navy); }
.amp { font-family: Arial, Helvetica, sans-serif; font-style: normal; font-weight: inherit; }
.inner-page .hero { min-height: 390px; padding-top: 3rem; }
.inner-page .hero h1 { color: var(--blue); }
.error-hero { min-height: calc(100vh - 2rem) !important; }
.error-hero .intro a { color: var(--orange); text-decoration: underline; }
.breadcrumbs {
  width: min(1324px, calc(100vw - 7rem));
  margin: 0 auto;
  padding-top: 2rem;
  color: #676767;
  font-family: var(--mono);
}
.breadcrumbs a { color: var(--blue); }
.breadcrumbs [aria-current] { color: var(--orange); }

/* ---------- Dark grid content ---------- */
.content {
  position: relative;
  margin: 0;
  padding: clamp(4rem, 8vw, 8rem) max(3.5rem, calc((100vw - 1324px) / 2));
  color: var(--paper);
  background-color: var(--brand-black);
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 84px 84px;
}
.content-block { width: min(1324px, 100%); margin: 0 auto; }
.content-block + .content-block { margin-top: 1.25rem; }
.content h2 {
  max-width: 24ch;
  margin: clamp(4.5rem, 8vw, 8rem) 0 1.3rem;
  color: var(--paper);
  font-family: var(--display);
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 400;
  line-height: 1.06;
  letter-spacing: -.025em;
}
.content-block:first-child h2 { margin-top: 0; }
.content h3 { font-family: var(--mono); }
.content p, .list {
  max-width: 68ch;
  color: rgba(255,255,255,.84);
  font-family: var(--mono);
  font-size: .95rem;
}
.content p a, .list a { color: var(--blue-soft); text-decoration: underline; text-underline-offset: .2em; }
.list { margin-left: 1.4rem; }
.list li { margin-bottom: .72rem; }
.list li::marker { color: var(--orange); }
.grid { gap: 0; margin: 2rem 0; border-top: 1px solid rgba(255,255,255,.58); border-left: 1px solid rgba(255,255,255,.58); }
.card {
  display: flex;
  flex-direction: column;
  gap: .75rem;
  padding: 1.5rem;
  color: var(--paper);
  background: rgba(0,0,0,.72);
  border: 0;
  border-right: 1px solid rgba(255,255,255,.58);
  border-bottom: 1px solid rgba(255,255,255,.58);
  border-radius: 0;
  transition: color .2s ease, background .2s ease, transform .2s ease;
}
.card h3 {
  color: inherit;
  font-size: .92rem;
  letter-spacing: .03em;
  margin-bottom: .15rem;
}
.card h3::before { content: "0" counter(card) "  "; color: var(--blue-soft); font-size: .7rem; }
.grid { counter-reset: card; }
.card { counter-increment: card; }
.card p { color: rgba(255,255,255,.72); font-size: .78rem; }
.card-more { margin-top: auto; padding-top: 1rem; color: var(--orange); font-family: var(--mono); font-size: .68rem; text-transform: uppercase; letter-spacing: .06em; }
a.card:hover { color: var(--paper); background: var(--blue); border-color: rgba(255,255,255,.8); transform: translateY(-5px); }
.card-logo {
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -1.5rem -1.5rem 1.5rem;
  padding: 1.25rem 2rem;
  background: #fff;
  border-bottom: 1px solid rgba(255,255,255,.58);
  overflow: hidden;
}
.client-logo { display: block; width: auto; max-width: min(290px, 82%); height: auto; max-height: 78px; object-fit: contain; }
.client-brand {
  width: min(560px, 100%);
  min-height: 150px;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0 0 4rem;
  padding: 1.5rem 2rem;
  background: #fff;
  color: var(--ink);
  border-left: 5px solid var(--orange);
}
.client-brand .client-logo { max-width: 290px; max-height: 86px; }
.client-brand figcaption { max-width: 22ch; color: #555; font-size: .68rem; }

/* ---------- d-ialog product interface ---------- */
.product-showcase {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr);
  align-items: center;
  gap: clamp(1.25rem, 3vw, 2.75rem);
  margin: 0 0 clamp(5rem, 9vw, 8rem);
}
.product-shot {
  position: relative;
  margin: 0;
  transition: opacity .7s ease;
}
.product-shot-visual {
  background: var(--brand-navy);
  border: 1px solid rgba(36, 60, 230, .40);
  box-shadow: 0 34px 90px rgba(0,0,0,.45);
  overflow: hidden;
  transition: transform .7s cubic-bezier(.2,.8,.2,1), box-shadow .7s ease;
}
.product-shot-secondary .product-shot-visual { transform: translateY(2.5rem); }
@media (min-width: 761px) {
  .product-showcase:has(.product-shot-secondary:hover) {
    isolation: isolate;
  }
  .product-showcase:has(.product-shot-secondary:hover) .product-shot-primary {
    z-index: 1;
    opacity: .68;
  }
  .product-showcase:has(.product-shot-secondary:hover) .product-shot-primary .product-shot-visual {
    transform: translateX(-2%) scale(.55);
    transform-origin: left center;
  }
  .product-showcase:has(.product-shot-secondary:hover) .product-shot-secondary {
    z-index: 2;
  }
  .product-showcase:has(.product-shot-secondary:hover) .product-shot-secondary .product-shot-visual {
    transform: translate(-110%, 0) scale(1.65);
    transform-origin: center center;
  }
  .product-showcase:has(.product-shot-secondary:hover) .product-shot-secondary .product-shot-visual {
    box-shadow: 0 42px 110px rgba(0,0,0,.58);
  }
}
.product-window {
  height: 34px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 13px;
  color: var(--blue-soft);
  background: var(--brand-navy);
  border-bottom: 1px solid rgba(36, 60, 230, .32);
}
.product-window span { width: 7px; height: 7px; background: var(--blue-soft); border-radius: 50%; }
.product-window span:first-child { background: var(--orange); }
.product-window em { margin-left: auto; font-size: .55rem; font-style: normal; text-transform: uppercase; letter-spacing: .12em; }
.product-screen-frame { position: relative; display: block; overflow: hidden; }
.product-screen { display: block; width: 100%; height: auto; background: #111039; }
.product-shot figcaption {
  display: grid;
  gap: .3rem;
  padding: 1.15rem 1.25rem 1.3rem;
  color: var(--paper);
  background: var(--brand-navy);
  border: 1px solid rgba(36, 60, 230, .40);
  border-top: 0;
}
.product-shot figcaption strong { color: var(--blue-soft); font-family: var(--display); font-size: 1.05rem; }
.product-shot figcaption span { color: rgba(255,255,255,.66); font-size: .65rem; line-height: 1.5; }
.callout, .quote, .diagram {
  margin: 2.5rem 0;
  padding: 2rem;
  color: var(--paper);
  background: rgba(0,0,0,.82);
  border: 1px solid rgba(255,255,255,.58);
  border-radius: 0;
}
.callout { border-left: 6px solid var(--orange); }
.callout p, .quote p { color: rgba(255,255,255,.8); }
.quote { border-left: 6px solid var(--blue); }
.diagram code { color: #b8baff; font-family: var(--mono); }
.faq { max-width: none; }
.faq-item {
  margin: 0;
  color: var(--paper);
  background: rgba(0,0,0,.84);
  border: 1px solid rgba(255,255,255,.48);
  border-radius: 0;
}
.faq-item + .faq-item { border-top: 0; }
.faq-item summary { font-family: var(--mono); padding: 1.4rem 4rem 1.4rem 1.4rem; }
.faq-item summary::after { color: var(--orange); }
.faq-item p { color: rgba(255,255,255,.74); }
.contact-form {
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.6);
}
.contact-form label { display: grid; gap: .45rem; color: var(--paper); font-size: .72rem; }
.contact-form input, .contact-form textarea {
  width: 100%;
  padding: .9rem 1rem;
  color: var(--paper);
  background: var(--brand-black);
  border: 1px solid rgba(255,255,255,.52);
  border-radius: 0;
  font: inherit;
}
.contact-form input:focus, .contact-form textarea:focus { outline: 2px solid var(--blue-soft); outline-offset: 2px; }
.contact-form .form-message { grid-column: 1 / -1; }
.contact-form .btn { justify-self: start; border: 0; cursor: pointer; }
.cta {
  margin: 7rem 0 0;
  padding: clamp(3rem, 8vw, 7rem);
  text-align: left;
  color: var(--paper);
  background: var(--blue);
  border: 0;
  border-radius: 0;
}
.cta h2 { max-width: 18ch; margin: 0 0 1.5rem; color: var(--paper); font-size: clamp(2.1rem, 4vw, 4.4rem); }
.cta p { color: var(--paper); margin: 0 0 2rem; }
.btn {
  padding: .75rem 1.2rem;
  color: var(--orange);
  background: var(--paper);
  border-radius: 999px;
  font-family: var(--mono);
  font-size: .78rem;
  font-weight: 700;
}
.btn:hover { color: var(--paper); background: var(--blue); transform: none; }
.cta .btn:hover { background: var(--brand-navy); }

/* ---------- Interactive transformer visualization ---------- */
.llm-tech {
  display: grid;
  grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
  align-items: start;
  gap: clamp(2rem, 5vw, 4.5rem);
  margin: 0 0 clamp(4rem, 8vw, 7rem);
}
.llm-tech-copy > * { max-width: 44ch; }
.llm-tech-eyebrow {
  margin: 0 0 1.1rem;
  color: var(--orange);
  font-family: var(--mono);
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.content .llm-tech h2 { margin-top: 0; }
.llm-tech-stack {
  margin-top: 1.4rem;
  color: var(--blue-soft);
  font-size: .72rem;
  letter-spacing: .04em;
}
.llm-tech-copy .btn { display: inline-block; margin-top: 1.8rem; }

/* .btn sets an explicit display, which would otherwise beat the UA [hidden] rule. */
.llm-tech [hidden] { display: none; }

.llm-viz-shell {
  min-width: 0;
  border: 0;
  background: transparent;
}
.llm-viz-experience {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: center;
}

.llm-viz-stage {
  position: relative;
  height: clamp(560px, 48vw, 700px);
  overflow: hidden;
  /* Passive by default: the page must scroll with the pointer over the canvas. */
  touch-action: pan-y;
}
.llm-viz-stage.is-interactive { touch-action: none; cursor: grab; }
.llm-viz-stage canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity .25s ease;
}
.llm-tech.is-ready .llm-viz-stage canvas { opacity: 1; }
.llm-tech.is-ready .llm-viz-fallback { opacity: 0; }
.llm-tech.is-fallback .llm-viz-stage canvas { display: none; }

.llm-viz-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: opacity .25s ease;
}
.llm-viz-fallback-msg { margin: 0; max-width: 46ch; color: rgba(255,255,255,.72); font-size: .72rem; }
.llm-viz-diagram {
  display: grid;
  gap: .5rem;
  justify-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.llm-viz-diagram li {
  color: rgba(255,255,255,.8);
  font-family: var(--mono);
  font-size: .74rem;
}
.llm-viz-diagram li + li::before {
  display: block;
  content: "↓";
  color: var(--orange);
  font-size: .8rem;
  line-height: 1.2;
}
.llm-viz-diagram-label {
  display: block;
  margin-bottom: .3rem;
  color: rgba(255,255,255,.55);
  font-size: .6rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.llm-viz-cells { display: flex; gap: .3rem; justify-content: center; }
.llm-viz-cells span {
  min-width: 1.85rem;
  padding: .3rem 0;
  color: var(--paper);
  border: 1px solid rgba(255,255,255,.5);
  font-size: .74rem;
  font-weight: 700;
}
.llm-viz-brand-input {
  color: #676adb;
  font-family: var(--mono);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: .04em;
  border: 0;
  min-width: 0;
}

.llm-viz-math {
  width: min(100%, 38rem);
  min-width: 0;
  min-height: 6rem;
  justify-self: end;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .75rem;
  color: var(--paper);
  background: transparent;
  border: 0;
  padding: .25rem 0;
}
.llm-viz-equation { min-height: 4rem; color: var(--paper); }
.llm-viz-equation .katex-display { margin: 0; }
.llm-viz-equation .katex { font-size: clamp(1rem, 1.2vw, 1.3rem); }
.llm-viz-math-values .katex { color: var(--orange); font-size: .95rem; }
.llm-viz-hint { margin: 0; color: var(--orange); font-family: var(--mono); font-size: .66rem; }

.llm-viz-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  padding: 1rem 0 0;
  border-top: 0;
}
.llm-viz-progress {
  display: flex;
  flex-wrap: wrap;
  gap: .2rem .75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.llm-viz-progress li { color: rgba(255,255,255,.42); font-family: var(--mono); font-size: .62rem; letter-spacing: .04em; }
.llm-viz-progress li.is-active { color: var(--orange); font-weight: 700; }
.llm-viz-buttons { display: flex; flex-wrap: wrap; gap: .5rem; }
.llm-viz-buttons .btn { border: 0; cursor: pointer; }
.llm-viz-buttons .btn:focus-visible { outline: 2px solid var(--blue-soft); outline-offset: 2px; }

.llm-viz-speed {
  display: grid;
  grid-template-columns: auto minmax(120px, 210px) 3.5rem;
  align-items: center;
  gap: .65rem;
  color: rgba(255,255,255,.65);
  font-family: var(--mono);
  font-size: .62rem;
}
.llm-viz-speed-label { white-space: nowrap; }
.llm-viz-speed-value {
  min-width: 3.5rem;
  color: var(--orange);
  font-family: var(--mono);
  text-align: right;
}
.llm-viz-speed input[type="range"] {
  width: 100%;
  margin: 0;
  accent-color: var(--orange);
  cursor: pointer;
}
.llm-viz-speed input[type="range"]:focus-visible {
  outline: 2px solid var(--blue-soft);
  outline-offset: 4px;
}

@media (max-width: 900px) {
  .llm-tech { grid-template-columns: 1fr; gap: 2rem; }
  .llm-viz-stage { height: clamp(420px, 112vw, 560px); min-height: 420px; }
  .llm-viz-controls { justify-content: flex-start; }
  .llm-viz-buttons .btn { min-height: 44px; }
  .llm-viz-speed {
    grid-template-columns: auto minmax(100px, 1fr) 3.5rem;
    width: 100%;
    max-width: 360px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .llm-viz-stage canvas, .llm-viz-fallback { transition: none !important; }
}

/* ---------- Reveal / footer ---------- */
html.motion-ready [data-reveal] { opacity: 0; transform: translateY(42px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); }
html.motion-ready [data-reveal].is-visible { opacity: 1; transform: none; }
footer {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  border: 0;
}
.footer-grid {
  max-width: 1324px;
  padding: 5rem 0 3rem;
  grid-template-columns: 2.3fr 1fr 1fr 1fr;
  gap: 3rem;
}
.footer-grid .brand-wordmark { font-size: clamp(2.4rem, 4vw, 4.2rem); }
.footer-grid h3 { color: var(--orange); font-family: var(--mono); font-size: .7rem; text-transform: uppercase; }
.footer-grid a, .footer-brand p { color: var(--ink); font-family: var(--mono); font-size: .72rem; }
.footer-grid a:hover { color: var(--blue); }
.footer-bottom { color: #595959; border-top: 1px solid rgba(5,5,5,.25); font-family: var(--mono); }

@media (max-width: 900px) {
  .site-header { min-height: 92px; grid-template-columns: auto 1fr auto; padding: 1.3rem 1.25rem; gap: 1rem; }
  .header-ticker { font-size: 9px; }
  .header-language { display: none; }
  .brand-wordmark { font-size: 1.8rem; }
  .nav-toggle span { width: 30px; }
  .nav { align-items: start; padding: 5.75rem 1.25rem 2rem; }
  .nav-panel { grid-template-columns: 1fr; gap: 1rem; }
  .nav-label, .nav-actions { grid-column: auto; }
  .nav-link { font-size: clamp(1.65rem, 8vw, 2.25rem); }
  .nav-featured { margin-top: .75rem; }
  .nav-featured strong { font-size: 1.05rem; }
  .nav-actions { align-items: flex-start; flex-direction: column; }
  .spatial-hero { width: calc(100vw - 2rem); margin: .5rem auto 2rem; }
  .hero, .inner-page .hero {
    width: calc(100vw - 2.5rem);
    min-height: 0;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem 0 3.5rem;
  }
  .hero h1 { font-size: clamp(2.3rem, 10vw, 3.6rem); }
  .hero-action { margin-left: 0; }
  .breadcrumbs { width: calc(100vw - 2.5rem); }
  .content { padding: 4rem 1.25rem; background-size: 56px 56px; }
  .content h2 { margin-top: 4rem; }
  .grid.cols-2, .grid.cols-3, .grid.cols-4 { grid-template-columns: 1fr; }
  .product-showcase { grid-template-columns: 1fr; }
  .product-shot-secondary .product-shot-visual { transform: none; }
  .client-brand { align-items: flex-start; flex-direction: column; gap: 1rem; }
  .contact-form { grid-template-columns: 1fr; }
  .contact-form .form-message { grid-column: auto; }
  .footer-grid { padding: 4rem 1.25rem 2rem; grid-template-columns: 1fr 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .header-ticker span { animation: none !important; }
  .floating-plane { transition: none !important; transform: none !important; }
  html.motion-ready [data-reveal] { opacity: 1; transform: none; }
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
    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      if (menu.classList) { menu.classList.toggle("open", open); }
      if (doc.body && doc.body.classList) { doc.body.classList.toggle("nav-open", open); }
    }
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });
    if (doc.addEventListener) {
      doc.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { setOpen(false); }
      });
    }
  }

  function initReveal(doc, win) {
    if (!win || !doc.documentElement || !doc.querySelectorAll) { return; }
    var reduce = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));
    if (reduce || typeof win.IntersectionObserver !== "function") {
      items.forEach(function (item) { if (item.classList) { item.classList.add("is-visible"); } });
      return;
    }
    doc.documentElement.classList.add("motion-ready");
    var observer = new win.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.classList) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initSpatialHero(doc, win) {
    if (!win || !doc.querySelector || !doc.querySelectorAll) { return; }
    var room = doc.querySelector("[data-spatial-hero]");
    if (!room || !room.addEventListener ||
        (win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches)) { return; }
    var planes = Array.prototype.slice.call(room.querySelectorAll("[data-motion]"));
    function updatePlanes(pointerX, pointerY) {
      if (room.style) {
        room.style.setProperty("--pointer-x", pointerX.toFixed(3));
        room.style.setProperty("--pointer-y", pointerY.toFixed(3));
      }
      planes.forEach(function (plane) {
        if (!plane.style || !plane.getAttribute) { return; }
        var travel = Number(plane.getAttribute("data-travel")) || 0;
        var axis = plane.getAttribute("data-motion");
        var input = axis === "x" ? pointerY : pointerY * 0.78 + pointerX * 0.22;
        plane.style.setProperty("--plane-shift", (input * travel).toFixed(2) + "px");
      });
    }
    room.addEventListener("pointermove", function (event) {
      if (!room.getBoundingClientRect || !room.style) { return; }
      var rect = room.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      var y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      updatePlanes(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
    });
    room.addEventListener("pointerleave", function () {
      updatePlanes(0, 0);
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
    initReveal(document, typeof window !== "undefined" ? window : undefined);
    initSpatialHero(document, typeof window !== "undefined" ? window : undefined);
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

# User-initiated ChatGPT retrieval (robots rules may not always apply, but the
# intent is explicit for infrastructure that does consult this file).
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: ClaudeBot
Allow: /

# Legacy Anthropic user agent retained for older integrations.
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
- Intervan enterprise copilot and backoffice case study: {BASE}/case-studies/intervan/
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
