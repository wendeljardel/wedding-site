import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Gifts from './pages/Gifts'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presentes" element={<Gifts />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide on admin page para nao poluir
  if (location.pathname === '/admin') return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-sand)] py-4'
          : 'py-6'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-8 grid grid-cols-3 items-center">
        <ul className="hidden md:flex gap-8 text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
          <li>
            <a href={isHome ? '#about' : '/#about'} className="hover:text-[var(--color-ink)] transition-colors">
              Sobre
            </a>
          </li>
          <li>
            <a href={isHome ? '#details' : '/#details'} className="hover:text-[var(--color-ink)] transition-colors">
              Detalhes
            </a>
          </li>
        </ul>

        <NavLink to="/" className="font-display text-xl md:text-2xl text-center tracking-wide">
          N <span className="ampersand">&amp;</span> W
        </NavLink>

        <ul className="hidden md:flex gap-8 text-xs uppercase tracking-[0.25em] text-[var(--color-muted)] justify-end">
          <li>
            <a href={isHome ? '#gallery' : '/#gallery'} className="hover:text-[var(--color-ink)] transition-colors">
              Fotos
            </a>
          </li>
          <li>
            <NavLink to="/presentes" className="hover:text-[var(--color-ink)] transition-colors">
              Presentes
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  const location = useLocation()
  if (location.pathname === '/admin') return null
  return (
    <footer className="border-t border-[var(--color-sand)] py-10 mt-0 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto px-8 flex flex-col items-center gap-3">
        <p className="font-display text-2xl">
          N <span className="ampersand">&amp;</span> W
        </p>
        <p className="eyebrow">14 . 03 . 2027</p>
        <p className="text-xs text-[var(--color-muted)] mt-2">
          feito com carinho
        </p>
      </div>
    </footer>
  )
}
