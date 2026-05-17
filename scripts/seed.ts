/*
  Popula a tabela wedding-gifts com o conteudo de infra/seed-gifts.json.

  Uso:
    AWS_REGION=sa-east-1 npm --prefix scripts run seed

  Variaveis opcionais:
    TABLE_NAME (default: wedding-gifts)
    SEED_FILE  (default: ../infra/seed-gifts.json)
*/
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb'

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
}

async function main() {
  const raw = readFileSync(seedFile, 'utf8')
  const gifts = JSON.parse(raw) as Gift[]

  const client = new DynamoDBClient({})
  const ddb = DynamoDBDocumentClient.from(client)

  // DynamoDB BatchWrite aceita ate 25 itens por chamada.
  for (let i = 0; i < gifts.length; i += 25) {
    const batch = gifts.slice(i, i + 25)
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((item) => ({ PutRequest: { Item: item } })),
        },
      }),
    )
    console.log(`inserted ${i + batch.length}/${gifts.length}`)
  }

  console.log(`done. ${gifts.length} presentes na tabela ${tableName}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
