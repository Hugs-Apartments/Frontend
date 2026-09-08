import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Star, Check, Loader2, MessageSquareHeart } from 'lucide-react'
import { SectionHeading, Button } from '../components/ui.jsx'
import { submitFeedback } from '../data/mockListings.js'

// Guests reach this page from the post-checkout email ("tell us how it went").
// The booking reference is passed as ?ref= so we can link the feedback to the
// stay. This never changes a listing's displayed rating — it's collected purely
// to help improve the experience.
export default function Feedback() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('ref') || ''

  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' })
  const [hover, setHover] = useState(0)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const valid = form.name.trim() && /^\S+@\S+\.\S+$/.test(form.email) && form.rating >= 1

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || sending) return
    setSending(true)
    setError('')
    try {
      await submitFeedback({
        reference,
        name: form.name.trim(),
        email: form.email.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not submit your feedback. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="bg-plum pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Your Stay</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">How was it?</h1>
          <span className="gold-rule mt-5" />
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Thank you for staying with Hugs. Your feedback helps us make every future stay even better.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border-t-2 border-gold bg-white p-6 shadow-sm sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-available/15 text-available">
                <Check className="h-8 w-8" />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">Thank you</h2>
              <p className="mt-2 text-ink/60">
                We’ve received your feedback and truly appreciate you taking the time.
              </p>
              <Button to="/listings" variant="dark" size="lg" className="mt-6">Browse apartments</Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="flex items-center gap-3">
                <MessageSquareHeart className="h-6 w-6 text-gold" />
                <h2 className="font-serif text-2xl font-semibold text-ink">Share your experience</h2>
              </div>
              <span className="gold-rule mt-3 block !w-14" />

              {reference && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-offwhite px-4 py-1.5 text-xs text-ink/60">
                  Booking ref: <span className="font-mono font-semibold text-plum">{reference}</span>
                </p>
              )}

              {error && (
                <div className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
              )}

              {/* Star rating */}
              <div className="mt-6">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/50">Your rating</span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1
                    const active = n <= (hover || form.rating)
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${n} star${n > 1 ? 's' : ''}`}
                        className="p-0.5"
                      >
                        <Star className={`h-8 w-8 transition-colors ${active ? 'fill-gold text-gold' : 'text-ink/20'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">Comments (optional)</span>
                <textarea
                  rows={5}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="What did you love? What could we do better?"
                  className="w-full resize-none rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
                />
              </label>

              <Button as="button" type="submit" disabled={!valid || sending} size="lg" className="mt-6 w-full">
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Submit feedback'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
