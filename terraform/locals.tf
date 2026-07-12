locals {
  name_prefix = var.project_name

  # Ações DynamoDB por nível de acesso.
  dynamo_actions = {
    read = [
      "dynamodb:GetItem",
      "dynamodb:BatchGetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
    ]
    crud = [
      "dynamodb:GetItem",
      "dynamodb:BatchGetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
    ]
  }

  table_arns = {
    gifts     = aws_dynamodb_table.gifts.arn
    honeymoon = aws_dynamodb_table.honeymoon.arn
    rsvp      = aws_dynamodb_table.rsvp.arn
  }

  table_names = {
    gifts     = aws_dynamodb_table.gifts.name
    honeymoon = aws_dynamodb_table.honeymoon.name
    rsvp      = aws_dynamodb_table.rsvp.name
  }

  # Cada função Lambda + rota HTTP + acesso à tabela. Um único bundle
  # (backend/dist/handlers) é usado por todas; muda apenas o `handler`.
  #   table  -> qual tabela ela acessa
  #   access -> read | crud
  #   admin  -> se recebe o ADMIN_TOKEN como env var
  #   route  -> route_key do API Gateway HTTP API ("<MÉTODO> <caminho>")
  functions = {
    list_gifts = {
      handler = "listGifts.handler"
      table   = "gifts"
      access  = "read"
      admin   = false
      route   = "GET /api/gifts"
    }
    claim_gift = {
      handler = "claimGift.handler"
      table   = "gifts"
      access  = "crud"
      admin   = false
      route   = "POST /api/gifts/{giftId}/claim"
    }
    admin_gifts_list = {
      handler = "adminGifts.list"
      table   = "gifts"
      access  = "read"
      admin   = true
      route   = "GET /api/admin/gifts"
    }
    admin_gifts_release = {
      handler = "adminGifts.release"
      table   = "gifts"
      access  = "crud"
      admin   = true
      route   = "POST /api/admin/gifts/{giftId}/release"
    }
    claim_honeymoon = {
      handler = "claimHoneymoon.handler"
      table   = "honeymoon"
      access  = "crud"
      admin   = false
      route   = "POST /api/honeymoon/claim"
    }
    admin_honeymoon_list = {
      handler = "adminHoneymoon.list"
      table   = "honeymoon"
      access  = "read"
      admin   = true
      route   = "GET /api/admin/honeymoon"
    }
    admin_honeymoon_confirm = {
      handler = "adminHoneymoon.confirm"
      table   = "honeymoon"
      access  = "crud"
      admin   = true
      route   = "POST /api/admin/honeymoon/{claimId}/confirm"
    }
    admin_honeymoon_delete = {
      handler = "adminHoneymoon.remove"
      table   = "honeymoon"
      access  = "crud"
      admin   = true
      route   = "DELETE /api/admin/honeymoon/{claimId}"
    }
    rsvp = {
      handler = "rsvp.handler"
      table   = "rsvp"
      access  = "crud"
      admin   = false
      route   = "POST /api/rsvp"
    }
    admin_rsvp_list = {
      handler = "adminRsvp.list"
      table   = "rsvp"
      access  = "read"
      admin   = true
      route   = "GET /api/admin/rsvp"
    }
    admin_rsvp_delete = {
      handler = "adminRsvp.remove"
      table   = "rsvp"
      access  = "crud"
      admin   = true
      route   = "DELETE /api/admin/rsvp/{rsvpId}"
    }
  }
}
