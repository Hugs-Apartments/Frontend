import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Minus, Plus, CheckCircle2, CalendarX, Tag, Loader2, X } from 'lucide-react'
import { Button } from './ui.jsx'
import { getLocations, isAvailableForRange, conflictingRanges, validateDiscount } from '../data/mockListings.js'
import { todayISO, addDaysISO, nightsBetween, formatNaira, formatDateLong } from '../utils/format.js'

// Guest stepper.
function GuestStepper({ value, onChange, max = 8 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
        disabled={value <= 1}
        aria-label="Fewer guests"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
        disabled={value >= max}
        aria-label="More guests"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

const fieldWrap =
  'flex flex-col gap-1.5 rounded-lg border border-ink/10 bg-white px-4 py-3 text-left'
const label = 'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50'
const input = 'bg-transparent text-sm font-medium text-ink outline-none'

// Hero search widget — location is a dropdown built from the catalogue.
export function SearchWidget() {
  const navigate = useNavigate()
  const locations = getLocations()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState(todayISO())
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 2))
  const [guests, setGuests] = useState(2)

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
    if (location) params.set('location', location)
    navigate(`/listings?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submit}
      className="grid w-full gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl shadow-plum/30 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <label className={fieldWrap}>
        <span className={label}><MapPin className="h-3.5 w-3.5 text-gold" /> Location</span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`${input} cursor-pointer`}
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}, Maryland</option>
          ))}
        </select>
      </label>
      <label className={fieldWrap}>
        <span className={label}><Calendar className="h-3.5 w-3.5 text-gold" /> Check-in</span>
        <input
          type="date"
          value={checkIn}
          min={todayISO()}
          onChange={(e) => setCheckIn(e.target.value)}
          className={input}
        />
      </label>
      <label className={fieldWrap}>
        <span className={label}><Calendar className="h-3.5 w-3.5 text-gold" /> Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={addDaysISO(checkIn, 1)}
          onChange={(e) => setCheckOut(e.target.value)}
          className={input}
        />
      </label>
      <div className={fieldWrap}>
        <span className={label}><Users className="h-3.5 w-3.5 text-gold" /> Guests</span>
        <GuestStepper value={guests} onChange={setGuests} />
      </div>
      <Button as="button" type="submit" size="lg" className="h-full w-full lg:w-auto">
        <Search className="h-4 w-4" /> Search
      </Button>
    </form>
  )
}

// Sticky booking panel on the listing detail page.
export function BookingPanel({ listing }) {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState(todayISO())
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 2))
  const [guests, setGuests] = useState(2)

  // Promo code applied at the date step, so the guest sees the discounted
  // total before proceeding. The validated code is carried to checkout.
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null) // { code, discount, label } | null
  const [promoError, setPromoError] = useState('')
  const [checkingPromo, setCheckingPromo] = useState(false)

  const nights = nightsBetween(checkIn, checkOut)
  const subtotal = nights * listing.pricePerNight
  const serviceFee = Math.round(subtotal * 0.05)
  const discount = promo ? Math.min(promo.discount, subtotal) : 0
  const total = Math.max(0, subtotal + serviceFee - discount)

  // Availability is judged against this apartment's own booked ranges for the
  // exact dates chosen — other dates stay bookable.
  const availableForDates = isAvailableForRange(listing, checkIn, checkOut)
  const conflicts = conflictingRanges(listing, checkIn, checkOut)
  const datesChosen = nights > 0
  const withinGuests = guests <= listing.maxGuests
  const valid = datesChosen && withinGuests && availableForDates

  const applyPromo = async () => {
    setPromoError('')
    setCheckingPromo(true)
    try {
      const res = await validateDiscount({ code: promoInput, subtotal, nights })
      if (res.ok) {
        setPromo({ code: res.code, discount: res.discount, label: res.label })
        setPromoInput(res.code)
      } else {
        setPromo(null)
        setPromoError(res.error || 'That code isn’t valid.')
      }
    } finally {
      setCheckingPromo(false)
    }
  }

  const removePromo = () => {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  const proceed = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    })
    if (promo?.code) params.set('promo', promo.code)
    navigate(`/booking/${listing.id}?${params.toString()}`)
  }

  return (
    <div className="rounded-2xl border-t-2 border-gold bg-white p-6 shadow-xl shadow-plum/10">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-serif text-3xl font-bold text-plum">
            {formatNaira(listing.pricePerNight)}
          </span>
          <span className="text-sm text-ink/50"> / night</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className={fieldWrap}>
          <span className={label}><Calendar className="h-3.5 w-3.5 text-gold" /> Check-in</span>
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className={input}
          />
        </label>
        <label className={fieldWrap}>
          <span className={label}><Calendar className="h-3.5 w-3.5 text-gold" /> Check-out</span>
          <input
            type="date"
            value={checkOut}
            min={addDaysISO(checkIn, 1)}
            onChange={(e) => setCheckOut(e.target.value)}
            className={input}
          />
        </label>
      </div>

      <div className={`mt-3 ${fieldWrap}`}>
        <span className={label}><Users className="h-3.5 w-3.5 text-gold" /> Guests (max {listing.maxGuests})</span>
        <GuestStepper value={guests} onChange={setGuests} max={listing.maxGuests} />
      </div>

      {/* Per-date availability for THIS apartment */}
      {datesChosen && (
        availableForDates ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-available/10 px-3 py-2.5 text-sm font-medium text-available">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Available for your dates
          </div>
        ) : (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <span className="flex items-center gap-2 font-medium">
              <CalendarX className="h-4 w-4 shrink-0" /> Not available for these dates
            </span>
            <p className="mt-1.5 text-xs text-red-500">
              Already booked{' '}
              {conflicts
                .map((r) => `${formatDateLong(r.from)} – ${formatDateLong(r.to)}`)
                .join(', ')}
              . Try different dates.
            </p>
          </div>
        )
      )}

      {/* Discount code — apply here so the total reflects it before checkout */}
      {datesChosen && availableForDates && (
        <div className="mt-4">
          <span className={label}><Tag className="h-3.5 w-3.5 text-gold" /> Discount code</span>
          {promo ? (
            <div className="mt-1.5 flex items-center justify-between rounded-lg border border-available/40 bg-available/10 px-3 py-2 text-sm">
              <span className="font-medium text-available">
                <span className="font-mono font-semibold">{promo.code}</span> — {promo.label}
              </span>
              <button type="button" onClick={removePromo} aria-label="Remove code" className="text-ink/40 hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-1.5 flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 font-mono text-sm uppercase text-ink outline-none focus:border-gold"
              />
              <Button as="button" variant="outline" size="sm" onClick={applyPromo} disabled={checkingPromo || !promoInput.trim()}>
                {checkingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
              </Button>
            </div>
          )}
          {promoError && <p className="mt-1.5 text-xs text-red-500">{promoError}</p>}
        </div>
      )}

      {datesChosen && availableForDates && (
        <dl className="mt-5 space-y-2 border-t border-ink/10 pt-5 text-sm">
          <div className="flex justify-between text-ink/70">
            <dt>{formatNaira(listing.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</dt>
            <dd>{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink/70">
            <dt>Service fee</dt>
            <dd>{formatNaira(serviceFee)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-available">
              <dt>Discount ({promo.code})</dt>
              <dd>−{formatNaira(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-2 font-serif text-lg font-bold text-plum">
            <dt>Total</dt>
            <dd>{formatNaira(total)}</dd>
          </div>
        </dl>
      )}

      <Button
        as="button"
        onClick={proceed}
        disabled={!valid}
        size="lg"
        className="mt-5 w-full"
      >
        {datesChosen && !availableForDates ? 'Not available' : 'Book Now'}
      </Button>
      {!datesChosen && (
        <p className="mt-3 text-center text-xs text-ink/50">Select valid dates to continue.</p>
      )}
      {guests > listing.maxGuests && (
        <p className="mt-3 text-center text-xs text-red-500">
          This apartment holds up to {listing.maxGuests} guests.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-ink/40">You won’t be charged yet — mock checkout.</p>
    </div>
  )
}
