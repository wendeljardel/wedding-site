/*
  Cliente HTTP minimo para a API serverless.
  Em dev, requisicoes a /api sao proxied para http://localhost:3000 (sam local).
  Em prod, /api e servido pelo CloudFront atraves do API Gateway.
*/

export type GiftStatus = 'available' | 'claimed'

export interface Gift {
  giftId: string
  name: string
  description: string
  imageUrl: string
  price: number
  storeUrl: string
  status: GiftStatus
}

export interface AdminGift extends Gift {
  claimedBy?: string
  claimedAt?: string
}

export interface HoneymoonClaim {
  claimId: string
  cotaId: string
  cotaLabel: string
  amount: number
  guestName: string
  txid: string
  confirmed: boolean
  createdAt: string
}

export interface HoneymoonClaimInput {
  cotaId: string
  cotaLabel: string
  amount: number
  guestName: string
  txid: string
}

export interface Rsvp {
  rsvpId: string
  guestName: string
  attending: boolean
  companions: number
  message: string
  createdAt: string
}

export interface RsvpInput {
  guestName: string
  attending: boolean
  companions: number
  message: string
  /** honeypot anti-spam: deve ficar vazio */
  website?: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new ApiError(res.status, body || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  listGifts: () => request<Gift[]>('/api/gifts'),

  claimGift: (giftId: string, guestName: string) =>
    request<{ storeUrl: string }>(`/api/gifts/${encodeURIComponent(giftId)}/claim`, {
      method: 'POST',
      body: JSON.stringify({ guestName }),
    }),

  claimHoneymoon: (input: HoneymoonClaimInput) =>
    request<{ claimId: string }>('/api/honeymoon/claim', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  sendRsvp: (input: RsvpInput) =>
    request<{ rsvpId: string }>('/api/rsvp', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  admin: {
    listGifts: (token: string) =>
      request<AdminGift[]>('/api/admin/gifts', {
        headers: { 'X-Admin-Token': token },
      }),

    releaseGift: (token: string, giftId: string) =>
      request<void>(`/api/admin/gifts/${encodeURIComponent(giftId)}/release`, {
        method: 'POST',
        headers: { 'X-Admin-Token': token },
      }),

    listHoneymoon: (token: string) =>
      request<HoneymoonClaim[]>('/api/admin/honeymoon', {
        headers: { 'X-Admin-Token': token },
      }),

    confirmHoneymoon: (token: string, claimId: string, confirmed: boolean) =>
      request<void>(
        `/api/admin/honeymoon/${encodeURIComponent(claimId)}/confirm`,
        {
          method: 'POST',
          headers: { 'X-Admin-Token': token },
          body: JSON.stringify({ confirmed }),
        },
      ),

    deleteHoneymoon: (token: string, claimId: string) =>
      request<void>(`/api/admin/honeymoon/${encodeURIComponent(claimId)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token },
      }),

    listRsvp: (token: string) =>
      request<Rsvp[]>('/api/admin/rsvp', {
        headers: { 'X-Admin-Token': token },
      }),

    deleteRsvp: (token: string, rsvpId: string) =>
      request<void>(`/api/admin/rsvp/${encodeURIComponent(rsvpId)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token },
      }),
  },
}
