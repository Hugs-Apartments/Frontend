// Mock dataset for Hugs Luxury Apartments.
// NOTE: images are placeholder URLs — swap for real property photography later.
// All data-driven UI reads through src/services/listings.js so this can be
// replaced with a real API with minimal changes.

const img = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const CORE_AMENITIES = [
  '24/7 Security',
  'Power Supply',
  'High-Speed WiFi',
  'Ample Parking',
  'Clean Water Supply',
]

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
    available: true,
    availableDates: [{ from: '2026-09-10', to: '2026-10-30' }],
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
    available: true,
    availableDates: [{ from: '2026-09-08', to: '2026-11-15' }],
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
    available: true,
    availableDates: [{ from: '2026-09-12', to: '2026-12-01' }],
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
    available: true,
    availableDates: [{ from: '2026-09-20', to: '2026-12-20' }],
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
    available: false,
    availableDates: [{ from: '2026-11-01', to: '2026-12-15' }],
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
    available: true,
    availableDates: [{ from: '2026-09-05', to: '2026-10-25' }],
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
    available: true,
    availableDates: [{ from: '2026-09-14', to: '2026-11-30' }],
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
    available: true,
    availableDates: [{ from: '2026-09-18', to: '2026-12-10' }],
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
    title: 'Round-the-clock Security',
    body: 'Manned entrances and 24/7 surveillance so you can relax completely, day or night.',
  },
  {
    title: 'Comfort, Considered',
    body: 'Warm interiors, premium bedding and soft-glow lighting in every apartment.',
  },
  {
    title: 'Everything Just Works',
    body: 'Backup power, high-speed WiFi and clean water supply — no interruptions, ever.',
  },
  {
    title: 'Heart of Maryland',
    body: 'Minutes from the best of Maryland, Lagos — dining, business and the city beyond.',
  },
]

// ---------------------------------------------------------------------------
// Data-service layer. Currently returns mock data with simulated latency, but
// all UI reads through these functions so swapping in a real API (Supabase)
// later means only editing this file + src/lib/supabaseClient.js.
// ---------------------------------------------------------------------------

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

export async function getListings() {
  await delay()
  return LISTINGS
}

export async function getListingById(id) {
  await delay()
  return LISTINGS.find((l) => l.id === id) ?? null
}

export async function getFeaturedListings(count = 4) {
  await delay()
  return LISTINGS.filter((l) => l.available).slice(0, count)
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
