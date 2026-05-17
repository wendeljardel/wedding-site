import { useState } from 'react'
import { api, ApiError, type AdminGift } from '../lib/api'

export default function Admin() {
  const [token, setToken] = useState('')
  const [gifts, setGifts] = useState<AdminGift[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function loadGifts(t: string) {
    setBusy(true)
    setError(null)
    try {
      const data = await api.admin.listGifts(t)
      setGifts(data)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Token invalido.')
      } else {
        setError('Falha ao carregar. Verifique sua conexao.')
      }
      setGifts(null)
    } finally {
      setBusy(false)
    }
  }

  async function release(giftId: string) {
    if (!confirm('Liberar este presente para os outros convidados?')) return
    try {
      await api.admin.releaseGift(token, giftId)
      await loadGifts(token)
    } catch {
      setError('Falha ao liberar.')
    }
  }

  if (!gifts) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-serif mb-6 text-center">Painel admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (token.trim()) loadGifts(token.trim())
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

  const claimed = gifts.filter((g) => g.status === 'claimed')
  const available = gifts.filter((g) => g.status === 'available')

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-serif">Painel admin</h1>
        <button
          onClick={() => loadGifts(token)}
          className="text-xs uppercase tracking-widest border border-[var(--color-sand)] px-4 py-2"
        >
          Recarregar
        </button>
      </header>

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
                  onClick={() => release(g.giftId)}
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
          <li key={g.giftId} className="text-sm py-1 border-b border-[var(--color-sand)]">
            {g.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
