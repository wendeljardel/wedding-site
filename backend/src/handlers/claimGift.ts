import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import {
  ConditionalCheckFailedException,
} from '@aws-sdk/client-dynamodb'
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, GIFTS_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  POST /api/gifts/{giftId}/claim
  Body: { guestName: string }

  Presentes normais: UpdateItem com ConditionExpression resolve a corrida
  quando dois convidados clicam quase ao mesmo tempo.

  Presentes multiClaim (ex.: gift card): registra o interesse em claims[]
  mas mantem status available para outros convidados.
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
    const existing = await ddb.send(
      new GetCommand({
        TableName: GIFTS_TABLE,
        Key: { giftId },
      }),
    )

    const gift = existing.Item
    if (!gift) return error(404, 'gift not found')

    const storeUrl = gift.storeUrl
    if (!storeUrl) return error(500, 'gift has no storeUrl')

    const now = new Date().toISOString()

    if (gift.multiClaim) {
      const claims = (gift.claims as Array<unknown> | undefined) ?? []
      const maxClaims = gift.maxClaims as number | undefined
      if (maxClaims != null && claims.length >= maxClaims) {
        return error(409, 'gift already claimed')
      }

      const values: Record<string, unknown> = {
        ':empty': [],
        ':claim': [{ guestName, claimedAt: now }],
      }

      if (maxClaims != null) {
        values[':maxClaims'] = maxClaims
      }

      await ddb.send(
        new UpdateCommand({
          TableName: GIFTS_TABLE,
          Key: { giftId },
          UpdateExpression:
            'SET claims = list_append(if_not_exists(claims, :empty), :claim)',
          ...(maxClaims != null
            ? {
                ConditionExpression:
                  'size(if_not_exists(claims, :empty)) < :maxClaims',
              }
            : {}),
          ExpressionAttributeValues: values,
        }),
      )
      return json(200, { storeUrl, multiClaim: true })
    }

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
          ':now': now,
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    const updatedStoreUrl = res.Attributes?.storeUrl
    if (!updatedStoreUrl) return error(500, 'gift has no storeUrl')

    return json(200, { storeUrl: updatedStoreUrl })
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return error(409, 'gift already claimed')
    }
    console.error('claimGift failed', err)
    return error(500, 'internal error')
  }
}
