import { useState } from 'react'
import {
  api,
  ApiError,
  type AdminGift,
  type HoneymoonClaim,
} from '../lib/api'

type Tab = 'gifts' | 'honeymoon'

export default function Admin() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [gifts, setGifts] = useState<AdminGift[] | null>(null)
  const [claims, setClaims] = useState<HoneymoonClaim[] | null>(null)
  const [tab, setTab] = useState<Tab>('gifts')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function login(t: string) {
    setBusy(true)
    setError(null)
    try {
      const [giftsData, claimsData] = await Promise.all([
        api.admin.listGifts(t),
        api.admin.listHoneymoon(t),
      ])
      setGifts(giftsData)
      setClaims(claimsData)
      setAuthed(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Token invalido.')
      } else {
        setError('Falha ao carregar. Verifique sua conexao.')
      }
      setAuthed(false)
      setGifts(null)
      setClaims(null)
    } finally {
      setBusy(false)
    }
  }

  async function reload() {
    if (!token) return
    await login(token)
  }

  async function releaseGift(giftId: string) {
    if (!confirm('Liberar este presente para os outros convidados?')) return
    try {
      await api.admin.releaseGift(token, giftId)
      await reload()
    } catch {
      setError('Falha ao liberar.')
    }
  }

  async function toggleConfirm(claim: HoneymoonClaim) {
    try {
      await api.admin.confirmHoneymoon(token, claim.claimId, !claim.confirmed)
      await reload()
    } catch {
      setError('Falha ao atualizar status.')
    }
  }

  async function deleteClaim(claimId: string) {
    if (!confirm('Excluir este aviso de pagamento?')) return
    try {
      await api.admin.deleteHoneymoon(token, claimId)
      await reload()
    } catch {
      setError('Falha ao excluir.')
    }
  }

  if (!authed) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-serif mb-6 text-center">Painel admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (token.trim()) login(token.trim())
          }}
          className="space-y-4"
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="X-Admin-Token"
            className="w-full border border-[var(--color-sand)] bg-white px-4 py-3 outline-none focus:border-[var(--color-clay)]"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-[var(--color-ink)] text-[var(--color-cream)] uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {busy ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-serif">Painel admin</h1>
        <button
          onClick={reload}
          className="text-xs uppercase tracking-widest border border-[var(--color-sand)] px-4 py-2"
        >
          Recarregar
        </button>
      </header>

      <div className="flex gap-1 border-b border-[var(--color-sand)] mb-8">
        <TabBtn
          active={tab === 'gifts'}
          onClick={() => setTab('gifts')}
          label={`Presentes (${gifts?.filter((g) => g.status === 'claimed').length ?? 0})`}
        />
        <TabBtn
          active={tab === 'honeymoon'}
          onClick={() => setTab('honeymoon')}
          label={`Lua de mel (${claims?.length ?? 0})`}
        />
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 p-3">
          {error}
        </p>
      )}

      {tab === 'gifts' && gifts && (
        <GiftsTab gifts={gifts} onRelease={releaseGift} />
      )}
      {tab === 'honeymoon' && claims && (
        <HoneymoonTab
          claims={claims}
          onToggleConfirm={toggleConfirm}
          onDelete={deleteClaim}
        />
      )}
    </section>
  )
}

function TabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-xs uppercase tracking-widest -mb-px border-b-2 ${
        active
          ? 'border-[var(--color-ink)]'
          : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
      }`}
    >
      {label}
    </button>
  )
}

function GiftsTab({
  gifts,
  onRelease,
}: {
  gifts: AdminGift[]
  onRelease: (giftId: string) => void
}) {
  const claimed = gifts.filter((g) => g.status === 'claimed')
  const available = gifts.filter((g) => g.status === 'available')
  return (
    <>
      <h2 className="text-xl font-serif mb-4">Reservados ({claimed.length})</h2>
      <table className="w-full text-sm mb-12 border-collapse">
        <thead>
          <tr className="text-left border-b border-[var(--color-sand)]">
            <th className="py-2">Presente</th>
            <th>Quem reservou</th>
            <th>Quando</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {claimed.map((g) => (
            <tr key={g.giftId} className="border-b border-[var(--color-sand)]">
              <td className="py-3">{g.name}</td>
              <td className="font-mono">{g.claimedBy}</td>
              <td className="text-[var(--color-muted)]">
                {g.claimedAt ? new Date(g.claimedAt).toLocaleString('pt-BR') : '-'}
              </td>
              <td>
                <button
                  onClick={() => onRelease(g.giftId)}
                  className="text-xs text-red-700 underline"
                >
                  liberar
                </button>
              </td>
            </tr>
          ))}
          {claimed.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-[var(--color-muted)] text-center">
                Nenhuma reserva ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="text-xl font-serif mb-4">Disponiveis ({available.length})</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {available.map((g) => (
          <li
            key={g.giftId}
            className="text-sm py-1 border-b border-[var(--color-sand)]"
          >
            {g.name}
          </li>
        ))}
      </ul>
    </>
  )
}

function HoneymoonTab({
  claims,
  onToggleConfirm,
  onDelete,
}: {
  claims: HoneymoonClaim[]
  onToggleConfirm: (c: HoneymoonClaim) => void
  onDelete: (claimId: string) => void
}) {
  const total = claims
    .filter((c) => c.confirmed)
    .reduce((sum, c) => sum + Number(c.amount ?? 0), 0)
  const pendingTotal = claims
    .filter((c) => !c.confirmed)
    .reduce((sum, c) => sum + Number(c.amount ?? 0), 0)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Stat
          label="Confirmado"
          value={`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
        <Stat
          label="Aguardando confirmacao"
          value={`R$ ${pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
      </div>

      <p className="text-xs text-[var(--color-muted)] mb-6">
        Confira cada txid no extrato Pix do banco e marque como confirmado.
        O txid aparece na referencia da transacao em quase todos os bancos.
      </p>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-[var(--color-sand)]">
            <th className="py-2">Cota</th>
            <th>Convidado</th>
            <th>Valor</th>
            <th>txid</th>
            <th>Quando</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.claimId} className="border-b border-[var(--color-sand)]">
              <td className="py-3">{c.cotaLabel}</td>
              <td>{c.guestName}</td>
              <td className="font-mono">
                R$ {Number(c.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="font-mono text-xs">{c.txid}</td>
              <td className="text-[var(--color-muted)] text-xs">
                {c.createdAt ? new Date(c.createdAt).toLocaleString('pt-BR') : '-'}
              </td>
              <td>
                <button
                  onClick={() => onToggleConfirm(c)}
                  className={`text-xs uppercase tracking-widest px-3 py-1 ${
                    c.confirmed
                      ? 'bg-green-700 text-white'
                      : 'border border-[var(--color-sand)]'
                  }`}
                >
                  {c.confirmed ? 'Confirmado' : 'Pendente'}
                </button>
              </td>
              <td>
                <button
                  onClick={() => onDelete(c.claimId)}
                  className="text-xs text-red-700 underline"
                >
                  excluir
                </button>
              </td>
            </tr>
          ))}
          {claims.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-[var(--color-muted)] text-center">
                Nenhuma contribuicao ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--color-sand)] p-4">
      <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-serif">{value}</p>
    </div>
  )
}
