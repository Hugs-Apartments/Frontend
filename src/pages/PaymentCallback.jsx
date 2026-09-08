import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PartyPopper, FileText, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui.jsx'
import { verifyPayment } from '../lib/paystack.js'
import { getBookingByReference } from '../data/mockListings.js'
import { formatNaira, formatDateLong } from '../utils/format.js'

// Where Paystack (or the backend's simulated checkout) redirects the guest back
// to after payment. We read the reference, verify it with the backend — which
// confirms the booking and emails the receipt on success — then show the result.
export default function PaymentCallback() {
  const [params] = useSearchParams()
  // Paystack returns ?reference= and ?trxref=; accept either.
  const reference = params.get('reference') || params.get('trxref') || ''

  const [state, setState] = useState('verifying') // verifying | success | failed | error
  const [booking, setBooking] = useState(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // guard against double-run in StrictMode
    ran.current = true

    if (!reference) {
      setState('error')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { status } = await verifyPayment(reference)
        if (cancelled) return
        if (status === 'success') {
          // Best-effort: load the booking to show a full receipt.
          const b = await getBookingByReference(reference).catch(() => null)
          if (cancelled) return
          setBooking(b)
          setState('success')
        } else {
          setState('failed')
        }
      } catch {
        if (!cancelled) setState('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [reference])

  if (state === 'verifying') {
    return (
      <div className="bg-offwhite pt-24">
        <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-plum text-gold">
            <Loader2 className="h-8 w-8 animate-spin" />
          </span>
          <h1 className="mt-6 font-serif text-2xl font-semibold text-ink">Confirming your payment…</h1>
          <p className="mt-2 text-ink/60">Please hold on — this only takes a moment.</p>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return <Success booking={booking} reference={reference} />
  }

  // failed or error
  const isFailed = state === 'failed'
  return (
    <div className="bg-offwhite pt-24">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border-t-2 border-gold bg-white p-8 text-center shadow-lg sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-serif text-3xl font-bold text-ink">
            {isFailed ? 'Payment not completed' : 'We couldn’t confirm your payment'}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-ink/60">
            {isFailed
              ? 'Your payment wasn’t completed, so no booking was confirmed. You can try again — you won’t be charged twice.'
              : 'We hit a snag verifying your payment. If you were charged, please contact us with your reference and we’ll sort it out right away.'}
          </p>
          {reference && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2 text-sm font-semibold text-gold">
              Ref: {reference}
            </div>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/listings" variant="dark" size="lg">Back to apartments</Button>
            <Button to="/contact" variant="outline" size="lg">Contact us</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Success({ booking, reference }) {
  const firstName = (booking?.guest_name || '').trim().split(/\s+/)[0] || 'there'
  const property = booking?.property

  return (
    <div className="bg-offwhite pt-24">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border-t-2 border-gold bg-white p-8 text-center shadow-lg sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-available/15 text-available">
            <PartyPopper className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-serif text-3xl font-bold text-ink">Payment successful</h1>
          <p className="mt-2 text-ink/60">Thank you, {firstName}. Your booking is confirmed.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2 text-sm font-semibold text-gold">
            Ref: {booking?.reference || reference}
          </div>

          {booking?.guest_email && (
            <div className="mx-auto mt-5 flex max-w-md items-start gap-3 rounded-xl bg-available/10 px-4 py-3 text-left text-sm text-available">
              <Mail className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                A confirmation email with your <strong>PDF receipt</strong> and payment details has
                been sent to <strong>{booking.guest_email}</strong>.
              </span>
            </div>
          )}

          {booking && (
            <div className="mt-8 rounded-xl border border-ink/10 bg-offwhite p-6 text-left">
              <h2 className="font-serif text-lg font-semibold text-ink">Receipt</h2>
              <span className="gold-rule mt-2 block !w-12" />
              <dl className="mt-4 space-y-2.5 text-sm">
                {property?.name && <Line label="Apartment" value={property.name} />}
                {property?.type && <Line label="Type" value={property.type} />}
                <Line label="Check-in" value={formatDateLong(booking.check_in)} />
                <Line label="Check-out" value={formatDateLong(booking.check_out)} />
                <Line label="Guests" value={`${booking.guests}`} />
                <Line label="Nights" value={`${booking.nights}`} />
                <div className="my-2 border-t border-ink/10" />
                <Line label="Subtotal" value={formatNaira(Number(booking.subtotal))} />
                <Line label="Service fee" value={formatNaira(Number(booking.service_fee))} />
                {Number(booking.discount_amount) > 0 && (
                  <Line
                    label={`Discount${booking.discount_code ? ` (${booking.discount_code})` : ''}`}
                    value={`−${formatNaira(Number(booking.discount_amount))}`}
                  />
                )}
                <div className="flex justify-between pt-1 font-serif text-base font-bold text-plum">
                  <dt>Total paid</dt>
                  <dd>{formatNaira(Number(booking.total_amount))}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/listings" variant="dark" size="lg">Browse more stays</Button>
            <Button as="button" onClick={() => window.print()} variant="outline" size="lg">
              <FileText className="h-4 w-4" /> Download PDF receipt
            </Button>
          </div>

          <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-plum">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
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
