import { randomUUID } from 'node:crypto'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ddb, RSVP_TABLE } from '../lib/dynamo'
import { error, json } from '../lib/http'

/*
  POST /api/rsvp
  Body: { guestName, attending, companions?, message?, website? }

  Registra a confirmacao (ou recusa) de presenca de um convidado.
  Sem login: cada envio gera um registro; a reconciliacao/limpeza de
  duplicados e feita no painel admin.

  `website` e um honeypot: bots costumam preencher todos os campos.
  Se vier preenchido, respondemos 201 mas nao gravamos nada.
*/
const MAX_COMPANIONS = 10

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let guestName = ''
  let attending = false
  let companions = 0
  let message = ''
  let honeypot = ''

  try {
    const body = JSON.parse(event.body ?? '{}')
    guestName = String(body.guestName ?? '').trim()
    attending = Boolean(body.attending)
    companions = Number.isFinite(Number(body.companions)) ? Math.floor(Number(body.companions)) : 0
    message = String(body.message ?? '').trim()
    honeypot = String(body.website ?? '').trim()
  } catch {
    return error(400, 'invalid json body')
  }

  if (!guestName) return error(400, 'guestName is required')
  if (guestName.length > 100) return error(400, 'guestName too long')
  if (message.length > 500) return error(400, 'message too long')
  if (companions < 0 || companions > MAX_COMPANIONS) {
    return error(400, 'invalid companions')
  }

  // Honeypot preenchido: provavelmente bot. Finge sucesso e ignora.
  if (honeypot) return json(201, { rsvpId: 'ignored' })

  // Quem nao vai nao leva acompanhantes.
  if (!attending) companions = 0

  const rsvpId = randomUUID()
  const createdAt = new Date().toISOString()

  try {
    await ddb.send(
      new PutCommand({
        TableName: RSVP_TABLE,
        Item: {
          rsvpId,
          guestName,
          attending,
          companions,
          message,
          createdAt,
        },
      }),
    )
    return json(201, { rsvpId })
  } catch (err) {
    console.error('rsvp failed', err)
    return error(500, 'internal error')
  }
}
