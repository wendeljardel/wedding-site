import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import {
  ConditionalCheckFailedException,
} from '@aws-sdk/client-dynamodb'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, GIFTS_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  POST /api/gifts/{giftId}/claim
  Body: { guestName: string }

  UpdateItem com ConditionExpression resolve a corrida quando dois
  convidados clicam quase ao mesmo tempo: somente o primeiro vence,
  o segundo recebe 409.
*/
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const giftId = event.pathParameters?.giftId
  if (!giftId) return error(400, 'giftId missing')

  let guestName: string
  try {
    const body = JSON.parse(event.body ?? '{}')
    guestName = String(body.guestName ?? '').trim()
  } catch {
    return error(400, 'invalid json body')
  }

  if (!guestName) return error(400, 'guestName is required')
  if (guestName.length > 100) return error(400, 'guestName too long')

  try {
    const res = await ddb.send(
      new UpdateCommand({
        TableName: GIFTS_TABLE,
        Key: { giftId },
        UpdateExpression:
          'SET #s = :claimed, claimedBy = :name, claimedAt = :now',
        ConditionExpression: '#s = :available',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: {
          ':claimed': 'claimed',
          ':available': 'available',
          ':name': guestName,
          ':now': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    const storeUrl = res.Attributes?.storeUrl
    if (!storeUrl) return error(500, 'gift has no storeUrl')

    return json(200, { storeUrl })
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return error(409, 'gift already claimed')
    }
    console.error('claimGift failed', err)
    return error(500, 'internal error')
  }
}
