#!/usr/bin/env bash
# Sobe o build da SPA para o bucket S3 e invalida a distribuicao CloudFront.
#
# Requisitos:
#   - AWS CLI configurado (aws configure)
#   - Variaveis abaixo definidas, ou via .env carregado pelo seu shell:
#       S3_BUCKET=meu-bucket-do-site
#       CLOUDFRONT_DISTRIBUTION_ID=E123ABC456DEF
#
# Uso: ./scripts/deploy-frontend.sh

set -euo pipefail

: "${S3_BUCKET:?defina S3_BUCKET}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?defina CLOUDFRONT_DISTRIBUTION_ID}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> npm run build (frontend)"
npm --prefix "$ROOT_DIR/frontend" run build

echo "==> sincronizando assets (cache longo) com S3"
aws s3 sync "$ROOT_DIR/frontend/dist/" "s3://$S3_BUCKET/" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

echo "==> subindo index.html (sem cache, com guarda)"
aws s3 cp "$ROOT_DIR/frontend/dist/index.html" "s3://$S3_BUCKET/index.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html"

echo "==> invalidando CloudFront"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

echo "deploy do frontend concluido."
