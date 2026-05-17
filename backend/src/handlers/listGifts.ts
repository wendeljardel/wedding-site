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
        ProjectionExpression: 'giftId, #n, description, imageUrl, price, storeUrl, #s',
        ExpressionAttributeNames: { '#n': 'name', '#s': 'status' },
      }),
    )
    return json(200, res.Items ?? [])
  } catch (err) {
    console.error('listGifts failed', err)
    return error(500, 'internal error')
  }
}
