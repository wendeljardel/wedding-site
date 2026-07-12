variable "aws_region" {
  type        = string
  description = "Região AWS para os recursos (Lambda, DynamoDB, API Gateway, S3). CloudFront é global."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Prefixo lógico para nomes de recursos."
  default     = "wedding-site"
}

variable "admin_token" {
  type        = string
  description = "Token secreto exigido no header X-Admin-Token para os endpoints /api/admin/*."
  sensitive   = true
}

variable "cors_origin" {
  type        = string
  description = "Origem permitida no CORS. Com CloudFront, site e API ficam na mesma origem, então '*' é seguro."
  default     = "*"
}

variable "price_class" {
  type        = string
  description = "Classe de preço do CloudFront. PriceClass_100 é a mais barata; PriceClass_All inclui edge no Brasil."
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "price_class deve ser PriceClass_100, PriceClass_200 ou PriceClass_All."
  }
}

variable "log_retention_days" {
  type        = number
  description = "Dias de retenção dos logs das Lambdas no CloudWatch (evita acúmulo indefinido de custo)."
  default     = 14
}

variable "gifts_table_name" {
  type        = string
  description = "Nome da tabela DynamoDB de presentes (o script de seed usa 'wedding-gifts' por padrão)."
  default     = "wedding-gifts"
}

variable "honeymoon_table_name" {
  type        = string
  description = "Nome da tabela DynamoDB das contribuições de lua de mel."
  default     = "wedding-honeymoon-claims"
}

variable "rsvp_table_name" {
  type        = string
  description = "Nome da tabela DynamoDB das confirmações de presença (RSVP)."
  default     = "wedding-rsvp"
}

variable "point_in_time_recovery" {
  type        = bool
  description = "Habilita PITR (backup contínuo) nas tabelas DynamoDB. Custo desprezível no volume de um casamento."
  default     = true
}

variable "lambda_memory_mb" {
  type        = number
  description = "Memória das Lambdas (MB). 256 é suficiente e econômico."
  default     = 256
}

variable "lambda_timeout_seconds" {
  type        = number
  description = "Timeout das Lambdas (s)."
  default     = 5
}
