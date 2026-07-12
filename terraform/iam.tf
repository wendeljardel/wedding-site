data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# Um role por função (menor privilégio: cada uma só acessa a tabela que usa).
resource "aws_iam_role" "fn" {
  for_each = local.functions

  name               = "${local.name_prefix}-${replace(each.key, "_", "-")}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# Logs no CloudWatch (CreateLogStream/PutLogEvents).
resource "aws_iam_role_policy_attachment" "fn_basic" {
  for_each = local.functions

  role       = aws_iam_role.fn[each.key].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Acesso DynamoDB restrito à tabela e ao nível (read/crud) de cada função.
resource "aws_iam_role_policy" "fn_dynamo" {
  for_each = local.functions

  name = "dynamo"
  role = aws_iam_role.fn[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "TableAccess"
        Effect   = "Allow"
        Action   = local.dynamo_actions[each.value.access]
        Resource = local.table_arns[each.value.table]
      }
    ]
  })
}
