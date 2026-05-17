import { useEffect, useState } from 'react'
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
        // API ainda nao deployada: cai pro mock para o dev poder olhar a UI
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
    <section className="max-w-5xl mx-auto px-6 py-20">
      <header className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-5xl font-serif mb-6">Lista de presentes</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Cada presente abaixo te leva direto para a loja onde a gente escolheu.
          Ao confirmar sua reserva o item fica indisponivel para os demais convidados.
        </p>
        {loadError && (
          <p className="mt-6 text-xs text-amber-700 bg-amber-50 border border-amber-200 inline-block px-4 py-2">
            (modo demo: a API ainda nao esta no ar, mostrando dados de exemplo)
          </p>
        )}
      </header>

      {!gifts && <p className="text-center text-[var(--color-muted)]">Carregando...</p>}

      {gifts && (
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <GiftCard key={gift.giftId} gift={gift} onPick={() => setSelected(gift)} />
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
    <li className="flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-sand)]">
        <img
          src={gift.imageUrl}
          alt={gift.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
            isClaimed ? 'grayscale opacity-60' : ''
          }`}
        />
        {isClaimed && (
          <span className="absolute top-3 right-3 bg-[var(--color-ink)] text-[var(--color-cream)] text-[10px] uppercase tracking-widest px-2 py-1">
            Reservado
          </span>
        )}
      </div>
      <div className="pt-4 flex-1 flex flex-col">
        <h3 className="font-serif text-xl">{gift.name}</h3>
        <p className="text-sm text-[var(--color-muted)] mt-1 flex-1">{gift.description}</p>
        <p className="mt-3 text-sm">
          R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <button
          disabled={isClaimed}
          onClick={onPick}
          className="mt-4 w-full py-3 border border-[var(--color-ink)] uppercase tracking-widest text-xs hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--color-ink)]"
        >
          {isClaimed ? 'Indisponivel' : 'Vou dar este presente'}
        </button>
      </div>
    </li>
  )
}
