import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import Modal from './Modal'

interface Props {
  open: boolean
  onClose: () => void
  /** Modo "portão": exige resposta antes de liberar o site. */
  blocking?: boolean
  /** Chamado apos o envio bem-sucedido (ex: persistir que ja respondeu). */
  onSuccess?: () => void
}

type Step = 'form' | 'success'

const MAX_COMPANIONS = 10

export default function RsvpModal({ open, onClose, blocking = false, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [companions, setCompanions] = useState(0)
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setStep('form')
      setName('')
      setAttending(true)
      setCompanions(0)
      setMessage('')
      setHoneypot('')
      setError(null)
      setBusy(false)
      requestAnimationFrame(() => {
        nameInputRef.current?.focus({ preventScroll: true })
      })
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    try {
      await api.sendRsvp({
        guestName: name.trim(),
        attending,
        companions: attending ? companions : 0,
        message: message.trim(),
        website: honeypot,
      })
      setStep('success')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      setError(
        'Não consegui registrar sua confirmação agora. Tente novamente em ' +
          'instantes ou avise os noivos diretamente.',
      )
    } finally {
      setBusy(false)
    }
  }

  // No modo bloqueante, so permite fechar depois de responder.
  function handleClose() {
    if (blocking && step !== 'success') return
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      backdropClassName={blocking ? 'bg-[var(--color-paper)]/98 backdrop-blur-sm' : 'bg-black/40'}
      panelClassName="invite-card rounded-sm max-w-md w-full p-8 md:p-10 max-h-[90vh] overflow-y-auto"
    >
      {step === 'form' && (
        <>
          <div className="text-center mb-6">
            <p className="eyebrow">
              <span className="divider-rule" />Presença<span className="divider-rule" />
            </p>
            <h2 className="text-2xl font-display mt-3">Confirme sua presença</h2>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              {blocking
                ? 'Antes de ver o convite, conte para os noivos se você poderá comparecer.'
                : 'Nos ajude a organizar tudo com carinho respondendo abaixo.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* honeypot invisível: bots preenchem, humanos não veem */}
            <div className="hidden" aria-hidden>
              <label>
                Não preencha este campo
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Seu nome
              </label>
              <input
                ref={nameInputRef}
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como aparece no convite"
                maxLength={100}
                className="input-watercolor"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Você vai poder ir?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`px-4 py-3 text-sm border transition-colors ${
                    attending
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                      : 'border-[var(--color-sand)] hover:border-[var(--color-clay)]'
                  }`}
                >
                  Sim, eu vou!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`px-4 py-3 text-sm border transition-colors ${
                    !attending
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                      : 'border-[var(--color-sand)] hover:border-[var(--color-clay)]'
                  }`}
                >
                  Não poderei
                </button>
              </div>
            </div>

            {attending && (
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">
                  Acompanhantes convidados
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCompanions((c) => Math.max(0, c - 1))}
                    className="w-10 h-10 border border-[var(--color-sand)] text-lg leading-none hover:border-[var(--color-clay)]"
                    aria-label="Menos um acompanhante"
                  >
                    −
                  </button>
                  <span className="text-xl font-display w-6 text-center">
                    {companions}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCompanions((c) => Math.min(MAX_COMPANIONS, c + 1))
                    }
                    className="w-10 h-10 border border-[var(--color-sand)] text-lg leading-none hover:border-[var(--color-clay)]"
                    aria-label="Mais um acompanhante"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Recado para os noivos (opcional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem carinhosa"
                maxLength={500}
                rows={3}
                className="input-watercolor resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              {!blocking && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="flex-1 px-4 py-3 btn-secondary text-center disabled:opacity-50"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={busy || !name.trim()}
                className="flex-1 px-4 py-3 btn-primary text-center disabled:opacity-50"
              >
                {busy ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </>
      )}

      {step === 'success' && (
        <div className="text-center py-4">
          <span className="text-5xl">{attending ? '\u{1F495}' : '\u{1F49C}'}</span>
          <h2 className="text-2xl font-display mt-4">
            Obrigado, {name.split(' ')[0]}!
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-4 leading-relaxed">
            {attending
              ? 'Que alegria! Sua presença está confirmada. Mal podemos esperar para celebrar com você.'
              : 'Sentiremos sua falta, mas obrigado por avisar. Você estará no nosso coração nesse dia.'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 px-10 py-3 btn-primary"
          >
            Fechar
          </button>
        </div>
      )}
    </Modal>
  )
}
