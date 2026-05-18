import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api, type Gift } from '../lib/api'
import { MOCK_GIFTS } from '../lib/mock-gifts'
import ClaimGiftModal from '../components/ClaimGiftModal'

export default function Gifts() {
  const [gifts, setGifts] = useState<Gift[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [selected, setSelected] = useState<Gift | null>(null)

  useEffect(() => {
    api
      .listGifts()
      .then(setGifts)
      .catch(() => {
        setLoadError(true)
        setGifts(MOCK_GIFTS)
      })
  }, [])

  function handleClaimed(updated: Gift) {
    setGifts((prev) =>
      prev ? prev.map((g) => (g.giftId === updated.giftId ? updated : g)) : prev,
    )
  }

  return (
    <section className="pt-32 pb-32 md:pt-40 md:pb-40 px-8">
      <header className="text-center max-w-2xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">
            <span className="divider-rule" />
            A lista
            <span className="divider-rule" />
          </p>
          <h1 className="mt-8 text-5xl md:text-6xl font-display">Lista de presentes</h1>
          <p className="mt-8 text-[var(--color-muted)] leading-relaxed">
            Cada presente te leva direto para a loja onde a gente escolheu.
            Ao confirmar sua reserva o item fica indisponivel para os demais convidados.
          </p>
        </motion.div>
        {loadError && (
          <p className="mt-8 text-xs text-amber-700 bg-amber-50 border border-amber-200 inline-block px-4 py-2">
            modo demo: a API ainda nao esta no ar, mostrando dados de exemplo
          </p>
        )}
      </header>

      {!gifts && (
        <p className="text-center text-[var(--color-muted)]">Carregando...</p>
      )}

      {gifts && (
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {gifts.map((gift, i) => (
            <motion.li
              key={gift.giftId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: (i % 6) * 0.05 }}
            >
              <GiftCard gift={gift} onPick={() => setSelected(gift)} />
            </motion.li>
          ))}
        </ul>
      )}

      <ClaimGiftModal
        gift={selected}
        onClose={() => setSelected(null)}
        onClaimed={handleClaimed}
      />
    </section>
  )
}

function GiftCard({ gift, onPick }: { gift: Gift; onPick: () => void }) {
  const isClaimed = gift.status === 'claimed'
  return (
    <div className="flex flex-col h-full">
      <a
        href={gift.storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Ver "${gift.name}" na loja`}
        className="group relative aspect-square overflow-hidden bg-white border border-[var(--color-sand)] block p-6"
      >
        <img
          src={gift.imageUrl}
          alt={gift.name}
          loading="lazy"
          className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 ${
            isClaimed ? 'grayscale opacity-60' : ''
          }`}
        />
        {isClaimed && (
          <span className="absolute top-3 right-3 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] uppercase tracking-[0.25em] px-3 py-1.5">
            Reservado
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-[var(--color-paper)]/95 text-[var(--color-ink)] text-[10px] uppercase tracking-[0.2em] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Ver na loja
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H8M17 7V16" />
          </svg>
        </span>
      </a>
      <div className="pt-6 flex-1 flex flex-col">
        <h3 className="font-display text-2xl">
          <a
            href={gift.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-clay)] transition-colors"
          >
            {gift.name}
          </a>
        </h3>
        <p className="text-sm text-[var(--color-muted)] mt-2 flex-1">
          {gift.description}
        </p>
        <p className="mt-4 text-sm">
          R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <button
          disabled={isClaimed}
          onClick={onPick}
          className="mt-6 w-full py-4 border border-[var(--color-ink)] uppercase tracking-[0.25em] text-xs hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--color-ink)]"
        >
          {isClaimed ? 'Indisponivel' : 'Vou dar este presente'}
        </button>
      </div>
    </div>
  )
}
