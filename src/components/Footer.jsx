import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Camera, MessageCircle } from 'lucide-react'
import Logo from './Logo.jsx'

const WHATSAPP = '+234 800 000 0000'

export default function Footer() {
  return (
    <footer className="bg-plum-dark text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Premium serviced apartments in Maryland, Lagos. Live luxury, feel at home.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white">Explore</h4>
          <span className="gold-rule mt-3 !w-10" />
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/listings" className="hover:text-gold">Apartments</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white">Contact</h4>
          <span className="gold-rule mt-3 !w-10" />
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>Maryland, Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <span>{WHATSAPP}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <span>stay@hugsapartments.ng</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white">Stay in touch</h4>
          <span className="gold-rule mt-3 !w-10" />
          <div className="mt-4 flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-plum"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/hugsluxuryapartments"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-plum"
              aria-label="Instagram"
            >
              <Camera className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Hugs Luxury Apartments. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <Link to="/legal/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link to="/legal/terms" className="hover:text-gold">Terms of Use</Link>
            <Link to="/legal/cookies" className="hover:text-gold">Cookie Policy</Link>
          </div>
          <p>Live Luxury. Feel at Home.</p>
        </div>
      </div>
    </footer>
  )
}
