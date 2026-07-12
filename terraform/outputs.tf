output "site_url" {
  description = "URL pública do site (CloudFront)."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "site_bucket_name" {
  description = "Bucket S3 da SPA (usado pelo deploy-frontend.sh)."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "ID da distribuição CloudFront (usado para invalidar o cache no deploy)."
  value       = aws_cloudfront_distribution.site.id
}

output "api_url" {
  description = "URL base da API (uso direto/local; em produção o acesso é via CloudFront em /api)."
  value       = aws_apigatewayv2_api.http.api_endpoint
}

output "gifts_table_name" {
  description = "Nome da tabela DynamoDB de presentes."
  value       = aws_dynamodb_table.gifts.name
}

output "honeymoon_table_name" {
  description = "Nome da tabela DynamoDB de contribuições de lua de mel."
  value       = aws_dynamodb_table.honeymoon.name
}
