/*
  Popula a tabela wedding-gifts com o conteudo de infra/seed-gifts.json.

  Uso:
    AWS_REGION=us-east-1 npm --prefix scripts run seed

  Variaveis opcionais:
    TABLE_NAME (default: wedding-gifts)
    SEED_FILE  (default: ../infra/seed-gifts.json)
*/
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const __dirname = dirname(fileURLToPath(import.meta.url))

const tableName = process.env.TABLE_NAME ?? 'wedding-gifts'
const seedFile = process.env.SEED_FILE ?? resolve(__dirname, '../infra/seed-gifts.json')

interface Gift {
  giftId: string
  name: string
  description: string
  imageUrl: string
  price: number
  storeUrl: string
  status: 'available' | 'claimed'
  multiClaim?: boolean
  maxClaims?: number
}

/** Campos de catalogo que o seed pode atualizar sem apagar reservas. */
const CATALOG_FIELDS = ['name', 'description', 'imageUrl', 'price', 'storeUrl', 'multiClaim', 'maxClaims'] as const

async function upsertGift(ddb: DynamoDBDocumentClient, item: Gift) {
  const existing = await ddb.send(
    new GetCommand({
      TableName: tableName,
      Key: { giftId: item.giftId },
      ProjectionExpression: '#s, claimedBy, claimedAt, claims',
      ExpressionAttributeNames: { '#s': 'status' },
    }),
  )

  if (!existing.Item) {
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: [{ PutRequest: { Item: item } }],
        },
      }),
    )
    return 'created'
  }

  const attrNames: Record<string, string> = {}
  const setParts: string[] = []
  const values: Record<string, unknown> = {}

  for (const field of CATALOG_FIELDS) {
    const value = item[field as keyof Gift]
    if (value === undefined) continue
    const key = `#${field}`
    attrNames[key] = field
    setParts.push(`${key} = :${field}`)
    values[`:${field}`] = value
  }

  // So atualiza status quando o item ainda nao foi reservado.
  if (existing.Item.status !== 'claimed' && !existing.Item.claims?.length) {
    attrNames['#s'] = 'status'
    setParts.push('#s = :status')
    values[':status'] = item.status
  }

  if (setParts.length === 0) return 'updated'

  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { giftId: item.giftId },
      UpdateExpression: `SET ${setParts.join(', ')}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: values,
    }),
  )
  return 'updated'
}

async function main() {
  const raw = readFileSync(seedFile, 'utf8')
  const gifts = JSON.parse(raw) as Gift[]

  const client = new DynamoDBClient({})
  const ddb = DynamoDBDocumentClient.from(client)

  let created = 0
  let updated = 0

  for (const item of gifts) {
    const result = await upsertGift(ddb, item)
    if (result === 'created') created++
    else updated++
  }

  console.log(`done. ${gifts.length} presentes na tabela ${tableName} (${created} novos, ${updated} atualizados).`)
  console.log('reservas existentes (status claimed / claims[]) foram preservadas.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
