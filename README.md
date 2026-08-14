# Develo Web

Static frontend site designed to be served from an **S3 bucket** through **AWS CloudFront**.

No build step required — just plain HTML, CSS and JS.

## Structure

```
develo-web/
├── index.html      # Main page
├── css/style.css   # Styles
├── js/main.js      # Client-side scripts
└── deploy.sh       # Deploy script (S3 + CloudFront)
```

## Local development

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deployment to CloudFront

### 1. Prerequisites

- AWS CLI v2 installed and configured (`aws configure`) with permissions for `s3:*` and `cloudfront:*`
- An S3 bucket (created by the script if it doesn't exist)

### 2. Deploy

```bash
./deploy.sh
```

The script will:

1. Create the S3 bucket `develo-web-<your-region>` (idempotent)
2. Sync this directory to the bucket
3. Create a CloudFront distribution pointing at the bucket (only on first run)
4. Print the CloudFront URL when the distribution is deployed

You can override the bucket name with `BUCKET_NAME=... ./deploy.sh`.

### 3. Optional: custom domain

To use a custom domain (e.g. `www.develo.com`):

1. Create an ACM certificate in `us-east-1` for your domain (CloudFront requires us-east-1).
2. Update `deploy.sh` — set `DOMAIN_NAMES` and `CERTIFICATE_ARN`.
3. Add a CNAME record in Route 53 (or your DNS provider) pointing your domain at `<distribution-id>.cloudfront.net`.

## Notes

- The bucket must be publicly readable for CloudFront to serve it to browsers. The deploy script applies a minimal public-read bucket policy.
- CloudFront invalidations take ~15 min; the deploy script runs an invalidation after each sync so changes propagate sooner (~minutes).
