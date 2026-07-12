import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import WatercolorDecor, { WatercolorDivider, BotanicalSeparator } from '../components/WatercolorDecor'

const MONOGRAM_WREATH = '/assets/monogram-wreath.png'
const HERO_CHURCH    = '/assets/hero-church.png'

const WEDDING_DATE = new Date('2026-09-06T16:00:00-03:00')

export default function Home() {
  return (
    <>
      <Hero />
      <Countdown />
      <About />
      <Details />
      <Schedule />
      <Bride />
      <Groom />
      <Gallery />
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
    <Section id="about" eyebrow="Um encontro feito no céu" variant="sage">
      <Fade>
        <div className="invite-card max-w-3xl mx-auto px-8 py-12 md:px-16 md:py-16 text-center">
          <h2 className="text-3xl md:text-5xl font-display leading-snug">
            <span className="italic-display">Thamires</span>
            <span className="name-connector">e</span>
            <span className="italic-display">Wendel</span>
            {' '}convidam você com alegria para celebrar a união de nossas vidas.
          </h2>
          <WatercolorDivider />
          <p className="max-w-xl mx-auto text-[var(--color-muted)] text-base leading-relaxed">
            A cerimônia será às 16h na Igreja Nossa Senhora do Carmo, em Pacatuba.
            A recepção segue na Villa Cajá, no pé de serra, em clima de campo
            serrano. Sua presença é o que tornará esse dia inesquecível.
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
            lines={['Domingo', 'Cerimônia: 16h']}
            icon={<IconClock />}
          />
          <DetailBlock
            eyebrow="Cerimônia"
            title="Igreja N. S. do Carmo"
            lines={['Pacatuba, Ceará']}
            icon={<IconChurch />}
          />
          <DetailBlock
            eyebrow="Recepção"
            title="Villa Cajá"
            lines={['No pé de serra', 'Ambiente de campo serrano']}
            icon={<IconCelebration />}
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
function IconCelebration() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l4-4m0 0L18 6l-4 4M7 17l11-11M9.5 7.5l7 7"/>
      <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none" opacity="0.6"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCHEDULE (Programação do dia)
═══════════════════════════════════════════════════════════ */
const SCHEDULE_ITEMS = [
  { time: '15h30', label: 'Recepção dos convidados', detail: 'Chegada à Igreja N. S. do Carmo' },
  { time: '16h00', label: 'Cerimônia', detail: 'Pacatuba, Ceará' },
  { time: '17h30', label: 'Coquetel & fotos', detail: 'Jardim da vila' },
  { time: '19h00', label: 'Jantar & celebração', detail: 'Villa Cajá — campo serrano' },
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
              O{' '}
              <span className="font-script text-[var(--color-magenta)] text-4xl md:text-5xl">dia</span>
              {' '}a dia
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
   BRIDE & GROOM
═══════════════════════════════════════════════════════════ */
function Bride() {
  return (
    <Person
      eyebrow="A noiva"
      name="Thamires"
      bio="Conte aqui um pouco da história dela: onde cresceu, o que faz e o que mais ama no mundo."
      image="/photos/gallery-thamires.png"
      align="left"
      decorVariant="magenta"
    />
  )
}

function Groom() {
  return (
    <Person
      eyebrow="O noivo"
      name="Wendel"
      bio="Conte aqui um pouco da história dele: trajetória, paixões e o que torna esse encontro tão especial."
      image="/photos/gallery-rock.jpg"
      align="right"
      decorVariant="terracotta"
    />
  )
}

function Person({
  eyebrow, name, bio, image, align, decorVariant,
}: {
  eyebrow: string
  name: string
  bio: string
  image: string
  align: 'left' | 'right'
  decorVariant: 'magenta' | 'terracotta' | 'sage'
}) {
  const textAlign = align === 'left' ? 'text-center md:text-left' : 'text-center md:text-right'

  const text = (
    <Fade>
      <div className={`relative px-6 md:px-14 py-12 md:py-16 max-w-md mx-auto md:mx-0 ${textAlign}`}>
        <WatercolorDecor
          variant={decorVariant}
          position={align === 'left' ? 'top-right' : 'top-left'}
          size="sm"
          className="opacity-50"
        />
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-3 text-5xl md:text-6xl font-display italic-display leading-none">
          {name}
        </h3>
        <WatercolorDivider />
        <p className="text-[var(--color-muted)] leading-relaxed">{bio}</p>
      </div>
    </Fade>
  )

  const img = (
    <div className="aspect-[4/5] md:aspect-auto md:h-[540px] overflow-hidden photo-frame">
      <motion.img
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        src={image}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  )

  return (
    <section className="section-watercolor grid md:grid-cols-2 items-center max-w-6xl mx-auto">
      {align === 'left' ? (
        <>{img}{text}</>
      ) : (
        <>
          <div className="order-2 md:order-1 flex justify-center md:justify-end">{text}</div>
          <div className="order-1 md:order-2">{img}</div>
        </>
      )}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════ */
const GALLERY_PHOTOS = [
  '/photos/gallery-thamires.png',
  '/photos/gallery-couple.png',
  '/photos/gallery-rock.jpg',
]

function Gallery() {
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
          </header>
        </Fade>

        {/* layout masonry: foto principal maior à esquerda */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_PHOTOS.map((src, i) => (
            <Fade key={src} delay={i * 0.06}>
              <div
                className={`overflow-hidden photo-frame bg-[var(--color-sand)] ${
                  i === 0
                    ? 'col-span-2 md:col-span-1 md:row-span-2 aspect-[4/3] md:aspect-auto md:h-full'
                    : 'aspect-[4/5]'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              </div>
            </Fade>
          ))}
        </div>
      </div>
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
          Sua presença já é o nosso maior presente. Se ainda assim quiser
          contribuir, separamos uma lista pensada com carinho.
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
          Esperamos você nesse{' '}
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
