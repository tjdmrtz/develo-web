#!/usr/bin/env bash
#
# Deploy this static site to S3 + CloudFront.
#
# Environment:
#   REGION           AWS region for the bucket           (default: eu-west-1)
#   BUCKET_NAME      S3 bucket name                     (default: develo-web-<REGION>)
#   DOMAIN_NAMES     space-separated custom domains     (default: none)
#   CERTIFICATE_ARN  ACM cert in us-east-1 (required if DOMAIN_NAMES is set)
#
# The CloudFront distribution is created on the first run; subsequent runs
# only sync + invalidate. The distribution ID is cached in .cloudfront/distribution-id.
#
set -euo pipefail

REGION="${REGION:-eu-west-1}"
BUCKET_NAME="${BUCKET_NAME:-develo-web-${REGION}}"
DOMAIN_NAMES="${DOMAIN_NAMES:-}"
CERTIFICATE_ARN="${CERTIFICATE_ARN:-}"
CONFIG_DIR=".cloudfront"
DIST_ID_FILE="${CONFIG_DIR}/distribution-id"

mkdir -p "$CONFIG_DIR"

# --- 1. S3 bucket -----------------------------------------------------------
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Creating S3 bucket: $BUCKET_NAME"
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET_NAME"
  else
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION"
  fi
  aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
  # Public read via bucket policy (bucket stays write-protected).
  aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$(jq -n \
    --arg bucket "$BUCKET_NAME" '{
      Version: "2012-10-17",
      Statement: [{
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: ("arn:aws:s3:::" + $bucket + "/*")
      }]
    }')"
else
  echo "S3 bucket exists: $BUCKET_NAME"
fi

# --- 2. Sync files ----------------------------------------------------------
echo "Syncing to s3://$BUCKET_NAME ..."
aws s3 sync . "s3://$BUCKET_NAME" \
  --delete \
  --exclude ".cloudfront/*" \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "deploy.sh" \
  --exclude "README.md" \
  --exclude ".gitignore" \
  --cache-control "max-age=300"

# --- 3. CloudFront distribution ---------------------------------------------
if [ -f "$DIST_ID_FILE" ]; then
  DISTRIBUTION_ID="$(cat "$DIST_ID_FILE")"
  echo "CloudFront distribution exists: $DISTRIBUTION_ID"
else
  echo "Creating CloudFront distribution..."

  # Build alias domains + viewer certificate JSON fragments with jq
  ALIAS_JSON="null"
  if [ -n "$DOMAIN_NAMES" ]; then
    if [ -z "$CERTIFICATE_ARN" ]; then
      echo "ERROR: DOMAIN_NAMES set but CERTIFICATE_ARN is missing" >&2
      exit 1
    fi
    read -r -a DOMAINS <<< "$DOMAIN_NAMES"
    ALIAS_JSON="$(printf '%s\n' "${DOMAINS[@]}" | jq -R . | jq -s '{Quantity: length, Items: .}')"
    VIEWER_CERT_JSON="$(jq -n --arg arn "$CERTIFICATE_ARN" \
      '{ACMCertificateArn: $arn, SSLSupportMethod: "sni-only", MinimumProtocolVersion: "TLSv1.2_2021"}')"
  else
    VIEWER_CERT_JSON='{"CloudFrontDefaultCertificate": true}'
  fi

  DIST_JSON="$(jq -n \
    --arg origin "${BUCKET_NAME}.s3.${REGION}.amazonaws.com" \
    --arg comment "Develo Web static site" \
    --arg caller "$(date +%s)develo-web" \
    --argjson aliases "$ALIAS_JSON" \
    --argjson cert "$VIEWER_CERT_JSON" \
    '{
      Enabled: true,
      Comment: $comment,
      CallerReference: $caller,
      Aliases: $aliases,
      Origins: {Quantity: 1, Items: [{
        Id: "s3-origin",
        DomainName: $origin,
        S3OriginConfig: {OriginAccessIdentity: ""}
      }]},
      DefaultCacheBehavior: {
        TargetOriginId: "s3-origin",
        ViewerProtocolPolicy: "redirect-to-https",
        MinTTL: 0,
        AllowedMethods: {Quantity: 2, Items: ["GET","HEAD"],
                        CachedMethods: {Quantity: 2, Items: ["GET","HEAD"]}},
        Compress: true
      },
      CustomErrorResponses: {Quantity: 1, Items: [{
        ErrorCode: 403, ResponseCode: "200", ResponsePagePath: "/index.html"
      }]},
      DefaultRootObject: "index.html",
      PriceClass: "PriceClass_100",
      ViewerCertificate: $cert
    } | if $aliases == null then del(.Aliases) else . end')"

  RESULT="$(aws cloudfront create-distribution --distribution-config "$DIST_JSON")"
  DISTRIBUTION_ID="$(echo "$RESULT" | jq -r '.Distribution.Id')"
  echo "$DISTRIBUTION_ID" > "$DIST_ID_FILE"
  echo "Distribution created: $DISTRIBUTION_ID"
fi

# --- 4. Invalidate cache ------------------------------------------------------
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

# --- 5. Show URL --------------------------------------------------------------
if [ -n "$DOMAIN_NAMES" ]; then
  FIRST_DOMAIN="${DOMAIN_NAMES%% *}"
  echo ""
  echo "✅ Deployed (DNS/propagation may take time): https://${FIRST_DOMAIN}"
else
  echo ""
  echo "Fetching distribution status..."
  DOMAIN="$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" \
    --query 'Distribution.DomainName' --output text)"
  echo "✅ Deployed: https://${DOMAIN}"
fi
