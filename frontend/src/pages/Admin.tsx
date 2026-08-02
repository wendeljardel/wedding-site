import { useEffect, useState } from 'react'
import {
  api,
  ApiError,
  type AdminGift,
  type HoneymoonClaim,
  type Rsvp,
} from '../lib/api'

type Tab = 'gifts' | 'honeymoon' | 'rsvp'

const TOKEN_KEY = 'wedding-admin-token'

function readStoredToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function Admin() {
  const [token, setToken] = useState(readStoredToken)
  const [authed, setAuthed] = useState(false)
  const [gifts, setGifts] = useState<AdminGift[] | null>(null)
  const [claims, setClaims] = useState<HoneymoonClaim[] | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null)
  const [tab, setTab] = useState<Tab>('gifts')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function login(t: string) {
    setBusy(true)
    setError(null)
    try {
      const [giftsData, claimsData, rsvpData] = await Promise.all([
        api.admin.listGifts(t),
        api.admin.listHoneymoon(t),
        api.admin.listRsvp(t),
      ])
      setGifts(giftsData)
      setClaims(claimsData)
      setRsvps(rsvpData)
      setAuthed(true)
      setToken(t)
      try {
        localStorage.setItem(TOKEN_KEY, t)
      } catch {
        /* ignore quota / private mode */
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Token inválido.')
        try {
          localStorage.removeItem(TOKEN_KEY)
        } catch {
          /* ignore */
        }
      } else {
        setError('Falha ao carregar. Verifique sua conexão.')
      }
      setAuthed(false)
      setGifts(null)
      setClaims(null)
      setRsvps(null)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const stored = readStoredToken()
    if (stored) void login(stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-login once on mount
  }, [])

  function logout() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
    setToken('')
    setAuthed(false)
    setGifts(null)
    setClaims(null)
    setRsvps(null)
    setError(null)
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

  async function deleteRsvp(rsvpId: string) {
    if (!confirm('Excluir esta confirmação de presença?')) return
    try {
      await api.admin.deleteRsvp(token, rsvpId)
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
        <div className="flex gap-2">
          <button
            onClick={reload}
            className="text-xs uppercase tracking-widest border border-[var(--color-sand)] px-4 py-2"
          >
            Recarregar
          </button>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-widest border border-[var(--color-sand)] px-4 py-2"
          >
            Sair
          </button>
        </div>
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
        <TabBtn
          active={tab === 'rsvp'}
          onClick={() => setTab('rsvp')}
          label={`Presenças (${rsvps?.length ?? 0})`}
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
      {tab === 'rsvp' && rsvps && (
        <RsvpTab rsvps={rsvps} onDelete={deleteRsvp} />
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
  const claimed = gifts.filter((g) => g.status === 'claimed' && !g.multiClaim)
  const multiClaim = gifts.filter((g) => g.multiClaim)
  const available = gifts.filter((g) => g.status === 'available' && !g.multiClaim)

  const multiClaimRows = multiClaim.flatMap((g) =>
    (g.claims ?? []).map((c, i) => ({
      key: `${g.giftId}-${i}`,
      giftName: g.name,
      guestName: c.guestName,
      claimedAt: c.claimedAt,
    })),
  )

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

      {multiClaim.length > 0 && (
        <>
          <h2 className="text-xl font-serif mb-4 mt-12">
            Presentes compartilhados ({multiClaimRows.length})
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-4">
            Estes presentes podem ser dados por vários convidados. A lista abaixo
            registra quem clicou em confirmar e foi redirecionado para a loja.
          </p>
          <table className="w-full text-sm mb-12 border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--color-sand)]">
                <th className="py-2">Presente</th>
                <th>Quem confirmou</th>
                <th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {multiClaimRows.map((row) => (
                <tr key={row.key} className="border-b border-[var(--color-sand)]">
                  <td className="py-3">{row.giftName}</td>
                  <td className="font-mono">{row.guestName}</td>
                  <td className="text-[var(--color-muted)]">
                    {row.claimedAt
                      ? new Date(row.claimedAt).toLocaleString('pt-BR')
                      : '-'}
                  </td>
                </tr>
              ))}
              {multiClaimRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-[var(--color-muted)] text-center">
                    Nenhuma confirmação ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      <h2 className="text-xl font-serif mb-4">Disponíveis ({available.length + multiClaim.length})</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {[...available, ...multiClaim].map((g) => (
          <li
            key={g.giftId}
            className="text-sm py-1 border-b border-[var(--color-sand)]"
          >
            {g.name}
            {g.multiClaim
              ? g.maxClaims != null
                ? ` (${g.claims?.length ?? 0}/${g.maxClaims} unidades)`
                : ' (vários convidados)'
              : ''}
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
          label="Aguardando confirmação"
          value={`R$ ${pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
      </div>

      <p className="text-xs text-[var(--color-muted)] mb-6">
        Confira cada txid no extrato Pix do banco e marque como confirmado.
        O txid aparece na referência da transação em quase todos os bancos.
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
                Nenhuma contribuição ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

function RsvpTab({
  rsvps,
  onDelete,
}: {
  rsvps: Rsvp[]
  onDelete: (rsvpId: string) => void
}) {
  const going = rsvps.filter((r) => r.attending)
  const notGoing = rsvps.filter((r) => !r.attending)
  const totalPeople = going.reduce((sum, r) => sum + 1 + Number(r.companions ?? 0), 0)

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Confirmados" value={String(going.length)} />
        <Stat label="Total de pessoas" value={String(totalPeople)} />
        <Stat label="Não vão" value={String(notGoing.length)} />
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-[var(--color-sand)]">
            <th className="py-2">Convidado</th>
            <th>Vai?</th>
            <th>Acomp.</th>
            <th>Recado</th>
            <th>Quando</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((r) => (
            <tr key={r.rsvpId} className="border-b border-[var(--color-sand)]">
              <td className="py-3">{r.guestName}</td>
              <td>
                <span
                  className={`text-xs uppercase tracking-widest px-3 py-1 ${
                    r.attending
                      ? 'bg-green-700 text-white'
                      : 'border border-[var(--color-sand)] text-[var(--color-muted)]'
                  }`}
                >
                  {r.attending ? 'Sim' : 'Não'}
                </span>
              </td>
              <td>{r.attending ? r.companions : '-'}</td>
              <td className="max-w-xs text-[var(--color-muted)]">{r.message || '-'}</td>
              <td className="text-[var(--color-muted)] text-xs">
                {r.createdAt ? new Date(r.createdAt).toLocaleString('pt-BR') : '-'}
              </td>
              <td>
                <button
                  onClick={() => onDelete(r.rsvpId)}
                  className="text-xs text-red-700 underline"
                >
                  excluir
                </button>
              </td>
            </tr>
          ))}
          {rsvps.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-[var(--color-muted)] text-center">
                Nenhuma confirmação ainda.
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
