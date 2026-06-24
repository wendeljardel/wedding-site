import { randomUUID } from 'node:crypto'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, HONEYMOON_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  POST /api/honeymoon/claim
  Body: { cotaId, cotaLabel, amount, guestName, txid }

  Registra que um convidado afirmou ter feito o Pix de uma cota
  de lua de mel. Nao confirma pagamento - a reconciliacao com o
  extrato bancario e manual via painel admin.
*/
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let cotaId = ''
  let cotaLabel = ''
  let amount = 0
  let guestName = ''
  let txid = ''
  try {
    const body = JSON.parse(event.body ?? '{}')
    cotaId = String(body.cotaId ?? '').trim()
    cotaLabel = String(body.cotaLabel ?? '').trim()
    amount = Number(body.amount)
    guestName = String(body.guestName ?? '').trim()
    txid = String(body.txid ?? '').trim()
  } catch {
    return error(400, 'invalid json body')
  }

  if (!cotaId) return error(400, 'cotaId is required')
  if (!cotaLabel) return error(400, 'cotaLabel is required')
  if (!guestName) return error(400, 'guestName is required')
  if (guestName.length > 100) return error(400, 'guestName too long')
  if (!txid) return error(400, 'txid is required')
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return error(400, 'invalid amount')
  }

  const claimId = randomUUID()
  const createdAt = new Date().toISOString()

  try {
    await ddb.send(
      new PutCommand({
        TableName: HONEYMOON_TABLE,
        Item: {
          claimId,
          cotaId,
          cotaLabel,
          amount,
          guestName,
          txid,
          confirmed: false,
          createdAt,
        },
      }),
    )
    return json(201, { claimId })
  } catch (err) {
    console.error('claimHoneymoon failed', err)
    return error(500, 'internal error')
  }
}
