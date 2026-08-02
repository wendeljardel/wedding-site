import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import WatercolorDecor, { WatercolorDivider, BotanicalSeparator } from '../components/WatercolorDecor'
import RsvpModal from '../components/RsvpModal'
import PhotoLightbox from '../components/PhotoLightbox'
import { GALLERY_PHOTOS, thumbUrl } from '../lib/gallery-photos'

const MONOGRAM_WREATH = '/assets/monogram-wreath.png'
const HERO_CHURCH    = '/assets/hero-church.png'

const WEDDING_DATE = new Date('2026-09-06T15:00:00-03:00')

export default function Home() {
  return (
    <>
      <Hero />
      <Countdown />
      <About />
      <Details />
      <Schedule />
      <OurStory />
      <Gallery />
      <Rsvp />
      <Registry />
      <Closing />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="hero-section">
      <img
        src={HERO_CHURCH}
        alt="Igreja Nossa Senhora do Carmo — Pacatuba"
        className="hero-section__art"
        width={1440}
        height={960}
        fetchPriority="high"
        decoding="async"
      />

      {/* fade suave só na base */}
      <div className="hero-section__fade-bottom" aria-hidden />

      {/* ── Overlay com nomes, posicionado no céu da imagem ── */}
      <div className="hero-section__overlay">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.1, ease: 'easeOut' }}
          className="hero-overlay-content flex flex-col items-center gap-2 px-4 w-full max-w-lg mx-auto text-center"
        >
          {/* linha decorativa topo */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="hero-name-rule"
            aria-hidden
          />

          {/* nomes em Great Vibes — mesma fonte do footer */}
          <p
            className="font-script text-[var(--color-name)] leading-none mt-4"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
          >
            Thamires<span className="name-connector">&amp;</span>Wendel
          </p>

          {/* divisor com ornamento */}
          <div className="flex items-center gap-3 mt-2" aria-hidden>
            <span className="hero-name-rule-sm" />
            <svg viewBox="0 0 20 12" className="w-5 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6 Q7 2 4 1 Q7 2 10 6 Q13 2 16 1 Q13 2 10 6z" fill="var(--color-gold)" opacity="0.6"/>
              <circle cx="10" cy="6" r="1.5" fill="var(--color-gold)" opacity="0.7"/>
            </svg>
            <span className="hero-name-rule-sm" />
          </div>

          <div className="hero-when-where mt-2">
            <p className="hero-date eyebrow text-[var(--color-date)] tracking-[0.42em]">
              06 · 09 · 2026
            </p>

            <p className="hero-meta text-[var(--color-muted)] mt-1.5 tracking-[0.22em] uppercase">
              Igreja Nossa Senhora do Carmo · Pacatuba, Ceará
            </p>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="hero-section__scroll eyebrow text-[var(--color-name)]/55 hover:text-[var(--color-ink)] transition-colors"
      >
        <span>role</span>
        <span className="hero-section__scroll-line" aria-hidden />
      </motion.a>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN
═══════════════════════════════════════════════════════════ */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000)  / 60_000),
      seconds: Math.floor((diff % 60_000)      / 1_000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)
  const units = [
    { value: days,    label: days === 1 ? 'dia' : 'dias' },
    { value: hours,   label: hours === 1 ? 'hora' : 'horas' },
    { value: minutes, label: minutes === 1 ? 'minuto' : 'minutos' },
    { value: seconds, label: seconds === 1 ? 'segundo' : 'segundos' },
  ]

  return (
    <section className="section-alt section-watercolor py-14 md:py-18 px-6">
      <WatercolorDecor variant="gold" position="top-right" size="sm" className="opacity-40" />
      <Fade>
        <p className="eyebrow text-center mb-6">
          <span className="divider-rule" />
          faltam
          <span className="divider-rule" />
        </p>
        <div className="flex items-end justify-center flex-wrap gap-x-2 gap-y-5 sm:gap-x-4 md:gap-x-8">
          {units.map(({ value, label }, i) => (
            <div key={label} className="contents">
              <div className="countdown-unit">
                <span className="countdown-number">{String(value).padStart(2, '0')}</span>
                <span className="countdown-label">{label}</span>
              </div>
              {i < units.length - 1 && (
                <span className="countdown-dot" aria-hidden>·</span>
              )}
            </div>
          ))}
        </div>
      </Fade>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════ */
function About() {
  return (
    <Section id="about" eyebrow="Nosso convite" variant="sage">
      <Fade>
        <div className="invite-card max-w-3xl mx-auto px-8 py-12 md:px-16 md:py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-display leading-snug">
            <span className="italic-display">Thamires</span>
            <span className="name-connector">e</span>
            <span className="italic-display">Wendel</span>
            {' '}convidam você para celebrar o dia em que as duas vidas se tornam uma só.
          </h2>
          <WatercolorDivider />
          <p className="max-w-xl mx-auto text-[var(--color-muted)] text-base leading-relaxed">
            A cerimônia acontece às 15h, na Igreja Nossa Senhora do Carmo, em
            Pacatuba. Pedimos que cheguem pontualmente para acompanhar tudo de
            perto. Depois seguimos juntos para a Villa Cajá, onde a festa
            continua. Sua presença é o que vai tornar esse dia inesquecível.
          </p>
          <div className="palette-bar mt-8">
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>
      </Fade>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   DETAILS
═══════════════════════════════════════════════════════════ */
function Details() {
  return (
    <section id="details" className="section-alt section-watercolor py-24 md:py-32 px-6">
      <WatercolorDecor variant="gold"    position="top-left"     size="lg" />
      <WatercolorDecor variant="magenta" position="bottom-right" size="md" />

      <div className="max-w-5xl mx-auto">
        <Fade>
          <header className="text-center mb-16">
            <p className="eyebrow">
              <span className="divider-rule" />Detalhes<span className="divider-rule" />
            </p>
            <h2 className="mt-5 text-3xl md:text-4xl font-display">
              Onde e{' '}
              <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">quando</span>
            </h2>
          </header>
        </Fade>

        <div className="grid gap-8 md:grid-cols-3">
          <DetailBlock
            eyebrow="Quando"
            title="06 de Setembro de 2026"
            lines={['Domingo', 'Cerimônia: 15h', 'Cheguem pontualmente']}
            icon={<IconClock />}
          />
          <DetailBlock
            eyebrow="Cerimônia"
            title="Igreja N. S. do Carmo"
            lines={['Pacatuba, Ceará']}
            icon={<IconChurch />}
          />
          <DetailBlock
            eyebrow="Festa"
            title="Villa Cajá"
            lines={['Logo após a cerimônia']}
            icon={<IconToast />}
          />
        </div>
      </div>
    </section>
  )
}

function DetailBlock({
  eyebrow, title, lines, icon,
}: {
  eyebrow: string
  title: string
  lines: string[]
  icon?: ReactNode
}) {
  return (
    <Fade>
      <div className="invite-card rounded-sm px-6 py-10 text-center h-full flex flex-col items-center">
        {icon && (
          <div className="mb-4 text-[var(--color-gold)] opacity-80">{icon}</div>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-3 text-xl md:text-2xl font-display leading-snug">{title}</h3>
        <div className="mt-3 space-y-0.5 text-[var(--color-muted)] text-sm">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </Fade>
  )
}

/* Ícones SVG inline simples */
function IconClock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3"/>
    </svg>
  )
}
function IconChurch() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M10 4h4"/>
      <path d="M5 21V10l7-5 7 5v11H5z"/>
      <rect x="9" y="14" width="6" height="7" rx="0.5"/>
    </svg>
  )
}
function IconToast() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v5.5c0 2.2 1.3 4 5 4" />
      <path d="M17 3v5.5c0 2.2-1.3 4-5 4" />
      <path d="M12 12.5v2" />
      <path d="M8.5 20h7" />
      <path d="M12 14.5v5.5" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCHEDULE (Programação do dia)
═══════════════════════════════════════════════════════════ */
const SCHEDULE_ITEMS = [
  { time: '15h00', label: 'Cerimônia', detail: 'Igreja Nossa Senhora do Carmo — cheguem pontualmente' },
  { time: '17h30', label: 'Coquetel & fotos', detail: 'Jardim da Villa Cajá' },
  { time: '19h00', label: 'Jantar', detail: 'Villa Cajá' },
]

function Schedule() {
  return (
    <section className="py-24 md:py-32 px-6 section-watercolor">
      <WatercolorDecor variant="terracotta" position="bottom-left" size="md" className="opacity-40" />
      <div className="max-w-2xl mx-auto">
        <Fade>
          <header className="text-center mb-14">
            <p className="eyebrow">
              <span className="divider-rule" />Programação<span className="divider-rule" />
            </p>
            <h2 className="mt-5 text-3xl md:text-4xl font-display">
              O grande{' '}
              <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">dia</span>
            </h2>
          </header>
        </Fade>

        <div className="relative">
          {/* linha vertical */}
          <div className="timeline-line hidden md:block" aria-hidden />

          <div className="space-y-0">
            {SCHEDULE_ITEMS.map((item, i) => (
              <Fade key={item.time} delay={i * 0.08}>
                <div className={`flex gap-6 md:gap-0 items-start md:items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* conteúdo */}
                  <div className={`flex-1 pb-10 md:pb-12 text-center ${
                    i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                  }`}>
                    <p className="eyebrow text-[var(--color-gold)]">{item.time}</p>
                    <h3 className="mt-1 text-xl md:text-2xl font-display">{item.label}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5">{item.detail}</p>
                  </div>
                  {/* ponto na linha */}
                  <div className="timeline-dot mt-2 md:mt-0 hidden md:block" aria-hidden />
                  {/* espaço do outro lado no desktop */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
      <BotanicalSeparator className="max-w-xl mx-auto" />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   OUR STORY (Nossa história)
═══════════════════════════════════════════════════════════ */
function OurStory() {
  return (
    <section id="our-story" className="section-watercolor grid md:grid-cols-2 items-center max-w-6xl mx-auto">
      <div className="aspect-[4/5] md:aspect-auto md:h-[540px] overflow-hidden photo-frame">
        <motion.img
          initial={{ scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          src="/photos/gallery-couple.png"
          alt="Thamires e Wendel"
          className="w-full h-full object-cover"
        />
      </div>

      <Fade>
        <div className="relative px-6 md:px-14 py-12 md:py-16 max-w-md mx-auto md:mx-0 text-center md:text-left">
          <WatercolorDecor
            variant="magenta"
            position="top-right"
            size="sm"
            className="opacity-50"
          />
          <p className="eyebrow">Nossa história</p>
          <h3 className="mt-3 text-4xl md:text-5xl font-display italic-display leading-tight">
            Dos grupos da paróquia ao altar
          </h3>
          <WatercolorDivider />
          <div className="space-y-4 text-[var(--color-muted)] leading-relaxed">
            <p>
              A gente se conheceu nos grupos da Paróquia Nossa Senhora do
              Perpétuo Socorro, sem imaginar o que aquele encontro ainda ia se
              tornar. O reencontro veio no Instituto Federal do Ceará. Foi entre
              lanches e conversas sem pressa na escada que a amizade começou.
            </p>
            <p>
              Dali em diante, fomos nos descobrindo aos poucos, explorando
              Fortaleza, provando cada comida nova que aparecia no caminho e
              sempre inventando um motivo para ficar mais um pouco. Em 2016, o
              que já era claro para nós dois ganhou nome e oficializamos o
              namoro.
            </p>
            <p>
              Em 2024 nasceu o nosso maior presente, nosso primeiro filho. Em
              2025 ficou pronta a casa que construímos do zero, depois de muitos
              desafios e planos refeitos pelo caminho.
            </p>
            <p>
              Agora, em 2026, chegou a hora de receber o Sacramento do
              Matrimônio e celebrar esse marco diante de Deus e de quem a gente
              ama. É por isso que queremos você com a gente nesse dia.
            </p>
          </div>
        </div>
      </Fade>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════ */
function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="gallery" className="section-alt section-watercolor py-24 md:py-32 px-6">
      <WatercolorDecor variant="mixed" position="center" size="lg" className="opacity-35" />

      <div className="max-w-5xl mx-auto">
        <Fade>
          <header className="text-center mb-12">
            <p className="eyebrow">
              <span className="divider-rule" />Memórias<span className="divider-rule" />
            </p>
            <h2 className="mt-5 text-3xl md:text-4xl font-display">
              Nossa história em{' '}
              <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">fotos</span>
            </h2>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Toque em uma foto para ampliar
            </p>
          </header>
        </Fade>

        {/* mural em colunas: cada foto entra na altura natural dela, sem recorte */}
        <div className="columns-2 md:columns-3 gap-3 md:gap-4">
          {GALLERY_PHOTOS.map((photo, i) => (
            <button
              key={photo.slug}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Ampliar foto: ${photo.alt}`}
              className="group block w-full mb-3 md:mb-4 break-inside-avoid overflow-hidden
                photo-frame bg-[var(--color-sand)] cursor-zoom-in
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-[var(--color-magenta)]"
            >
              <img
                src={thumbUrl(photo.slug)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-auto align-middle group-hover:scale-[1.04]
                  transition-transform duration-700 ease-out"
              />
            </button>
          ))}
        </div>
      </div>

      <PhotoLightbox
        photos={GALLERY_PHOTOS}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   RSVP (Confirmação de presença)
═══════════════════════════════════════════════════════════ */
function Rsvp() {
  const [open, setOpen] = useState(false)
  return (
    <section id="rsvp" className="section-alt section-watercolor py-24 md:py-32 px-6 text-center">
      <WatercolorDecor variant="magenta" position="top-left" size="md" className="opacity-45" />
      <WatercolorDecor variant="sage" position="bottom-right" size="sm" className="opacity-40" />

      <Fade>
        <p className="eyebrow">
          <span className="divider-rule" />Presença<span className="divider-rule" />
        </p>
        <h2 className="mt-5 text-3xl md:text-4xl font-display">
          Confirme sua{' '}
          <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">presença</span>
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-[var(--color-muted)] leading-relaxed">
          Queremos preparar cada detalhe pensando em quem vai estar por perto.
          Conte se você poderá celebrar esse dia com a gente. Leva menos de um
          minuto.
        </p>
      </Fade>
      <Fade delay={0.12}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-primary mt-10 inline-block"
        >
          Confirmar presença
        </button>
      </Fade>

      <RsvpModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   REGISTRY
═══════════════════════════════════════════════════════════ */
function Registry() {
  return (
    <Section eyebrow="Presentes" variant="gold">
      <Fade>
        <h2 className="text-3xl md:text-4xl font-display">
          Lista de{' '}
          <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">presentes</span>
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-[var(--color-muted)] leading-relaxed">
          Sua presença já é o nosso maior presente. Se você quiser nos
          presentear, reunimos algumas ideias para a nossa primeira casa.
        </p>
      </Fade>
      <Fade delay={0.12}>
        <Link to="/presentes" className="btn-primary mt-10 inline-block">
          Ver a lista
        </Link>
      </Fade>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   CLOSING
═══════════════════════════════════════════════════════════ */
function Closing() {
  return (
    <section className="section-watercolor py-8 md:py-12 px-6 text-center">
      <WatercolorDecor variant="sage"  position="top-left"     size="md" className="opacity-55" />
      <WatercolorDecor variant="gold"  position="bottom-right" size="sm" className="opacity-50" />
      <WatercolorDecor variant="mixed" position="center"       size="md" className="opacity-15" />

      <Fade>
        <img
          src={MONOGRAM_WREATH}
          alt=""
          className="mx-auto w-28 md:w-36 monogram-wreath"
        />
        <h2 className="mt-4 text-xl md:text-3xl font-display max-w-xl mx-auto leading-snug">
          Vamos te esperar nesse{' '}
          <span className="font-script text-[var(--color-magenta)] text-2xl md:text-4xl">dia especial</span>
        </h2>
        <p className="mt-3 eyebrow text-[var(--color-date)] tracking-[0.42em]">
          06 · 09 · 2026
        </p>
        <BotanicalSeparator className="max-w-xs mx-auto mt-0 mb-0" />
        <p className="font-script text-[var(--color-name)] text-xl mt-0 opacity-75">
          com amor,{' '}
          <span className="italic">Thamires &amp; Wendel</span>
        </p>
      </Fade>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════════════════ */
function Section({
  id,
  eyebrow,
  children,
  variant = 'mixed',
}: {
  id?: string
  eyebrow?: string
  children: ReactNode
  variant?: 'sage' | 'gold' | 'magenta' | 'terracotta' | 'mixed'
}) {
  return (
    <section id={id} className="section-watercolor py-24 md:py-32 px-6 text-center">
      <WatercolorDecor variant={variant} position="top-right" size="md" className="opacity-45" />
      {eyebrow && (
        <Fade>
          <p className="eyebrow">
            <span className="divider-rule" />{eyebrow}<span className="divider-rule" />
          </p>
          <div className="mt-8" />
        </Fade>
      )}
      {children}
    </section>
  )
}

function Fade({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
