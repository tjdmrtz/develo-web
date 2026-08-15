# Develo Website

The static website published at **https://develo.software** (S3 + CloudFront).

This folder is the deploy root: `deploy.sh` syncs its contents to the S3
bucket. Plain HTML/CSS/JS — no build step required to deploy.

## Structure

```
develo/
├── index.html                     # Home (EN, primary language)
├── es/index.html                  # Home (ES, hreflang-linked)
├── solutions/                     # Solution landing pages + products (d-ialog, Develo Multi-Agent)
├── technologies/                  # AWS, Amazon Bedrock, AI agents, MCP, RAG, LLM fine-tuning
├── industries/ecommerce-retail/
├── case-studies/
├── insights/
├── about/  contact/
├── privacy-policy/  terms-and-conditions/
├── css/style.css
├── js/main.js
├── robots.txt                     # allows search + AI crawlers (OAI-SearchBot, GPTBot, Claude-Web)
├── sitemap.xml
└── llms.txt
```

## Tests (TDD)

The site is covered by a test suite in `../tests/` (SEO metadata, sitemap,
robots, structured data, internal linking crawl, JS functionality, headless
Chrome screenshots):

```bash
pytest tests/ -v
```

## Regenerating pages (dev tool)

Pages are generated from structured content by the `sitegen` package at the
repo root (dev-only, not deployed). To regenerate after editing
`sitegen/content.py`:

```bash
python3 -m sitegen.build
```

## Local preview

```bash
python3 -m http.server 8080   # → http://localhost:8080
```
