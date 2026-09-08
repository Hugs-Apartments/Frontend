import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Camera, MessageCircle, Send, Check, Loader2 } from 'lucide-react'
import Logo from './Logo.jsx'
import { subscribeNewsletter } from '../data/mockListings.js'

const WHATSAPP = '+234 909 215 7050'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      await subscribeNewsletter(email)
      setStatus('done')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong.')
    }
  }

  if (status === 'done') {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-gold">
        <Check className="h-4 w-4" /> You’re subscribed — welcome to Hugs.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex overflow-hidden rounded-full border border-white/20 bg-white/5 focus-within:border-gold">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 bg-gold px-4 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-champagne disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      {status === 'error' && <p className="mt-2 text-xs text-red-300">{message}</p>}
    </form>
  )
}

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
              <span>45 Dokun Ogundipe Crescent, Maryland, Lagos, Nigeria</span>
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
          <p className="mt-4 text-sm">Join our newsletter for new apartments and exclusive offers.</p>
          <NewsletterForm />
          <div className="mt-5 flex gap-3">
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
              href="https://www.instagram.com/hugsluxuryapartments"
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
            <Link to="/legal/cancellation" className="hover:text-gold">Cancellation Policy</Link>
            <Link to="/legal/cookies" className="hover:text-gold">Cookie Policy</Link>
          </div>
          <p>Live Luxury. Feel at Home.</p>
        </div>
      </div>
    </footer>
  )
}
