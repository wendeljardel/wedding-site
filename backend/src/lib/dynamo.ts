import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

export const GIFTS_TABLE = process.env.GIFTS_TABLE ?? 'wedding-gifts'
export const HONEYMOON_TABLE =
  process.env.HONEYMOON_TABLE ?? 'wedding-honeymoon-claims'
export const RSVP_TABLE = process.env.RSVP_TABLE ?? 'wedding-rsvp'
