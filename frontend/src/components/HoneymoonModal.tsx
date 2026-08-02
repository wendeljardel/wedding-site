import { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { api } from '../lib/api'
import type { HoneymoonCota } from '../lib/honeymoon'
import { generateBRCode, generateTxid, pixIsConfigured } from '../lib/pix'
import Modal from './Modal'

interface Props {
  cota: HoneymoonCota | null
  onClose: () => void
}

type Step = 'form' | 'paying' | 'success'

export default function HoneymoonModal({ cota, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [txid, setTxid] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cota) {
      setStep('form')
      setName('')
      setCustomAmount('')
      setTxid('')
      setError(null)
      setBusy(false)
      setCopied(false)
      requestAnimationFrame(() => {
        nameInputRef.current?.focus({ preventScroll: true })
      })
    }
  }, [cota])

  const effectiveAmount = useMemo(() => {
    if (!cota) return 0
    if (cota.amount !== null) return cota.amount
    const parsed = parseFloat(customAmount.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : 0
  }, [cota, customAmount])

  const brCode = useMemo(() => {
    if (step !== 'paying' || !cota || !txid || effectiveAmount <= 0) return ''
    try {
      return generateBRCode(effectiveAmount, txid)
    } catch (err) {
      console.error(err)
      return ''
    }
  }, [step, cota, txid, effectiveAmount])

  function handleGeneratePix(e: React.FormEvent) {
    e.preventDefault()
    if (!cota) return
    if (!name.trim()) return
    if (cota.amount === null && effectiveAmount < 10) {
      setError('Valor mínimo de R$ 10,00.')
      return
    }
    if (!pixIsConfigured()) {
      setError(
        'A chave Pix ainda não foi configurada. Avise os noivos para usarem outra forma.',
      )
      return
    }
    setError(null)
    setTxid(generateTxid())
    setStep('paying')
  }

  async function handleAlreadyPaid() {
    if (!cota) return
    setBusy(true)
    setError(null)
    try {
      await api.claimHoneymoon({
        cotaId: cota.id,
        cotaLabel: cota.title,
        amount: effectiveAmount,
        guestName: name.trim(),
        txid,
      })
      setStep('success')
    } catch (err) {
      console.error(err)
      setError(
        'Não consegui registrar o aviso, mas seu Pix pode ter sido recebido. ' +
          'Avise os noivos pessoalmente para conferirem.',
      )
    } finally {
      setBusy(false)
    }
  }

  async function copyBRCode() {
    try {
      await navigator.clipboard.writeText(brCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setError('Não consegui copiar. Selecione o texto manualmente.')
    }
  }

  return (
    <Modal
      open={!!cota}
      onClose={onClose}
      panelClassName="invite-card rounded-sm max-w-md w-full p-8 md:p-10 max-h-[90vh] overflow-y-auto"
    >
      {cota && step === 'form' && (
        <FormStep
          cota={cota}
          name={name}
          setName={setName}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
          effectiveAmount={effectiveAmount}
          error={error}
          nameInputRef={nameInputRef}
          onCancel={onClose}
          onSubmit={handleGeneratePix}
        />
      )}

      {cota && step === 'paying' && (
        <PayingStep
          cota={cota}
          amount={effectiveAmount}
          brCode={brCode}
          copied={copied}
          error={error}
          busy={busy}
          onCopy={copyBRCode}
          onAlreadyPaid={handleAlreadyPaid}
          onBack={() => setStep('form')}
        />
      )}

      {cota && step === 'success' && (
        <SuccessStep
          cota={cota}
          amount={effectiveAmount}
          name={name}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

function FormStep({
  cota,
  name,
  setName,
  customAmount,
  setCustomAmount,
  effectiveAmount,
  error,
  nameInputRef,
  onCancel,
  onSubmit,
}: {
  cota: HoneymoonCota
  name: string
  setName: (v: string) => void
  customAmount: string
  setCustomAmount: (v: string) => void
  effectiveAmount: number
  error: string | null
  nameInputRef: React.RefObject<HTMLInputElement>
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <>
      <div className="text-center mb-6">
        <span className="text-4xl">{cota.emoji}</span>
        <h2 className="text-2xl font-display mt-3">{cota.title}</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">{cota.subtitle}</p>
        {cota.amount !== null && (
          <p className="mt-4 text-3xl font-display">
            R$ {cota.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
            className="input-watercolor"
          />
        </div>

        {cota.amount === null && (
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Valor (R$)
            </label>
            <input
              required
              type="text"
              inputMode="decimal"
              value={customAmount}
              onChange={(e) =>
                setCustomAmount(e.target.value.replace(/[^\d.,]/g, ''))
              }
              placeholder="Ex: 50,00"
              className="input-watercolor"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">
            {error}
          </p>
        )}

        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          Na próxima tela vamos mostrar o QR Code do Pix. Após pagar, basta
          clicar em &ldquo;Já paguei&rdquo; para nos avisar.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 btn-secondary text-center disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cota.amount === null && effectiveAmount <= 0}
            className="flex-1 px-4 py-3 btn-primary text-center disabled:opacity-50"
          >
            Gerar Pix
          </button>
        </div>
      </form>
    </>
  )
}

function PayingStep({
  cota,
  amount,
  brCode,
  copied,
  error,
  busy,
  onCopy,
  onAlreadyPaid,
  onBack,
}: {
  cota: HoneymoonCota
  amount: number
  brCode: string
  copied: boolean
  error: string | null
  busy: boolean
  onCopy: () => void
  onAlreadyPaid: () => void
  onBack: () => void
}) {
  return (
    <>
      <div className="text-center mb-6">
        <p className="eyebrow">{cota.title}</p>
        <p className="mt-3 text-3xl font-display">
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {brCode ? (
        <>
          <div className="bg-white p-4 mx-auto w-fit border border-[var(--color-sand)]">
            <QRCodeSVG value={brCode} size={200} level="M" />
          </div>

          <div className="mt-6">
            <label className="block text-xs uppercase tracking-widest mb-2">
              Pix copia-e-cola
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={brCode}
                onFocus={(e) => e.target.select()}
                className="w-full border border-[var(--color-sand)] bg-white px-3 py-2 text-xs font-mono break-all resize-none h-24"
              />
              <button
                type="button"
                onClick={onCopy}
                className="absolute top-2 right-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] uppercase tracking-widest px-3 py-1.5"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--color-muted)] mt-4 leading-relaxed">
            Abra o app do seu banco, escolha pagar com Pix Copia-e-Cola, cole
            o código (ou aponte a câmera para o QR) e confirme. Depois volte
            aqui e clique no botão abaixo.
          </p>
        </>
      ) : (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3">
          Não consegui gerar o Pix. Volte e tente novamente.
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="flex-1 px-4 py-3 btn-secondary text-center disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onAlreadyPaid}
          disabled={busy || !brCode}
          className="flex-1 px-4 py-3 btn-primary text-center disabled:opacity-50"
        >
          {busy ? 'Registrando...' : 'Já paguei'}
        </button>
      </div>
    </>
  )
}

function SuccessStep({
  cota,
  amount,
  name,
  onClose,
}: {
  cota: HoneymoonCota
  amount: number
  name: string
  onClose: () => void
}) {
  return (
    <div className="text-center py-4">
      <span className="text-5xl">{cota.emoji}</span>
      <h2 className="text-2xl font-display mt-4">Muito obrigado, {name.split(' ')[0]}!</h2>
      <p className="text-sm text-[var(--color-muted)] mt-4 leading-relaxed">
        Recebemos seu aviso de pagamento de
        {' '}
        <strong>
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </strong>
        {' '}
        para a cota &ldquo;{cota.title}&rdquo;. Vamos conferir o extrato, e seu
        carinho já faz parte da nossa viagem.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 px-10 py-3 btn-primary"
      >
        Fechar
      </button>
    </div>
  )
}
