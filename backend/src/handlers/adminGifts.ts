import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, GIFTS_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  Handlers do painel administrativo, protegidos pelo header X-Admin-Token.
  O valor esperado vem da env var ADMIN_TOKEN (definida no template.yaml
  a partir de um parametro da stack para nao ficar no repositorio).
*/

function checkAdmin(headers: Record<string, string | undefined>): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  // headers no API Gateway HTTP API vem em lowercase
  const received = headers['x-admin-token']
  return received === expected
}

// GET /api/admin/gifts
export const list: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  try {
    const res = await ddb.send(new ScanCommand({ TableName: GIFTS_TABLE }))
    return json(200, res.Items ?? [])
  } catch (err) {
    console.error('admin list failed', err)
    return error(500, 'internal error')
  }
}

// POST /api/admin/gifts/{giftId}/release
export const release: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  const giftId = event.pathParameters?.giftId
  if (!giftId) return error(400, 'giftId missing')

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: GIFTS_TABLE,
        Key: { giftId },
        UpdateExpression: 'SET #s = :available REMOVE claimedBy, claimedAt',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':available': 'available' },
      }),
    )
    return json(200, { ok: true })
  } catch (err) {
    console.error('admin release failed', err)
    return error(500, 'internal error')
  }
}
