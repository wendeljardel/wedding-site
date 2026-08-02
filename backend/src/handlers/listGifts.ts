import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, GIFTS_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  GET /api/gifts
  Lista publica de presentes. Nao expoe claimedBy nem claimedAt
  para que convidados nao vejam quem reservou o que.
*/
export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const res = await ddb.send(
      new ScanCommand({
        TableName: GIFTS_TABLE,
        ProjectionExpression:
          'giftId, #n, description, imageUrl, price, storeUrl, #s, multiClaim, maxClaims, claims',
        ExpressionAttributeNames: { '#n': 'name', '#s': 'status' },
      }),
    )

    const items = (res.Items ?? []).map((item) => {
      const claims = item.claims as unknown[] | undefined
      const { claims: _claims, ...publicItem } = item
      if (!item.multiClaim) return publicItem
      return { ...publicItem, claimCount: claims?.length ?? 0 }
    })

    return json(200, items)
  } catch (err) {
    console.error('listGifts failed', err)
    return error(500, 'internal error')
  }
}
