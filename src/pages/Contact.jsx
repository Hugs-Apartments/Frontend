import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Clock, Check } from 'lucide-react'
import { SectionHeading, Button } from '../components/ui.jsx'
import { submitContact } from '../data/mockListings.js'

const WHATSAPP = '+234 800 000 0000'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const valid = form.name && /^\S+@\S+\.\S+$/.test(form.email) && form.message.length > 5

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || sending) return
    setSending(true)
    setError('')
    try {
      await submitContact(form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="bg-plum pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Get in Touch</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
          <span className="gold-rule mt-5" />
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            We’d love to hear from you. Reach out and our team will respond promptly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact info */}
          <div>
            <SectionHeading eyebrow="Reach Us" title="Details" align="left" />
            <ul className="mt-8 space-y-6">
              <ContactItem icon={MapPin} title="Address" lines={['Maryland, Lagos, Nigeria']} />
              <ContactItem icon={Phone} title="Phone / WhatsApp" lines={[WHATSAPP]} />
              <ContactItem icon={Mail} title="Email" lines={['stay@hugsapartments.ng']} />
              <ContactItem icon={Clock} title="Hours" lines={['Reception 24/7', 'Bookings: 8am – 10pm daily']} />
            </ul>
            <Button href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`} size="lg" className="mt-8">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </Button>
          </div>

          {/* Form */}
          <div className="rounded-2xl border-t-2 border-gold bg-white p-6 shadow-sm sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-available/15 text-available">
                  <Check className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-ink">Message sent</h3>
                <p className="mt-2 text-ink/60">Thanks for reaching out — we’ll be in touch shortly.</p>
                <Button as="button" onClick={() => setSent(false)} variant="outline" className="mt-6">
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 className="font-serif text-2xl font-semibold text-ink">Send a message</h2>
                <span className="gold-rule mt-3 block !w-14" />
                {error && (
                  <div className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
                )}
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">Name</span>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">Message</span>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full resize-none rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
                    />
                  </label>
                </div>
                <Button as="button" type="submit" disabled={!valid || sending} size="lg" className="mt-6 w-full">
                  {sending ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function ContactItem({ icon: Icon, title, lines }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
        {lines.map((l) => (
          <p key={l} className="text-sm text-ink/60">{l}</p>
        ))}
      </div>
    </li>
  )
}
