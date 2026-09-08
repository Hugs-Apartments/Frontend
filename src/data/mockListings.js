// Mock dataset for Hugs Luxury Apartments.
// NOTE: images are placeholder URLs — swap for real property photography later.
// All data-driven UI reads through the service functions at the bottom of this
// file so this can be replaced with a real API with minimal changes.

const img = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const CORE_AMENITIES = [
  '24/7 Security',
  'Power Supply',
  'High-Speed WiFi',
  'Ample Parking',
  'Clean Water Supply',
]

// Each apartment carries its own `bookedRanges` — the date windows that are
// already taken. A stay is bookable for any dates that DON'T overlap one of
// these ranges (check-out is exclusive, so a new guest can arrive the same day
// the previous one leaves). There is no global "available/booked" flag: an
// apartment is only unavailable relative to the specific nights requested.
export const LISTINGS = [
  {
    id: 'hugs-001',
    name: 'The Plum Suite',
    type: 'Studio',
    location: 'Maryland, Lagos',
    area: 'Mende',
    pricePerNight: 85000,
    rating: 4.9,
    reviewCount: 128,
    maxGuests: 2,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Kitchenette'],
    images: [img('hugs1a'), img('hugs1b'), img('hugs1c'), img('hugs1d')],
    description:
      'A warm, light-filled studio designed for couples and solo travellers. Champagne curtains, a plush leather headboard and soft ambient lighting make it feel like home from the moment you step in.',
    bookedRanges: [{ from: '2026-09-14', to: '2026-09-18' }],
  },
  {
    id: 'hugs-002',
    name: 'Champagne One-Bedroom',
    type: '1-Bedroom',
    location: 'Maryland, Lagos',
    area: 'Mende',
    pricePerNight: 120000,
    rating: 4.8,
    reviewCount: 96,
    maxGuests: 3,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Workspace'],
    images: [img('hugs2a'), img('hugs2b'), img('hugs2c'), img('hugs2d')],
    description:
      'An elegant one-bedroom retreat with an olive-green velvet sofa, a full kitchen and a dedicated workspace. Ideal for business travellers who refuse to compromise on comfort.',
    bookedRanges: [],
  },
  {
    id: 'hugs-003',
    name: 'The Gold Two-Bedroom',
    type: '2-Bedroom',
    location: 'Maryland, Lagos',
    area: 'Anthony',
    pricePerNight: 180000,
    rating: 5.0,
    reviewCount: 74,
    maxGuests: 5,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Washer', 'Balcony'],
    images: [img('hugs3a'), img('hugs3b'), img('hugs3c'), img('hugs3d')],
    description:
      'Spacious two-bedroom apartment with warm-toned interiors, a private balcony and a full kitchen. Perfect for families or small groups seeking space and serenity.',
    bookedRanges: [
      { from: '2026-09-20', to: '2026-09-25' },
      { from: '2026-10-05', to: '2026-10-09' },
    ],
  },
  {
    id: 'hugs-004',
    name: 'Maryland Penthouse',
    type: 'Penthouse',
    location: 'Maryland, Lagos',
    area: 'Ikorodu Road',
    pricePerNight: 350000,
    rating: 5.0,
    reviewCount: 52,
    maxGuests: 6,
    amenities: [
      ...CORE_AMENITIES,
      'Smart TV',
      'Air Conditioning',
      'Full Kitchen',
      'Washer',
      'Private Balcony',
      'City View',
      'Concierge',
    ],
    images: [img('hugs4a'), img('hugs4b'), img('hugs4c'), img('hugs4d')],
    description:
      'Our signature penthouse — floor-to-ceiling views over Maryland, a sweeping living space and concierge service on call. The definitive statement in Lagos short-let luxury.',
    bookedRanges: [{ from: '2026-09-08', to: '2026-09-13' }],
  },
  {
    id: 'hugs-005',
    name: 'The Velvet Studio',
    type: 'Studio',
    location: 'Maryland, Lagos',
    area: 'Mende',
    pricePerNight: 78000,
    rating: 4.7,
    reviewCount: 141,
    maxGuests: 2,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Kitchenette'],
    images: [img('hugs5a'), img('hugs5b'), img('hugs5c'), img('hugs5d')],
    description:
      'Cosy and refined, with a soft-glow palette and thoughtful finishes throughout. A quiet base for a restful stay in the heart of Maryland.',
    bookedRanges: [
      { from: '2026-09-05', to: '2026-09-30' },
      { from: '2026-10-10', to: '2026-10-14' },
    ],
  },
  {
    id: 'hugs-006',
    name: 'Anthony One-Bedroom',
    type: '1-Bedroom',
    location: 'Maryland, Lagos',
    area: 'Anthony',
    pricePerNight: 110000,
    rating: 4.6,
    reviewCount: 63,
    maxGuests: 3,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Full Kitchen'],
    images: [img('hugs6a'), img('hugs6b'), img('hugs6c'), img('hugs6d')],
    description:
      'A bright, contemporary one-bedroom with a generous living area and warm interior styling. Close to the best of Maryland dining and nightlife.',
    bookedRanges: [],
  },
  {
    id: 'hugs-007',
    name: 'The Serene Two-Bedroom',
    type: '2-Bedroom',
    location: 'Maryland, Lagos',
    area: 'Mende',
    pricePerNight: 165000,
    rating: 4.9,
    reviewCount: 88,
    maxGuests: 4,
    amenities: [...CORE_AMENITIES, 'Smart TV', 'Air Conditioning', 'Full Kitchen', 'Balcony'],
    images: [img('hugs7a'), img('hugs7b'), img('hugs7c'), img('hugs7d')],
    description:
      'Understated luxury across two bedrooms, styled in champagne and deep plum tones. A calm sanctuary for families and longer stays.',
    bookedRanges: [{ from: '2026-10-01', to: '2026-10-06' }],
  },
  {
    id: 'hugs-008',
    name: 'The Skyline Penthouse',
    type: 'Penthouse',
    location: 'Maryland, Lagos',
    area: 'Ikorodu Road',
    pricePerNight: 320000,
    rating: 4.9,
    reviewCount: 41,
    maxGuests: 6,
    amenities: [
      ...CORE_AMENITIES,
      'Smart TV',
      'Air Conditioning',
      'Full Kitchen',
      'Washer',
      'Private Balcony',
      'City View',
    ],
    images: [img('hugs8a'), img('hugs8b'), img('hugs8c'), img('hugs8d')],
    description:
      'Expansive penthouse living with panoramic views and premium finishes throughout. Designed for those who want to arrive and simply exhale.',
    bookedRanges: [{ from: '2026-09-22', to: '2026-09-28' }],
  },
]

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Adaeze O.',
    location: 'Abuja',
    rating: 5,
    text: 'From the gold-lit entrance to the spotless kitchen, everything felt considered. The 24/7 security let me sleep easy. Truly felt at home.',
  },
  {
    id: 't2',
    name: 'Tunde A.',
    location: 'London',
    rating: 5,
    text: 'I book Hugs every time I am in Lagos for work. Fast WiFi, uninterrupted power, and a workspace that actually works. Faultless.',
  },
  {
    id: 't3',
    name: 'Chioma & David',
    location: 'Port Harcourt',
    rating: 5,
    text: 'We stayed in the Gold Two-Bedroom for our anniversary. Warm, elegant and so comfortable. We are already planning our return.',
  },
  {
    id: 't4',
    name: 'Fatima B.',
    location: 'Lagos',
    rating: 5,
    text: 'The penthouse view is unreal and the concierge sorted everything. This is how short-let should feel. Highly recommend.',
  },
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

// ---------------------------------------------------------------------------
// Data-service layer. Currently returns mock data with simulated latency, but
// all UI reads through these functions so swapping in a real API later means
// editing only this file (point fetch at VITE_API_URL). No Supabase keys ever
// live in the frontend — all database access happens on the backend.
// ---------------------------------------------------------------------------

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

// When VITE_API_URL is set the service layer talks to the real backend;
// otherwise it returns mock data. No Supabase keys ever live in the frontend.
const API_URL = import.meta.env.VITE_API_URL || ''

// The backend speaks snake_case; the UI is written in camelCase. This maps a
// property row from the API into the shape the components expect. Booked ranges
// come from the backend's occupancy endpoint keyed as { from, to }.
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
    bookedRanges: (p.booked_ranges ?? p.bookedRanges ?? []).map((r) => ({
      from: r.from ?? r.check_in,
      to: r.to ?? r.check_out,
    })),
  }
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed.')
  return data
}

export async function getListings() {
  if (API_URL) {
    const data = await apiGet('/api/properties')
    return (data.properties ?? []).map(mapProperty)
  }
  await delay()
  return LISTINGS
}

export async function getListingById(id) {
  if (API_URL) {
    const data = await apiGet(`/api/properties/${id}`)
    return mapProperty(data.property ?? data)
  }
  await delay()
  return LISTINGS.find((l) => l.id === id) ?? null
}

// Featured = the newest listings first. The backend returns properties ordered
// by creation; in mock mode we reverse so the most recently added seed shows up
// at the front. Falls back to a sensible count so the grid never looks sparse.
export async function getFeaturedListings(count) {
  if (API_URL) {
    const all = await getListings()
    const n = count ?? Math.max(8, Math.ceil(all.length / 3))
    return all.slice(0, n)
  }
  await delay()
  const n = count ?? Math.max(8, Math.ceil(LISTINGS.length / 3))
  return [...LISTINGS].reverse().slice(0, n)
}

// Validate a promo code against the backend before payment. Returns
// { ok, discount, label, code } — never throws on an invalid code, so callers
// can show a gentle inline message. In mock mode a small built-in table is used.
export async function validateDiscount({ code, subtotal, nights }) {
  const clean = (code || '').trim().toUpperCase()
  if (!clean) return { ok: false, error: 'Enter a code.' }

  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, subtotal, nights }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) return { ok: false, error: data.error || 'That code isn’t valid.' }
      return { ok: true, code: clean, discount: Number(data.discount) || 0, label: data.label }
    } catch {
      return { ok: false, error: 'Could not check that code. Please try again.' }
    }
  }

  // Mock validation mirrors the admin seed codes.
  await delay(300)
  const MOCK = {
    WELCOME10: { type: 'percent', value: 10, min_nights: 0 },
    STAY3PLUS: { type: 'percent', value: 15, min_nights: 3 },
  }
  const row = MOCK[clean]
  if (!row) return { ok: false, error: 'That code isn’t valid.' }
  if (nights < (row.min_nights || 0)) return { ok: false, error: `Requires at least ${row.min_nights} nights.` }
  const discount = row.type === 'percent'
    ? Math.round((subtotal * row.value) / 100)
    : Math.min(row.value, subtotal)
  const label = row.type === 'percent' ? `${row.value}% off` : `₦${row.value.toLocaleString()} off`
  return { ok: true, code: clean, discount, label }
}

// Submit guest feedback after checkout. Posts to the backend when configured;
// mocks a success otherwise so the form works standalone.
export async function submitFeedback({ reference, name, email, rating, comment }) {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, guest_name: name, guest_email: email, rating, comment }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Could not submit your feedback.')
    return { ok: true }
  }
  await delay(500)
  return { ok: true }
}

// Distinct, searchable locations derived from the catalogue (neighbourhoods
// within the city). In a real deployment these come from the database.
export function getLocations() {
  const set = new Set(LISTINGS.map((l) => l.area))
  return [...set].sort()
}

// Newsletter subscribe. Posts to the backend /api/subscribe when configured
// (the backend stores the address and sends a welcome email); mocks otherwise.
export async function subscribeNewsletter(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Subscription failed. Please try again.')
    return { ok: true, email, message: data.message }
  }
  await delay(500)
  return { ok: true, email }
}

// Contact form. Posts to the backend /api/contact when configured — the backend
// emails the company AND sends the sender an acknowledgement. Mocks otherwise
// so the form still works standalone.
export async function submitContact({ name, email, phone, message }) {
  if (API_URL) {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Could not send your message. Please try again.')
    return { ok: true, message: data.message }
  }
  await delay(500)
  return { ok: true }
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

// The booked ranges that clash with the requested stay — used to tell the
// guest exactly which dates are taken.
export function conflictingRanges(listing, checkIn, checkOut) {
  if (!checkIn || !checkOut) return []
  return (listing.bookedRanges ?? []).filter(
    (r) => checkIn < r.to && checkOut > r.from,
  )
}

export async function getTestimonials() {
  await delay(150)
  return TESTIMONIALS
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

export function getAllAmenities() {
  const set = new Set()
  LISTINGS.forEach((l) => l.amenities.forEach((a) => set.add(a)))
  return [...set]
}
