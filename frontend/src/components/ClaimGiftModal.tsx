import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { api, ApiError, type Gift } from '../lib/api'

interface Props {
  gift: Gift | null
  onClose: () => void
  onClaimed: (gift: Gift) => void
}

export default function ClaimGiftModal({ gift, onClose, onClaimed }: Props) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (gift) {
      setName('')
      setError(null)
    }
  }, [gift])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gift || !name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const { storeUrl } = await api.claimGift(gift.giftId, name.trim())
      onClaimed({ ...gift, status: 'claimed' })
      window.open(storeUrl, '_blank', 'noopener,noreferrer')
      onClose()
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Ops! Alguem acabou de reservar este presente. Atualize a pagina e escolha outro.')
      } else {
        setError('Nao consegui registrar sua escolha. Tente novamente em instantes.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {gift && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--color-cream)] max-w-md w-full p-8 shadow-xl"
          >
            <h2 className="text-2xl font-serif mb-2">{gift.name}</h2>
            <p className="text-sm text-[var(--color-muted)] mb-6">{gift.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">
                  Seu nome
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome como aparece no convite"
                  className="w-full border border-[var(--color-sand)] bg-white px-4 py-3 outline-none focus:border-[var(--color-clay)]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">
                  {error}
                </p>
              )}

              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Ao confirmar, voce sera redirecionado para a loja para finalizar a compra.
                O presente fica reservado em seu nome.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-[var(--color-sand)] uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {submitting ? 'Reservando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
