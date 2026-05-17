import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Ceremony from './pages/Ceremony'
import Gifts from './pages/Gifts'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cerimonia" element={<Ceremony />} />
          <Route path="/presentes" element={<Gifts />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/cerimonia', label: 'Cerimonia' },
    { to: '/presentes', label: 'Presentes' },
  ]
  return (
    <header className="border-b border-[var(--color-sand)] bg-[var(--color-cream)]/90 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="font-serif text-2xl tracking-wide">
          N &amp; W
        </NavLink>
        <ul className="flex gap-8 text-sm uppercase tracking-widest">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'text-[var(--color-ink)] border-b border-[var(--color-clay)] pb-1'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors'
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-sand)] py-8 mt-16">
      <div className="max-w-5xl mx-auto px-6 text-center text-xs uppercase tracking-widest text-[var(--color-muted)]">
        com amor &mdash; nosso casamento
      </div>
    </footer>
  )
}
