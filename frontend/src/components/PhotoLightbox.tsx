import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fullUrl, type GalleryPhoto } from '../lib/gallery-photos'

interface PhotoLightboxProps {
  photos: GalleryPhoto[]
  /** indice da foto aberta, ou null quando fechado */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

const SWIPE_THRESHOLD = 60

export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const open = index !== null
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (offset: number) => {
      if (index === null) return
      onNavigate((index + offset + photos.length) % photos.length)
    },
    [index, onNavigate, photos.length],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') goTo(1)
      else if (e.key === 'ArrowLeft') goTo(-1)
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, goTo])

  // mantem a foto seguinte e a anterior em cache para a navegacao nao piscar
  useEffect(() => {
    if (index === null) return
    for (const offset of [1, -1]) {
      const neighbour = photos[(index + offset + photos.length) % photos.length]
      const preload = new Image()
      preload.src = fullUrl(neighbour.slug)
    }
  }, [index, photos])

  const photo = index === null ? null : photos[index]

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[rgba(20,18,16,0.94)] overscroll-none"
          onClick={onClose}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const delta = e.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(delta < 0 ? 1 : -1)
            touchStartX.current = null
          }}
        >
          <header className="flex items-center justify-between px-5 py-4 text-white/70 shrink-0">
            <span className="text-xs tracking-[0.3em] uppercase">
              {index! + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="p-2 -mr-2 hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 pb-6">
            <NavButton side="left" onClick={() => goTo(-1)} />

            <motion.img
              key={photo.slug}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              src={fullUrl(photo.slug)}
              alt={photo.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full md:max-w-3xl object-contain rounded-sm shadow-2xl"
            />

            <NavButton side="right" onClick={() => goTo(1)} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const isLeft = side === 'left'
  return (
    <button
      type="button"
      aria-label={isLeft ? 'Foto anterior' : 'Próxima foto'}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute z-10 top-1/2 -translate-y-1/2 ${isLeft ? 'left-1 md:left-4' : 'right-1 md:right-4'}
        p-3 text-white/60 hover:text-white transition-colors`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={isLeft ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}
