import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import { Button } from './ui.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Apartments' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change.
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-plum-dark/95 shadow-lg backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Button to="/listings" size="sm">
            Book Now
          </Button>
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-plum-dark md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-white/5 text-gold' : 'text-white/90'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button to="/listings" size="md" className="mt-3">
              Book Now
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
