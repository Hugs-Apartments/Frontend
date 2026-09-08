// Data-service layer for Hugs Luxury Apartments.
//
// Every data-driven view reads through the functions in this file. There is no
// mock data and no offline fallback — the app is 100% backend-driven and talks
// to the API at VITE_API_URL. No Supabase keys or database access ever live in
// the frontend; all of that stays on the backend. The only public config the
// frontend needs is VITE_API_URL and the Paystack public key.
//
// The two non-data exports below (CORE_AMENITIES, WHY_HUGS) and getListingTypes
// are brand copy / taxonomy, not records — they describe the product, so they
// live here rather than in the database.

export const CORE_AMENITIES = [
  '24/7 Security',
  'Power Supply',
  'High-Speed WiFi',
  'Ample Parking',
  'Clean Water Supply',
]

export const WHY_HUGS = [
  {
    title: '24/7 Security',
    body: 'Manned entrances, round-the-clock watch.',
  },
  {
    title: 'Comfort, Considered',
    body: 'Warm interiors, premium bedding, soft light.',
  },
  {
    title: 'Everything Works',
    body: 'Backup power, fast WiFi, clean water — always.',
  },
  {
    title: 'Heart of Maryland',
    body: 'Minutes from Lagos dining and business.',
  },
]

// The backend URL. Required — without it the app cannot load data, and calls
// below surface a clear error so the UI can show a proper error state.
const API_URL = import.meta.env.VITE_API_URL || ''

// The backend speaks snake_case; the UI is written in camelCase. This maps a
// property row from the API into the shape the components expect.
function mapProperty(p) {
  if (!p) return null
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    location: p.location,
    area: p.area,
    pricePerNight: Number(p.price_per_night ?? p.pricePerNight ?? 0),
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.review_count ?? p.reviewCount ?? 0),
    maxGuests: Number(p.max_guests ?? p.maxGuests ?? 1),
    amenities: p.amenities ?? [],
    images: p.images ?? [],
    description: p.description ?? '',
    bookedRanges: [],
  }
}

async function apiGet(path) {
  if (!API_URL) throw new Error('The app is not configured (missing VITE_API_URL).')
  const res = await fetch(`${API_URL}${path}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed.')
  return data
}

async function apiSend(path, body, { method = 'POST' } = {}) {
  if (!API_URL) throw new Error('The app is not configured (missing VITE_API_URL).')
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed.')
  return data
}

export async function getListings() {
  const data = await apiGet('/api/properties')
  return (data.properties ?? []).map(mapProperty)
}

// A single apartment, with its taken date windows merged in. The property and
// its availability come from two endpoints; we fetch them together and turn the
// occupied ranges ({start,end}) into the { from, to } shape the UI reads.
export async function getListingById(id) {
  const [pRes, aRes] = await Promise.all([
    apiGet(`/api/properties/${id}`),
    apiGet(`/api/properties/${id}/availability`).catch(() => ({ occupied: [] })),
  ])
  const listing = mapProperty(pRes.property ?? pRes)
  if (listing) {
    listing.bookedRanges = (aRes.occupied ?? []).map((r) => ({
      from: r.start ?? r.from ?? r.check_in,
      to: r.end ?? r.to ?? r.check_out,
    }))
  }
  return listing
}

// Featured = the newest listings first (the backend already orders by creation).
export async function getFeaturedListings(count) {
  const all = await getListings()
  const n = count ?? Math.max(8, Math.ceil(all.length / 3))
  return all.slice(0, n)
}

// Validate a promo code before payment. Returns { ok, discount, label, code } —
// never throws on an invalid code, so callers can show a gentle inline message.
export async function validateDiscount({ code, subtotal, nights }) {
  const clean = (code || '').trim().toUpperCase()
  if (!clean) return { ok: false, error: 'Enter a code.' }
  try {
    const data = await apiSend('/api/discounts/validate', { code: clean, subtotal, nights })
    if (!data.ok) return { ok: false, error: data.error || 'That code isn’t valid.' }
    return { ok: true, code: clean, discount: Number(data.discount) || 0, label: data.label }
  } catch {
    return { ok: false, error: 'Could not check that code. Please try again.' }
  }
}

// Create a pending booking. The backend validates availability and computes all
// totals server-side (client totals are never trusted). Returns the booking row
// (snake_case) — its `id` is used to initialise payment.
export async function createBooking({
  propertyId,
  guestName,
  guestEmail,
  guestPhone,
  notes,
  checkIn,
  checkOut,
  guests,
  promoCode,
}) {
  const data = await apiSend('/api/bookings', {
    property_id: propertyId,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    notes: notes || undefined,
    check_in: checkIn,
    check_out: checkOut,
    guests,
    promo_code: promoCode || undefined,
  })
  return data.booking
}

// Look up a booking by its public reference (used on the payment-return page).
export async function getBookingByReference(reference) {
  const data = await apiGet(`/api/bookings/reference/${encodeURIComponent(reference)}`)
  return data.booking ?? null
}

// Submit guest feedback after checkout. The backend links it to the stay (via
// the reference), emails a thank-you, and stores it for the team.
export async function submitFeedback({ reference, name, email, rating, comment }) {
  await apiSend('/api/feedback', { reference, name, email, rating, comment })
  return { ok: true }
}

// Distinct, searchable locations (neighbourhoods within the city), derived from
// the live catalogue. Returns [] if the catalogue can't be reached.
export async function getLocations() {
  try {
    const listings = await getListings()
    return [...new Set(listings.map((l) => l.area).filter(Boolean))].sort()
  } catch {
    return []
  }
}

// Newsletter subscribe — the backend stores the address and sends a welcome.
export async function subscribeNewsletter(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  const data = await apiSend('/api/subscribe', { email })
  return { ok: true, email, message: data.message }
}

// Contact form — the backend emails the company and acknowledges the sender.
export async function submitContact({ name, email, phone, message }) {
  const data = await apiSend('/api/contact', { name, email, phone, message })
  return { ok: true, message: data.message }
}

// True when [checkIn, checkOut) does NOT overlap any of the apartment's booked
// ranges. Check-out is exclusive, so two stays may touch at the boundary (one
// guest checks out the morning another checks in). With no dates chosen we
// can't judge, so the apartment is treated as bookable.
export function isAvailableForRange(listing, checkIn, checkOut) {
  if (!checkIn || !checkOut) return true
  return !(listing.bookedRanges ?? []).some(
    (r) => checkIn < r.to && checkOut > r.from,
  )
}

// The booked ranges that clash with the requested stay — used to tell the guest
// exactly which dates are taken.
export function conflictingRanges(listing, checkIn, checkOut) {
  if (!checkIn || !checkOut) return []
  return (listing.bookedRanges ?? []).filter(
    (r) => checkIn < r.to && checkOut > r.from,
  )
}

// Homepage testimonials = genuine 5-star guest reviews from the backend. Never
// throws: on any error it returns [], so the section quietly hides.
export async function getTestimonials() {
  try {
    const data = await apiGet('/api/feedback/highlights')
    return data.testimonials ?? []
  } catch {
    return []
  }
}

export function getWhyHugs() {
  return WHY_HUGS
}

export function getCoreAmenities() {
  return CORE_AMENITIES
}

export function getListingTypes() {
  return ['Studio', '1-Bedroom', '2-Bedroom', 'Penthouse']
}
