import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase tracking-[0.3em] text-xs text-[var(--color-muted)] mb-6"
        >
          14 de Marco de 2027 &middot; Sao Paulo
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-6xl md:text-8xl font-serif font-light"
        >
          Noiva
          <span className="block italic text-[var(--color-clay)] my-2">&amp;</span>
          Noivo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 text-lg text-[var(--color-muted)] max-w-xl mx-auto leading-relaxed"
        >
          Sera uma alegria contar com voce nesse dia tao especial.
          Aqui voce encontra todas as informacoes da cerimonia e a
          nossa lista de presentes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <Link
            to="/cerimonia"
            className="px-6 py-3 border border-[var(--color-ink)] uppercase tracking-widest text-xs hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
          >
            Cerimonia
          </Link>
          <Link
            to="/presentes"
            className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
          >
            Lista de presentes
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
