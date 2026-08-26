#!/usr/bin/env bash
#
# Deploy the Develo website (develo/ folder) to S3 + CloudFront.
#
# The develo/ directory is the deploy root: its contents are synced to the
# bucket root so that https://develo.software/ serves develo/index.html.
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
FUNCTION_NAME="develo-clean-urls"
FUNCTION_CODE_FILE="cloudfront-clean-urls.js"

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
WEBSITE_DIR="develo"
if [ ! -d "$WEBSITE_DIR" ]; then
  echo "ERROR: website folder '$WEBSITE_DIR' not found" >&2
  exit 1
fi
LLM_VIZ_DIR="llm-viz"
echo "Syncing $WEBSITE_DIR/ to s3://$BUCKET_NAME ..."
aws s3 sync "$WEBSITE_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --exclude "README.md" \
  --exclude "fix_indentation.md" \
  --exclude ".DS_Store" \
  --exclude "${LLM_VIZ_DIR}/*" \
  --cache-control "max-age=300"

# The visualization runtime assets are keyed by the upstream commit SHA, so they
# are immutable and must never be overwritten in place.
if [ -d "$WEBSITE_DIR/$LLM_VIZ_DIR" ]; then
  echo "Syncing immutable $LLM_VIZ_DIR/ assets ..."
  aws s3 sync "$WEBSITE_DIR/$LLM_VIZ_DIR" "s3://$BUCKET_NAME/$LLM_VIZ_DIR" \
    --delete \
    --exclude "*.wasm" \
    --cache-control "public, max-age=31536000, immutable"
  # instantiateStreaming requires an explicit application/wasm content type.
  aws s3 sync "$WEBSITE_DIR/$LLM_VIZ_DIR" "s3://$BUCKET_NAME/$LLM_VIZ_DIR" \
    --exclude "*" \
    --include "*.wasm" \
    --content-type "application/wasm" \
    --cache-control "public, max-age=31536000, immutable"
fi

# --- 3. Clean URLs at the CloudFront edge -----------------------------------
if [ ! -f "$FUNCTION_CODE_FILE" ]; then
  echo "ERROR: CloudFront function '$FUNCTION_CODE_FILE' not found" >&2
  exit 1
fi

if aws cloudfront describe-function --name "$FUNCTION_NAME" --stage DEVELOPMENT >/dev/null 2>&1; then
  FUNCTION_ETAG="$(aws cloudfront describe-function --name "$FUNCTION_NAME" \
    --stage DEVELOPMENT --query 'ETag' --output text)"
  aws cloudfront update-function \
    --name "$FUNCTION_NAME" \
    --if-match "$FUNCTION_ETAG" \
    --function-config 'Comment=Rewrite clean URLs to directory index files,Runtime=cloudfront-js-2.0' \
    --function-code "fileb://${FUNCTION_CODE_FILE}" >/dev/null
else
  aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config 'Comment=Rewrite clean URLs to directory index files,Runtime=cloudfront-js-2.0' \
    --function-code "fileb://${FUNCTION_CODE_FILE}" >/dev/null
fi

FUNCTION_ETAG="$(aws cloudfront describe-function --name "$FUNCTION_NAME" \
  --stage DEVELOPMENT --query 'ETag' --output text)"
aws cloudfront publish-function --name "$FUNCTION_NAME" \
  --if-match "$FUNCTION_ETAG" >/dev/null
FUNCTION_ARN="$(aws cloudfront describe-function --name "$FUNCTION_NAME" \
  --stage LIVE --query 'FunctionSummary.FunctionMetadata.FunctionARN' --output text)"

# --- 4. CloudFront distribution ---------------------------------------------
# The distribution may already exist from a previous (fresh) workspace: first
# check the local cache, then look up an existing distribution by alias.
DISTRIBUTION_ID=""
if [ -f "$DIST_ID_FILE" ]; then
  DISTRIBUTION_ID="$(cat "$DIST_ID_FILE")"
fi
if [ -z "$DISTRIBUTION_ID" ] && [ -n "$DOMAIN_NAMES" ]; then
  FIRST_DOMAIN="${DOMAIN_NAMES%% *}"
  DISTRIBUTION_ID="$(aws cloudfront list-distributions \
    --query 'DistributionList.Items[].{Id:Id,Aliases:Aliases.Items}' --output json 2>/dev/null \
    | jq -r --arg d "$FIRST_DOMAIN" '[.[] | select(.Aliases != null and (.Aliases | index($d)))] | .[0].Id // empty')"
fi
if [ -n "$DISTRIBUTION_ID" ]; then
  echo "$DISTRIBUTION_ID" > "$DIST_ID_FILE"
  echo "CloudFront distribution exists: $DISTRIBUTION_ID"

  DIST_RESPONSE="$(aws cloudfront get-distribution-config --id "$DISTRIBUTION_ID")"
  NEEDS_EDGE_CONFIG="$(echo "$DIST_RESPONSE" | jq -r --arg arn "$FUNCTION_ARN" '
    (([.DistributionConfig.DefaultCacheBehavior.FunctionAssociations.Items[]?
       | select(.EventType == "viewer-request" and .FunctionARN == $arn)] | length) != 1)
    or
    (([.DistributionConfig.CustomErrorResponses.Items[]?
       | select(.ErrorCode == 403 and .ResponseCode == "404")] | length) != 1)')"

  if [ "$NEEDS_EDGE_CONFIG" = "true" ]; then
    DIST_ETAG="$(echo "$DIST_RESPONSE" | jq -r '.ETag')"
    DIST_CONFIG="$(echo "$DIST_RESPONSE" | jq --arg arn "$FUNCTION_ARN" '
      .DistributionConfig
      | (.DefaultCacheBehavior.FunctionAssociations.Items // []) as $items
      | .DefaultCacheBehavior.FunctionAssociations = {
          Quantity: (($items | map(select(.EventType != "viewer-request")) | length) + 1),
          Items: (($items | map(select(.EventType != "viewer-request"))) +
                  [{EventType: "viewer-request", FunctionARN: $arn}])
        }
      | .CustomErrorResponses = {Quantity: 2, Items: [
          {ErrorCode: 403, ResponseCode: "404", ResponsePagePath: "/404.html", ErrorCachingMinTTL: 300},
          {ErrorCode: 404, ResponseCode: "404", ResponsePagePath: "/404.html", ErrorCachingMinTTL: 300}
        ]}')"
    aws cloudfront update-distribution --id "$DISTRIBUTION_ID" \
      --if-match "$DIST_ETAG" --distribution-config "$DIST_CONFIG" >/dev/null
    echo "Attached clean-URL function and real 404 responses"
  fi
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
    --arg function_arn "$FUNCTION_ARN" \
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
        Compress: true,
        FunctionAssociations: {Quantity: 1, Items: [{
          EventType: "viewer-request", FunctionARN: $function_arn
        }]},
        ForwardedValues: {
          QueryString: false,
          Cookies: {Forward: "none"},
          Headers: {Quantity: 0, Items: []}
        }
      },
      CustomErrorResponses: {Quantity: 2, Items: [
        {ErrorCode: 403, ResponseCode: "404", ResponsePagePath: "/404.html", ErrorCachingMinTTL: 300},
        {ErrorCode: 404, ResponseCode: "404", ResponsePagePath: "/404.html", ErrorCachingMinTTL: 300}
      ]},
      DefaultRootObject: "index.html",
      PriceClass: "PriceClass_100",
      ViewerCertificate: $cert
    } | if $aliases == null then del(.Aliases) else . end')"

  RESULT="$(aws cloudfront create-distribution --distribution-config "$DIST_JSON")"
  DISTRIBUTION_ID="$(echo "$RESULT" | jq -r '.Distribution.Id')"
  echo "$DISTRIBUTION_ID" > "$DIST_ID_FILE"
  echo "Distribution created: $DISTRIBUTION_ID"
fi

# --- 5. Invalidate cache ------------------------------------------------------
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

# --- 6. Show URL --------------------------------------------------------------
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
