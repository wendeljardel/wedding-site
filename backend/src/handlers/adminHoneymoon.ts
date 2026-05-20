import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import {
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { ddb, HONEYMOON_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  Painel admin para cotas de lua de mel, protegido pelo header
  X-Admin-Token. Permite listar todas as contribuicoes registradas,
  marcar como confirmadas (apos bater o extrato Pix) e excluir
  avisos duplicados ou indevidos.
*/

function checkAdmin(headers: Record<string, string | undefined>): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  return headers['x-admin-token'] === expected
}

// GET /api/admin/honeymoon
export const list: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  try {
    const res = await ddb.send(new ScanCommand({ TableName: HONEYMOON_TABLE }))
    const items = (res.Items ?? []).slice().sort((a, b) =>
      String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
    )
    return json(200, items)
  } catch (err) {
    console.error('admin honeymoon list failed', err)
    return error(500, 'internal error')
  }
}

// POST /api/admin/honeymoon/{claimId}/confirm  body: { confirmed: boolean }
export const confirm: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  const claimId = event.pathParameters?.claimId
  if (!claimId) return error(400, 'claimId missing')

  let confirmed = true
  try {
    const body = JSON.parse(event.body ?? '{}')
    if (typeof body.confirmed === 'boolean') confirmed = body.confirmed
  } catch {
    return error(400, 'invalid json body')
  }

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: HONEYMOON_TABLE,
        Key: { claimId },
        UpdateExpression: 'SET confirmed = :c, confirmedAt = :now',
        ExpressionAttributeValues: {
          ':c': confirmed,
          ':now': confirmed ? new Date().toISOString() : null,
        },
      }),
    )
    return json(200, { ok: true })
  } catch (err) {
    console.error('admin honeymoon confirm failed', err)
    return error(500, 'internal error')
  }
}

// DELETE /api/admin/honeymoon/{claimId}
export const remove: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  const claimId = event.pathParameters?.claimId
  if (!claimId) return error(400, 'claimId missing')

  try {
    await ddb.send(
      new DeleteCommand({ TableName: HONEYMOON_TABLE, Key: { claimId } }),
    )
    return json(200, { ok: true })
  } catch (err) {
    console.error('admin honeymoon delete failed', err)
    return error(500, 'internal error')
  }
}
