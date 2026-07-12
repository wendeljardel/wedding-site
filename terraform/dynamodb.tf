resource "aws_dynamodb_table" "gifts" {
  name         = var.gifts_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "giftId"

  attribute {
    name = "giftId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery
  }
}

resource "aws_dynamodb_table" "honeymoon" {
  name         = var.honeymoon_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "claimId"

  attribute {
    name = "claimId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery
  }
}
