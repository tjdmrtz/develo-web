# Develo Web

Static frontend site served from **S3** through **AWS CloudFront**, with automatic
deploys from **GitHub Actions** on every push to `main` (direct pushes and PR
merges alike).

- **URLs:** https://develo.software and https://www.develo.software
- **No build step** — plain HTML, CSS and JS.

## Structure

```
develo-web/
├── index.html                  # Main page
├── css/style.css               # Styles
├── js/main.js                  # Client-side scripts
├── deploy.sh                   # Deploy script (S3 sync + CloudFront)
└── .github/workflows/deploy.yml  # CI/CD pipeline
```

## Local development

```bash
python3 -m http.server 8080   # → http://localhost:8080
```

## CI/CD

Pushing to `main` runs `.github/workflows/deploy.yml`:

1. Assumes `arn:aws:iam::346425562059:role/github-actions-develo-web` via **OIDC** (no static AWS keys in the repo).
2. Runs `deploy.sh`:
   - syncs the repo to `s3://develo-web-eu-west-1`
   - creates the CloudFront distribution on first run (ID cached in `.cloudfront/distribution-id`)
   - invalidates the CloudFront cache so changes propagate in minutes

The IAM role trusts only this repo's `main` branch (OIDC `sub` claim).

## Infrastructure (account 346425562059)

| Resource | Value |
|---|---|
| Domain | `develo.software` (AWS Route 53 Registrar, renews 2027-08) |
| S3 bucket | `develo-web-eu-west-1` (public-read bucket policy) |
| CloudFront distribution | `E2RPSIN1IK02WM` → `d17anzlp75c4gj.cloudfront.net` |
| ACM certificate | `arn:aws:acm:us-east-1:346425562059:certificate/8c743979-c36f-4609-8094-0979cae18fda` (DNS-validated, auto-renews) |
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
- 403s from S3 are masked as `index.html` (SPA-friendly) via CustomErrorResponses.

## Troubleshooting: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

If a **new** frontend repo's GitHub→AWS OIDC deploy fails with this error, the
usual cause is the `sub` claim in the role's trust policy. GitHub in this
environment issues OIDC tokens with a `sub` of the form:

```
repo:<owner>@<ownerId>/<repo>@<repoId>:ref:refs/heads/main
```

(note the numeric IDs — different from the plain `repo:owner/repo:ref:...`
format shown in the AWS console). A trust policy written with the plain format
never matches and the role can't be assumed.

Fix: get the IDs and use them in the condition (keep it scoped to repo+branch):

```bash
gh api repos/tjdmrtz/develo-web --jq '.owner.id'   # ownerId
gh api repos/tjdmrtz/develo-web --jq '.id'          # repoId
```

```json
"Condition": {
  "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
  "StringLike": { "token.actions.githubusercontent.com:sub": ["repo:tjdmrtz@23453476/develo-web@1334618943:*"] }
}
```

No manual step is needed on the GitHub side; the fix is only in the IAM role's
trust policy (and the OIDC provider must exist with a valid GitHub thumbprint).
