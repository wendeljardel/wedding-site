import { useState, useEffect, useRef } from 'react'
import { api, ApiError, type Gift } from '../lib/api'
import Modal from './Modal'

interface Props {
  gift: Gift | null
  onClose: () => void
  onClaimed: (gift: Gift) => void
}

export default function ClaimGiftModal({ gift, onClose, onClaimed }: Props) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gift) {
      setName('')
      setError(null)
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true })
      })
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
    <Modal open={!!gift} onClose={onClose}>
      {gift && (
        <>
          <h2 className="text-2xl font-display mb-2">{gift.name}</h2>
          <p className="text-sm text-[var(--color-muted)] mb-6">{gift.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Seu nome
              </label>
              <input
                ref={inputRef}
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome como aparece no convite"
                className="input-watercolor"
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
                className="flex-1 px-4 py-3 btn-secondary text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 btn-primary text-center disabled:opacity-50"
              >
                {submitting ? 'Reservando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
