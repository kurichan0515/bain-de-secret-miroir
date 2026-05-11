#!/bin/bash
set -e

BUCKET="bsm-frontend-344693946629"
DISTRIBUTION_ID="EAPMZD7AJMOI0"
PROFILE="terraform-admin"
FRONTEND_DIR="$(dirname "$0")/../frontend"

echo "==> ビルド中..."
cd "$FRONTEND_DIR"
npm run build

echo "==> index.html をアップロード（キャッシュなし）..."
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --profile "$PROFILE"

echo "==> アセットをアップロード（長期キャッシュ）..."
aws s3 sync dist/ "s3://$BUCKET/" \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable" \
  --profile "$PROFILE"

echo "==> CloudFront キャッシュを削除中..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$PROFILE" \
  --output text --query 'Invalidation.Id'

echo ""
echo "デプロイ完了!"
echo "URL: https://d2loj7qsxb6wma.cloudfront.net"
