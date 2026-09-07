import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Check, CreditCard, Lock, CalendarCheck, User, ArrowRight, ArrowLeft, Loader2, PartyPopper } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { getListingById } from '../data/mockListings.js'
import { initPayment } from '../lib/paystack.js'
import {
  formatNaira,
  nightsBetween,
  formatDateLong,
  makeBookingRef,
} from '../utils/format.js'

const STEPS = ['Dates', 'Details', 'Payment']

export default function Booking() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [listing, setListing] = useState(undefined)

  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests')) || 1

  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [guest, setGuest] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' })

  useEffect(() => {
    getListingById(id).then(setListing)
  }, [id])

  const nights = nightsBetween(checkIn, checkOut)
  const totals = useMemo(() => {
    if (!listing) return null
    const subtotal = nights * listing.pricePerNight
    const serviceFee = Math.round(subtotal * 0.05)
    return { subtotal, serviceFee, total: subtotal + serviceFee }
  }, [listing, nights])

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

  const detailsValid =
    guest.firstName && guest.lastName && /^\S+@\S+\.\S+$/.test(guest.email) && guest.phone.length >= 7

  const pay = async () => {
    setProcessing(true)
    const ref = makeBookingRef()
    const result = await initPayment({ amount: totals.total, email: guest.email, bookingRef: ref })
    setProcessing(false)
    setConfirmation({ ...result, ref })
  }

  if (confirmation) {
    return <Confirmation listing={listing} guest={guest} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} totals={totals} confirmation={confirmation} />
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
                  <Field label="Email" type="email" value={guest.email} onChange={(v) => setGuest({ ...guest, email: v })} />
                  <Field label="Phone" type="tel" value={guest.phone} onChange={(v) => setGuest({ ...guest, phone: v })} />
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
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-champagne/30 px-4 py-3 text-sm text-ink/70">
                  <Lock className="h-4 w-4 text-gold" /> This is a mock payment screen — no real charge is made.
                </div>
                <div className="mt-6 space-y-4">
                  <Field label="Card number" value="4084 0840 8408 4081" onChange={() => {}} icon={CreditCard} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" value="12 / 28" onChange={() => {}} />
                    <Field label="CVV" value="123" onChange={() => {}} />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button as="button" variant="outline" onClick={() => setStep(1)} disabled={processing}>Back</Button>
                  <Button as="button" onClick={pay} disabled={processing} size="lg">
                    {processing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                    ) : (
                      <>Pay {formatNaira(totals.total)}</>
                    )}
                  </Button>
                </div>
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

function Field({ label, value, onChange, type = 'text', textarea = false, icon: Icon }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-3 py-2.5 focus-within:border-gold">
        {Icon && <Icon className="h-4 w-4 text-ink/40" />}
        {textarea ? (
          <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-none bg-transparent text-sm text-ink outline-none" />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm text-ink outline-none" />
        )}
      </div>
    </label>
  )
}

function Confirmation({ listing, guest, checkIn, checkOut, guests, nights, totals, confirmation }) {
  return (
    <div className="bg-offwhite pt-24">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border-t-2 border-gold bg-white p-8 text-center shadow-lg sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-available/15 text-available">
            <PartyPopper className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-serif text-3xl font-bold text-ink">Booking confirmed</h1>
          <p className="mt-2 text-ink/60">
            Thank you, {guest.firstName}. A confirmation has been sent to {guest.email}.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2 text-sm font-semibold text-gold">
            Ref: {confirmation.ref}
          </div>

          {/* Receipt */}
          <div className="mt-8 rounded-xl border border-ink/10 bg-offwhite p-6 text-left">
            <h2 className="font-serif text-lg font-semibold text-ink">Receipt</h2>
            <span className="gold-rule mt-2 block !w-12" />
            <dl className="mt-4 space-y-2.5 text-sm">
              <Line label="Apartment" value={listing.name} />
              <Line label="Type" value={listing.type} />
              <Line label="Check-in" value={formatDateLong(checkIn)} />
              <Line label="Check-out" value={formatDateLong(checkOut)} />
              <Line label="Guests" value={`${guests}`} />
              <Line label="Nights" value={`${nights}`} />
              <div className="my-2 border-t border-ink/10" />
              <Line label="Subtotal" value={formatNaira(totals.subtotal)} />
              <Line label="Service fee" value={formatNaira(totals.serviceFee)} />
              <div className="flex justify-between pt-1 font-serif text-base font-bold text-plum">
                <dt>Total paid</dt>
                <dd>{formatNaira(totals.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/listings" variant="dark" size="lg">Browse more stays</Button>
            <Button as="button" onClick={() => window.print()} variant="outline" size="lg">Print receipt</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between text-ink/70">
      <dt>{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  )
}
