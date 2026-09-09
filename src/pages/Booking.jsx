import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Check, ShieldCheck, Lock, CalendarCheck, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { getListingById, validateDiscount, createBooking } from '../data/mockListings.js'
import { initPayment } from '../lib/paystack.js'
import { formatNaira, nightsBetween, formatDateLong } from '../utils/format.js'

const STEPS = ['Dates', 'Details', 'Payment']

export default function Booking() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [listing, setListing] = useState(undefined)

  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests')) || 1
  const promoFromUrl = searchParams.get('promo') || ''

  // Guest details persist across a refresh so a half-filled form isn't lost.
  // Scoped per listing id via sessionStorage; cleared once payment starts.
  const storageKey = `hugs.booking.${id}`
  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [guest, setGuest] = useState(() => {
    const empty = { firstName: '', lastName: '', email: '', phone: '', notes: '' }
    try {
      const saved = sessionStorage.getItem(`hugs.booking.${id}`)
      return saved ? { ...empty, ...JSON.parse(saved) } : empty
    } catch {
      return empty
    }
  })

  // Persist guest details on every change so a refresh keeps them.
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(guest))
    } catch {
      // storage may be unavailable (private mode) — degrade silently.
    }
  }, [guest, storageKey])

  // A discount is applied on the apartment's booking panel and carried here via
  // ?promo=CODE. We validate it once below and show it in the order summary —
  // there is no code entry on this checkout flow (that lives only on the panel).
  const [promo, setPromo] = useState(null) // { code, discount, label } | null

  useEffect(() => {
    getListingById(id).then(setListing).catch(() => setListing(null))
  }, [id])

  const nights = nightsBetween(checkIn, checkOut)
  const totals = useMemo(() => {
    if (!listing) return null
    const subtotal = nights * listing.pricePerNight
    const serviceFee = Math.round(subtotal * 0.05)
    const discount = promo ? Math.min(promo.discount, subtotal) : 0
    return { subtotal, serviceFee, discount, total: Math.max(0, subtotal + serviceFee - discount) }
  }, [listing, nights, promo])

  // A code applied on the listing page arrives as ?promo=CODE. Validate it once
  // the listing (and so the subtotal) is known, so the discount carries through
  // to checkout without the guest re-typing it.
  useEffect(() => {
    if (!promoFromUrl || !listing || promo || nights < 1) return
    let cancelled = false
    const subtotal = nights * listing.pricePerNight
    validateDiscount({ code: promoFromUrl, subtotal, nights }).then((res) => {
      if (cancelled) return
      if (res.ok) {
        setPromo({ code: res.code, discount: res.discount, label: res.label })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing, promoFromUrl])

  if (listing === undefined) {
    return <div className="mx-auto max-w-5xl px-5 pt-40 pb-24"><div className="h-96 animate-pulse rounded-2xl bg-ink/5" /></div>
  }
  if (listing === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-40 pb-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink">Listing not found</h1>
        <Button to="/listings" variant="dark" className="mt-6">Back to apartments</Button>
      </div>
    )
  }

  // Nigerian mobile numbers: 11 local digits (0803…) or +234 / 234 followed by
  // 10 digits. We strip spaces, dashes and brackets before checking.
  const phoneDigits = guest.phone.replace(/[\s()-]/g, '')
  const phoneValid = /^(?:\+?234|0)\d{10}$/.test(phoneDigits)
  const emailValid = /^\S+@\S+\.\S+$/.test(guest.email)
  const detailsValid = guest.firstName && guest.lastName && emailValid && phoneValid

  const pay = async () => {
    setError('')
    setProcessing(true)
    try {
      // Create the pending booking first — the backend re-validates availability
      // and computes the real total server-side. Then hand off to Paystack's
      // hosted checkout (or the backend's simulated checkout in dev).
      const booking = await createBooking({
        propertyId: listing.id,
        guestName: `${guest.firstName} ${guest.lastName}`.trim(),
        guestEmail: guest.email.trim(),
        guestPhone: guest.phone.trim(),
        notes: guest.notes,
        checkIn,
        checkOut,
        guests,
        promoCode: promo?.code || null,
      })
      const { authorizationUrl } = await initPayment({ bookingId: booking.id })
      if (!authorizationUrl) throw new Error('Payment could not be started. Please try again.')
      // Clear the saved draft and redirect to complete payment.
      try { sessionStorage.removeItem(storageKey) } catch { /* ignore */ }
      window.location.href = authorizationUrl
    } catch (err) {
      setError(err.message || 'Payment could not be started. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="bg-offwhite pt-24">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <Link to={`/listings/${id}`} className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-plum">
          <ArrowLeft className="h-4 w-4" /> Back to apartment
        </Link>

        {/* Stepper */}
        <ol className="mt-6 flex items-center gap-3">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3 last:flex-none">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                i < step ? 'bg-available text-white' : i === step ? 'bg-plum text-white' : 'bg-ink/10 text-ink/50'
              }`}>
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <span className={`text-sm font-medium ${i === step ? 'text-plum' : 'text-ink/50'}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-ink/15 sm:block" />}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Step content */}
          <div className="rounded-2xl border-t-2 border-gold bg-white p-6 shadow-sm sm:p-8">
            {step === 0 && (
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">Confirm your stay</h2>
                <span className="gold-rule mt-3 block !w-14" />
                <div className="mt-6 space-y-4">
                  <Row icon={CalendarCheck} label="Check-in" value={formatDateLong(checkIn)} />
                  <Row icon={CalendarCheck} label="Check-out" value={formatDateLong(checkOut)} />
                  <Row icon={User} label="Guests" value={`${guests} guest${guests > 1 ? 's' : ''}`} />
                  <Row icon={CalendarCheck} label="Nights" value={`${nights} night${nights !== 1 ? 's' : ''}`} />
                </div>
                {nights < 1 && (
                  <p className="mt-4 text-sm text-red-500">Invalid dates — please go back and choose your dates again.</p>
                )}
                <div className="mt-8 flex justify-end">
                  <Button as="button" onClick={() => setStep(1)} disabled={nights < 1} size="lg">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">Guest details</h2>
                <span className="gold-rule mt-3 block !w-14" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="First name" value={guest.firstName} onChange={(v) => setGuest({ ...guest, firstName: v })} />
                  <Field label="Last name" value={guest.lastName} onChange={(v) => setGuest({ ...guest, lastName: v })} />
                  <Field
                    label="Email"
                    type="email"
                    value={guest.email}
                    onChange={(v) => setGuest({ ...guest, email: v })}
                    error={guest.email && !emailValid ? 'Enter a valid email (must include @).' : ''}
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    value={guest.phone}
                    onChange={(v) => setGuest({ ...guest, phone: v })}
                    error={guest.phone && !phoneValid ? 'Enter a valid Nigerian number, e.g. 08031234567.' : ''}
                  />
                  <div className="sm:col-span-2">
                    <Field label="Notes (optional)" textarea value={guest.notes} onChange={(v) => setGuest({ ...guest, notes: v })} />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button as="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button as="button" onClick={() => setStep(2)} disabled={!detailsValid} size="lg">
                    Continue to payment <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">Payment</h2>
                <span className="gold-rule mt-3 block !w-14" />

                <div className="mt-6 rounded-xl border border-ink/10 bg-offwhite p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-plum text-gold">
                    <ShieldCheck className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
                    Secure payment with Paystack
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">
                    You’ll be redirected to Paystack to complete your payment securely — by card,
                    bank transfer or USSD. We never see or store your card details.
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-xs text-ink/50">
                    <Lock className="h-4 w-4 text-gold" /> Encrypted &amp; PCI-DSS compliant
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-champagne/30 px-4 py-3">
                  <span className="text-sm text-ink/70">Amount due</span>
                  <span className="font-serif text-lg font-bold text-plum">{formatNaira(totals.total)}</span>
                </div>

                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                <div className="mt-6 flex justify-between">
                  <Button as="button" variant="outline" onClick={() => setStep(1)} disabled={processing}>Back</Button>
                  <Button as="button" onClick={pay} disabled={processing} size="lg">
                    {processing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</>
                    ) : (
                      <>Pay {formatNaira(totals.total)} <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>
                <p className="mt-3 text-center text-xs text-ink/40">
                  You’ll be redirected to Paystack to complete payment securely.
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border-t-2 border-gold bg-white shadow-sm">
              <img src={listing.images[0]} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">{listing.type}</span>
                <h3 className="font-serif text-xl font-semibold text-ink">{listing.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{listing.area}, {listing.location}</p>
                <dl className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
                  <div className="flex justify-between text-ink/70">
                    <dt>{formatNaira(listing.pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</dt>
                    <dd>{formatNaira(totals.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <dt>Service fee</dt>
                    <dd>{formatNaira(totals.serviceFee)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-available">
                      <dt>Discount {promo?.code ? `(${promo.code})` : ''}</dt>
                      <dd>−{formatNaira(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-ink/10 pt-2 font-serif text-lg font-bold text-plum">
                    <dt>Total</dt>
                    <dd>{formatNaira(totals.total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/10 pb-3">
      <span className="inline-flex items-center gap-2 text-sm text-ink/60"><Icon className="h-4 w-4 text-gold" /> {label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', textarea = false, icon: Icon, error = '' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</span>
      <div className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:border-gold ${error ? 'border-red-400' : 'border-ink/15'}`}>
        {Icon && <Icon className="h-4 w-4 text-ink/40" />}
        {textarea ? (
          <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-none bg-transparent text-sm text-ink outline-none" />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm text-ink outline-none" />
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

