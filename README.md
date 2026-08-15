# Develo Web

Static website for **https://develo.software** (also www.develo.software),
served from **S3** through **AWS CloudFront**, with automatic deploys from
**GitHub Actions** on every push to `main`.

- The website lives in **`develo/`** (that folder is the deploy root).
- **No build step** — plain HTML, CSS and JS.

## Structure

```
develo-web/
├── develo/                       # THE WEBSITE (deploy root)
│   ├── index.html                # Home (EN) + /es/ (ES, hreflang-linked)
│   ├── solutions/                # Landing pages + products (d-ialog, Develo Multi-Agent)
│   ├── technologies/             # AWS, Amazon Bedrock, AI agents, MCP, RAG, LLM fine-tuning
│   ├── industries/  case-studies/  insights/
│   ├── about/  contact/  privacy-policy/  terms-and-conditions/
│   ├── css/  js/
│   ├── robots.txt  sitemap.xml  llms.txt
│   └── fix_indentation.md        # SEO/LLM-discoverability audit (not deployed)
├── sitegen/                      # Dev-only generator that renders develo/ from data
├── tests/                        # pytest suite (SEO, crawl, JS, screenshots) + node helpers
├── deploy.sh                     # S3 sync + CloudFront (create/lookup + invalidate)
└── .github/workflows/deploy.yml  # CI/CD pipeline
```

## Local development

```bash
python3 -m http.server 8080 --directory develo   # → http://localhost:8080
```

## Tests (TDD)

The suite in `tests/` covers SEO metadata (unique titles, meta descriptions,
single H1, canonical, OpenGraph), structured data (Organization, WebPage,
Service, SoftwareApplication, Article, FAQPage, BreadcrumbList), sitemap /
robots.txt / llms.txt, a full internal-link crawl, page-size budgets, the
JavaScript functionality (Node), and headless-Chrome screenshots.

```bash
pytest tests/ -v            # everything
pytest tests/ -m screenshot # only the visual smoke tests
```

Screenshot tests need `node` + `npm install` inside `tests/` (puppeteer-core
driving the system Chrome) and a local headless-capable Chrome/Chromium.

## Regenerating the pages (dev tool)

`develo/` is generated from structured content by the `sitegen` package so
that metadata and structured data stay consistent across all 23 pages:

```bash
python3 -m sitegen.build
```

Edit copy in `sitegen/content.py`, rebuild, run the tests, commit the
generated `develo/` output.

## CI/CD

Pushing to `main` runs `.github/workflows/deploy.yml`:

1. Assumes `arn:aws:iam::346425562059:role/github-actions-develo-web` via **OIDC** (no static AWS keys in the repo).
2. Runs `deploy.sh`:
   - syncs `develo/` to `s3://develo-web-eu-west-1` (the folder maps to the bucket root)
   - creates the CloudFront distribution on first run (ID cached in `.cloudfront/distribution-id`)
   - invalidates the CloudFront cache so changes propagate in minutes

## Infrastructure (account 346425562059)

| Resource | Value |
|---|---|
| Domain | `develo.software` (AWS Route 53 Registrar) |
| S3 bucket | `develo-web-eu-west-1` (public-read bucket policy) |
| CloudFront distribution | `E2RPSIN1IK02WM` → `d17anzlp75c4gj.cloudfront.net` |
| ACM certificate | `arn:aws:acm:us-east-1:346425562059:certificate/8c743979-c36f-4609-8094-0979cae18fda` |
| Route 53 zone | `Z0778491FJQXWBMMV7UC` — `develo.software` + `www` ALIAS → CloudFront |
| IAM role (CI) | `github-actions-develo-web` (OIDC-federated, scoped to repo+branch) |

## Manual deploy (fallback)

```bash
REGION=eu-west-1 \
BUCKET_NAME=develo-web-eu-west-1 \
DOMAIN_NAMES="develo.software www.develo.software" \
CERTIFICATE_ARN=arn:aws:acm:us-east-1:346425562059:certificate/8c743979-c36f-4609-8094-0979cae18fda \
./deploy.sh
```

## Notes

- `www.` is an alias handled by CloudFront (both names in the distribution);
  DNS has separate ALIAS records for apex and `www`.
- HTTP is redirected to HTTPS by the distribution.
- 403s from S3 are masked as `index.html` via CustomErrorResponses.
- `robots.txt` explicitly allows AI search crawlers (OAI-SearchBot, GPTBot,
  Claude-Web) and `llms.txt` provides an LLM-friendly site map.
