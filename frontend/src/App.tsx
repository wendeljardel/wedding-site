import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Gifts from './pages/Gifts'
import Admin from './pages/Admin'
import RsvpModal from './components/RsvpModal'

const MONOGRAM = '/assets/monogram-wreath.png'

const RSVP_DONE_KEY = 'wedding-rsvp-responded'

function hasRespondedRsvp(): boolean {
  try {
    return localStorage.getItem(RSVP_DONE_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col bg-[var(--color-paper)]">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presentes" element={<Gifts />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <RsvpGate />
    </div>
  )
}

/*
  Portão de RSVP: na primeira visita a uma página pública, abre um modal
  bloqueante. O convidado só acessa o conteúdo depois de responder se vai
  ou não. A resposta fica no localStorage para não reaparecer toda vez.
  O painel /admin nunca é bloqueado.
*/
function RsvpGate() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/admin') {
      setOpen(false)
      return
    }
    if (!hasRespondedRsvp()) setOpen(true)
  }, [pathname])

  if (pathname === '/admin') return null

  function markResponded() {
    try {
      localStorage.setItem(RSVP_DONE_KEY, '1')
    } catch {
      /* ignore quota / private mode */
    }
  }

  return (
    <RsvpModal
      open={open}
      blocking
      onSuccess={markResponded}
      onClose={() => setOpen(false)}
    />
  )
}

function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  if (location.pathname === '/admin') return null

  const links = [
    { href: isHome ? '#about' : '/#about', label: 'Sobre' },
    { href: isHome ? '#details' : '/#details', label: 'Detalhes' },
    { href: isHome ? '#gallery' : '/#gallery', label: 'Fotos' },
    { href: isHome ? '#rsvp' : '/#rsvp', label: 'Presença' },
  ]

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 right-0 z-30 border-b py-3 md:py-4 ${
          isHome && !scrolled ? 'site-header--hero' : 'site-header--solid'
        }`}
      >
        <nav className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-3 md:flex md:items-center md:justify-between gap-4">
          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 -ml-2 text-[var(--color-sage-dark)] justify-self-start"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <ul className="hidden md:flex gap-6 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {links.slice(0, 2).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-[var(--color-sage-dark)] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <NavLink to="/" className="justify-self-center md:flex-shrink-0 md:mx-0">
            <img src={MONOGRAM} alt="T e W" className="h-10 md:h-12 w-auto monogram-wreath" />
          </NavLink>

          <ul className="hidden md:flex gap-6 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {links.slice(2).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-[var(--color-sage-dark)] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <NavLink to="/presentes" className="hover:text-[var(--color-sage-dark)] transition-colors">
                Presentes
              </NavLink>
            </li>
          </ul>

          <NavLink
            to="/presentes"
            className="md:hidden justify-self-end text-[10px] uppercase tracking-[0.2em] text-[var(--color-sage-dark)] border border-[var(--color-sage-dark)]/30 px-3 py-1.5 whitespace-nowrap"
          >
            Presentes
          </NavLink>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-[var(--color-sand)] bg-[var(--color-paper)]/98 backdrop-blur-sm">
            <ul className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="block py-1 hover:text-[var(--color-sage-dark)]">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <NavLink to="/presentes" className="block py-1 hover:text-[var(--color-sage-dark)]">
                  Presentes
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  )
}

function Footer() {
  const { pathname } = useLocation()

  // Admin: sem footer
  if (pathname === '/admin') return null

  // Home: a seção Closing já encerra a página — footer oculto
  if (pathname === '/') return null

  // Outras páginas (presentes, etc.): footer completo
  return (
    <footer className="border-t border-[var(--color-sand)]/50 py-10 bg-[var(--color-cream)]">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-1 text-center">
        <img src={MONOGRAM} alt="" className="h-12 w-auto monogram-wreath mb-1" />
        <p className="font-script text-xl text-[var(--color-name)]">Thamires &amp; Wendel</p>
        <p className="eyebrow text-[var(--color-date)] mt-1 tracking-[0.4em]">06 · 09 · 2026</p>
        <p className="text-xs text-[var(--color-muted)] mt-2 opacity-60">
          Igreja Nossa Senhora do Carmo · Pacatuba, Ceará
        </p>
      </div>
    </footer>
  )
}
