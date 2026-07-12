import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, RSVP_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  Painel admin para confirmacoes de presenca (RSVP), protegido pelo
  header X-Admin-Token. Permite listar todas as respostas e excluir
  registros duplicados ou indevidos.
*/

function checkAdmin(headers: Record<string, string | undefined>): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  return headers['x-admin-token'] === expected
}

// GET /api/admin/rsvp
export const list: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  try {
    const res = await ddb.send(new ScanCommand({ TableName: RSVP_TABLE }))
    const items = (res.Items ?? []).slice().sort((a, b) =>
      String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
    )
    return json(200, items)
  } catch (err) {
    console.error('admin rsvp list failed', err)
    return error(500, 'internal error')
  }
}

// DELETE /api/admin/rsvp/{rsvpId}
export const remove: APIGatewayProxyHandlerV2 = async (event) => {
  if (!checkAdmin(event.headers as Record<string, string | undefined>)) {
    return error(401, 'unauthorized')
  }
  const rsvpId = event.pathParameters?.rsvpId
  if (!rsvpId) return error(400, 'rsvpId missing')

  try {
    await ddb.send(new DeleteCommand({ TableName: RSVP_TABLE, Key: { rsvpId } }))
    return json(200, { ok: true })
  } catch (err) {
    console.error('admin rsvp delete failed', err)
    return error(500, 'internal error')
  }
}
