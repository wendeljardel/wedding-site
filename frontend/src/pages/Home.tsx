import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import galleryRock from '../assets/photos/gallery-rock.jpg'

/*
  Home single-page inspirada no template Squarespace "Rey Fluid".
  Estrutura: Hero -> About -> When -> Where -> Accommodations -> Bride ->
  Groom -> Gallery -> Registry -> Closing.

  Para personalizar: edite as constantes no topo dos componentes e substitua
  as URLs do Unsplash pelas suas proprias fotos (basta apontar para arquivos
  em /public/photos depois de coloca-los la).
*/

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Details />
      <Bride />
      <Groom />
      <Gallery />
      <Registry />
      <Closing />
    </>
  )
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-paper)]/40" />
      </div>

      <div className="relative text-center px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="eyebrow text-white/90"
        >
          <span className="divider-rule bg-white/70" />
          06 . 09 . 2026
          <span className="divider-rule bg-white/70" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          className="mt-10 text-white text-7xl md:text-9xl font-display"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.15)' }}
        >
          Thamires
          <span className="block ampersand text-white/95 my-2 text-6xl md:text-8xl">
            &amp;
          </span>
          Wendel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 eyebrow text-white/95"
        >
          Vamos nos casar
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2"
      >
        <span>role</span>
        <span className="h-12 w-px bg-white/60" />
      </motion.div>
    </section>
  )
}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <Section id="about" eyebrow="Um encontro feito no ceu">
      <Fade>
        <h2 className="text-4xl md:text-6xl font-display max-w-4xl mx-auto leading-tight">
          Thamires e Wendel convidam voce com alegria para
          celebrar a uniao de nossas vidas, na presenca da
          familia e dos amigos.
        </h2>
      </Fade>
      <Fade delay={0.15}>
        <p className="mt-10 max-w-2xl mx-auto text-[var(--color-muted)] leading-relaxed">
          A cerimonia sera intimista, seguida de recepcao no
          mesmo espaco. O traje sugerido e esporte fino, e a
          sua presenca e o que tornara esse dia inesquecivel.
        </p>
      </Fade>
    </Section>
  )
}

/* ---------- DETAILS (When / Where / Accommodations) ---------- */
function Details() {
  return (
    <section id="details" className="bg-[var(--color-cream)] py-32 md:py-40">
      <div className="max-w-6xl mx-auto px-8 grid gap-20 md:grid-cols-3">
        <DetailBlock
          eyebrow="Quando"
          title="Domingo, 06 de Setembro de 2026"
          lines={['Cerimonia: 16h', 'Recepcao: 18h']}
        />
        <DetailBlock
          eyebrow="Onde"
          title="Capela de Sao Pedro"
          lines={['Rua das Flores, 123', 'Sao Paulo, SP']}
        />
        <DetailBlock
          eyebrow="Hospedagem"
          title="Hotel Jardim"
          lines={[
            'Reservamos um bloco de quartos.',
            'Mencione "casamento T & W" ao reservar.',
            'Rua das Flores, 200',
          ]}
        />
      </div>
    </section>
  )
}

function DetailBlock({
  eyebrow,
  title,
  lines,
}: {
  eyebrow: string
  title: string
  lines: string[]
}) {
  return (
    <Fade>
      <div className="text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-6 text-3xl md:text-4xl font-display">{title}</h3>
        <div className="mt-6 space-y-1 text-[var(--color-muted)]">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    </Fade>
  )
}

/* ---------- BRIDE / GROOM ---------- */
function Bride() {
  return (
    <Person
      eyebrow="A noiva"
      name="Thamires"
      bio="Conte aqui um pouco da historia dela: onde cresceu, o que faz e
       o que mais ama no mundo. Algumas frases sao suficientes para dar
       um toque pessoal sem alongar demais."
      image="https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=1200&q=80"
      align="left"
    />
  )
}

function Groom() {
  return (
    <Person
      eyebrow="O noivo"
      name="Wendel"
      bio="Conte aqui um pouco da historia dele: trajetoria, paixoes e
       o que torna esse encontro tao especial. Mantenha curto, com a
       voz de voces dois."
      image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
      align="right"
    />
  )
}

function Person({
  eyebrow,
  name,
  bio,
  image,
  align,
}: {
  eyebrow: string
  name: string
  bio: string
  image: string
  align: 'left' | 'right'
}) {
  const text = (
    <Fade>
      <div className="px-8 md:px-16 py-16 md:py-24 max-w-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-6 text-4xl md:text-5xl font-display">{name}</h3>
        <p className="mt-8 text-[var(--color-muted)] leading-relaxed">{bio}</p>
      </div>
    </Fade>
  )
  const img = (
    <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden">
      <motion.img
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        src={image}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  )
  return (
    <section className="grid md:grid-cols-2 items-center">
      {align === 'left' ? (
        <>
          {img}
          <div className="flex justify-start">{text}</div>
        </>
      ) : (
        <>
          <div className="flex justify-end order-2 md:order-1">{text}</div>
          <div className="order-1 md:order-2">{img}</div>
        </>
      )}
    </section>
  )
}

/* ---------- GALLERY ---------- */
const GALLERY_PHOTOS = [
  '/photos/gallery-thamires.png',
  '/photos/gallery-couple.png',
  galleryRock,
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
]

function Gallery() {
  return (
    <section id="gallery" className="py-32 md:py-40 bg-[var(--color-paper)]">
      <div className="max-w-6xl mx-auto px-8 text-center mb-16">
        <Fade>
          <p className="eyebrow">
            <span className="divider-rule" />
            Memorias
            <span className="divider-rule" />
          </p>
          <h2 className="mt-6 text-4xl md:text-5xl font-display">Nossa historia em fotos</h2>
        </Fade>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-w-6xl mx-auto px-8">
        {GALLERY_PHOTOS.map((src, i) => (
          <Fade key={src} delay={i * 0.05}>
            <div className="aspect-[4/5] overflow-hidden bg-[var(--color-sand)]">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Fade>
        ))}
      </div>
    </section>
  )
}

/* ---------- REGISTRY ---------- */
function Registry() {
  return (
    <section className="py-32 md:py-40 bg-[var(--color-cream)]">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <Fade>
          <p className="eyebrow">A lista</p>
          <h2 className="mt-6 text-4xl md:text-5xl font-display">Lista de presentes</h2>
          <p className="mt-8 text-[var(--color-muted)] leading-relaxed">
            Sua presenca ja e o nosso maior presente. Se ainda assim quiser
            contribuir com algo, separamos uma lista pensada com carinho.
            Cada item leva direto para a loja onde escolhemos, e fica indisponivel
            assim que alguem reserva.
          </p>
        </Fade>
        <Fade delay={0.15}>
          <Link
            to="/presentes"
            className="inline-block mt-12 px-10 py-4 bg-[var(--color-ink)] text-[var(--color-paper)] uppercase tracking-[0.25em] text-xs hover:opacity-90 transition-opacity"
          >
            Ver a lista
          </Link>
        </Fade>
      </div>
    </section>
  )
}

/* ---------- CLOSING ---------- */
function Closing() {
  return (
    <section className="py-32 md:py-48 text-center px-8">
      <Fade>
        <h2 className="text-3xl md:text-5xl font-display max-w-3xl mx-auto leading-tight">
          Esperamos que voce esteja com a gente nesse
          <span className="ampersand"> dia tao especial</span>.
        </h2>
      </Fade>
    </section>
  )
}

/* ---------- Helpers ---------- */
function Section({
  id,
  eyebrow,
  children,
}: {
  id?: string
  eyebrow?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="py-32 md:py-40 px-8 text-center">
      {eyebrow && (
        <Fade>
          <p className="eyebrow">
            <span className="divider-rule" />
            {eyebrow}
            <span className="divider-rule" />
          </p>
          <div className="mt-10" />
        </Fade>
      )}
      {children}
    </section>
  )
}

function Fade({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
