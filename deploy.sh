#!/usr/bin/env bash
#
# Deploy this static site to S3 + CloudFront.
# Usage:
#   ./deploy.sh
#   BUCKET_NAME=my-bucket ./deploy.sh
#   DOMAIN_NAMES="www.example.com" CERTIFICATE_arn=arn:aws:acm:us-east-1:123:certificate/xyz ./deploy.sh
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
  # Block public access is fine; we allow public read via bucket policy so the
  # bucket itself is not open for writes.
  aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
  aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'"$BUCKET_NAME"'/*"
    }]
  }'
else
  echo "S3 bucket exists: $BUCKET_NAME"
fi

# --- 2. Sync files ----------------------------------------------------------
echo "Syncing to s3://$BUCKET_NAME ..."
aws s3 sync . "s3://$BUCKET_NAME" \
  --delete \
  --exclude ".cloudfront/*" \
  --exclude ".git/*" \
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
  # Build alias domains argument (only for custom domains with a certificate)
  ALIAS_DOMAIN_ARG=""
  CERT_ARG=""
  if [ -n "$DOMAIN_NAMES" ]; then
    if [ -z "$CERTIFICATE_ARN" ]; then
      echo "ERROR: DOMAIN_NAMES set but CERTIFICATE_ARN is missing" >&2
      exit 1
    fi
    ALIAS_DOMAIN_ARG=",\"AliasDomains\":{\"Quantity\":1,\"Items\":[\"$DOMAIN_NAMES\"]}"
    CERT_ARG=",\"ViewerCertificate\":{\"ACMCertificateArn\":\"$CERTIFICATE_ARN\",\"SSLSupportMethod\":\"sni-only\"}"
  else
    CERT_ARG=",\"ViewerCertificate\":{\"CloudFrontDefaultCertificate\":true}"
  fi

  DIST_JSON="{
    \"Enabled\": true,
    \"CallerReference\": \"$(date +%s)\",
    \"Comment\": \"Develo Web static site\",
    \"Origins\": {\"Quantity\": 1, \"Items\": [{
      \"Id\": \"s3-origin\",
      \"DomainName\": \"${BUCKET_NAME}.s3.${REGION}.amazonaws.com\",
      \"S3OriginConfig\": {\"OriginAccessIdentity\": \"\"}
    }]},
    \"DefaultCacheBehavior\": {
      \"TargetOriginId\": \"s3-origin\",
      \"ViewerProtocolPolicy\": \"redirect-to-https\",
      \"AllowedMethods\": {\"Quantity\": 2, \"Items\": [\"GET\",\"HEAD\"], \"CachedMethods\": {\"Quantity\": 2, \"Items\": [\"GET\",\"HEAD\"]}},
      \"Compress\": true
    },
    \"CustomErrorResponses\": {\"Quantity\": 1, \"Items\": [{
      \"ErrorCode\": 403,
      \"ResponseCode\": \"200\",
      \"ResponsePagePath\": \"/index.html\"
    }]},
    \"DefaultRootObject\": \"index.html\",
    \"PriceClass\": \"PriceClass_100\""${ALIAS_DOMAIN_ARG}"${CERT_ARG}
  }"

  RESULT="$(aws cloudfront create-distribution --distribution-config "$DIST_JSON")"
  DISTRIBUTION_ID="$(echo "$RESULT" | python3 -c 'import sys, json; print(json.load(sys.stdin)["Distribution"]["Id"])')"
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
  echo ""
  echo "✅ Deployed (DNS may take time to propagate): https://${DOMAIN_NAMES}"
else
  echo ""
  echo "Fetching distribution status..."
  STATUS="$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" \
    --query 'Distribution.{Status:Status,Domain:DomainName}' --output text)"
  echo "✅ Deployed: https://${STATUS##*$'\t'}"
fi
