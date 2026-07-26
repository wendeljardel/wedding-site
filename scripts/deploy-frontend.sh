#!/usr/bin/env bash
# Sobe o build da SPA para o bucket S3 e invalida a distribuicao CloudFront.
#
# Requisitos:
#   - AWS CLI configurado (aws configure)
#   - Terraform aplicado (terraform apply) na pasta terraform/
#
# O bucket e a distribuicao sao descobertos automaticamente a partir dos
# outputs do Terraform (site_bucket_name / distribution_id). Da pra sobrescrever:
#       S3_BUCKET=...                     (opcional, pula a descoberta)
#       CLOUDFRONT_DISTRIBUTION_ID=...    (opcional, pula a descoberta)
#
# Uso: ./scripts/deploy-frontend.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="$ROOT_DIR/terraform"

tf_output() {
  terraform -chdir="$TF_DIR" output -raw "$1" 2>/dev/null
}

if [[ -z "${S3_BUCKET:-}" ]]; then
  echo "==> descobrindo bucket S3 nos outputs do Terraform"
  S3_BUCKET="$(tf_output site_bucket_name)"
fi
if [[ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "==> descobrindo distribuicao CloudFront nos outputs do Terraform"
  CLOUDFRONT_DISTRIBUTION_ID="$(tf_output distribution_id)"
fi

: "${S3_BUCKET:?nao consegui obter S3_BUCKET (rode 'terraform apply' primeiro ou defina a var)}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?nao consegui obter CLOUDFRONT_DISTRIBUTION_ID (rode 'terraform apply' primeiro ou defina a var)}"

echo "    bucket:       $S3_BUCKET"
echo "    distribution: $CLOUDFRONT_DISTRIBUTION_ID"

echo "==> npm run build (frontend)"
npm --prefix "$ROOT_DIR/frontend" run build

# o Finder cria .DS_Store dentro de public/ e o Vite copia pro build; publicar isso
# expõe a lista de arquivos da pasta
echo "==> removendo .DS_Store do build"
find "$ROOT_DIR/frontend/dist" -name ".DS_Store" -delete

echo "==> sincronizando assets (cache longo) com S3"
aws s3 sync "$ROOT_DIR/frontend/dist/" "s3://$S3_BUCKET/" \
  --delete \
  --exclude "index.html" \
  --exclude "*.DS_Store" \
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
