/*
  Gera Pix Copia-e-Cola (BR Code) no navegador, sem dependencias.
  Padrao EMV QR Code Pix estatico, documentado pelo Banco Central:
  https://www.bcb.gov.br/estabilidadefinanceira/pix

  Configuracoes vem de variaveis de ambiente Vite (.env). Restricoes:
  - merchantName: ate 25 chars, ASCII sem acentos
  - merchantCity: ate 15 chars, ASCII sem acentos
  - txid: 1-25 chars alfanumericos [A-Za-z0-9]
*/

export interface PixConfig {
  pixKey: string
  merchantName: string
  merchantCity: string
}

export const PIX_CONFIG: PixConfig = {
  pixKey: import.meta.env.VITE_PIX_KEY ?? 'CHAVE-PIX-AINDA-NAO-CONFIGURADA',
  merchantName: import.meta.env.VITE_PIX_MERCHANT_NAME ?? 'THAMIRES E WENDEL',
  merchantCity: import.meta.env.VITE_PIX_MERCHANT_CITY ?? 'SAO PAULO',
}

export function pixIsConfigured(): boolean {
  return (
    !!PIX_CONFIG.pixKey &&
    !PIX_CONFIG.pixKey.startsWith('CHAVE-PIX-AINDA-NAO')
  )
}

export function generateTxid(): string {
  const now = new Date()
  const yyyymmdd = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}`
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `LDM${yyyymmdd}${rand}`
}

export function generateBRCode(amount: number, txid: string): string {
  const cleanKey = sanitize(PIX_CONFIG.pixKey)
  const cleanName = sanitizeAscii(PIX_CONFIG.merchantName).slice(0, 25)
  const cleanCity = sanitizeAscii(PIX_CONFIG.merchantCity).slice(0, 15)
  const cleanTxid = sanitizeTxid(txid)
  const amountStr = round2(amount).toFixed(2)

  const merchantAccount = tlv(
    '26',
    tlv('00', 'br.gov.bcb.pix') + tlv('01', cleanKey),
  )
  const additionalData = tlv('62', tlv('05', cleanTxid))

  const payload =
    tlv('00', '01') +
    merchantAccount +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amountStr) +
    tlv('58', 'BR') +
    tlv('59', cleanName) +
    tlv('60', cleanCity) +
    additionalData +
    '6304'

  return payload + crc16(payload)
}

function tlv(id: string, value: string): string {
  return id + value.length.toString().padStart(2, '0') + value
}

function sanitize(s: string): string {
  return s.trim()
}

function sanitizeAscii(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .toUpperCase()
    .trim()
}

function sanitizeTxid(s: string): string {
  const cleaned = s.replace(/[^A-Za-z0-9]/g, '').slice(0, 25)
  return cleaned || '***'
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}
