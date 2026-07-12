# Bundle único gerado pelo esbuild em backend/dist/handlers.
# Rode `npm --prefix backend run build` antes do terraform apply.
data "archive_file" "backend" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/handlers"
  output_path = "${path.module}/build/backend.zip"
}

resource "aws_cloudwatch_log_group" "fn" {
  for_each = local.functions

  name              = "/aws/lambda/${local.name_prefix}-${replace(each.key, "_", "-")}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "fn" {
  for_each = local.functions

  function_name = "${local.name_prefix}-${replace(each.key, "_", "-")}"
  role          = aws_iam_role.fn[each.key].arn
  handler       = each.value.handler
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  timeout       = var.lambda_timeout_seconds
  memory_size   = var.lambda_memory_mb

  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256

  environment {
    variables = merge(
      {
        GIFTS_TABLE     = local.table_names["gifts"]
        HONEYMOON_TABLE = local.table_names["honeymoon"]
        RSVP_TABLE      = local.table_names["rsvp"]
        CORS_ORIGIN     = var.cors_origin
      },
      each.value.admin ? { ADMIN_TOKEN = var.admin_token } : {},
    )
  }

  depends_on = [aws_cloudwatch_log_group.fn]
}
