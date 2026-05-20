import type { APIGatewayProxyResultV2 } from 'aws-lambda'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

export function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify(body),
  }
}

export function empty(statusCode: number): APIGatewayProxyResultV2 {
  return { statusCode, headers: corsHeaders, body: '' }
}

export function error(statusCode: number, message: string): APIGatewayProxyResultV2 {
  return json(statusCode, { error: message })
}
