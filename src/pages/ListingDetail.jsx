import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react'
import { BookingPanel } from '../components/BookingWidget.jsx'
import { AmenityChip } from '../components/AmenityBadge.jsx'
import { Rating, Button } from '../components/ui.jsx'
import { getListingById } from '../data/mockListings.js'

// Turn whatever the admin pasted into an embeddable Google Maps src (no API key
// needed — Google's `output=embed` endpoint frames fine). Handles: an already-
// embeddable URL, a place URL with @lat,lng, a bare "lat,lng", a ?q=/query=
// param, a /maps/place/<name> path, or a plain address/place string. Returns
// null when it's an http link we can't safely turn into an embed (e.g. a
// maps.app.goo.gl short link) — the caller then shows an "open in Maps" link.
function mapEmbedSrc(raw) {
  if (!raw) return null
  const url = String(raw).trim()
  if (!url) return null
  if (/output=embed/i.test(url) || /\/maps\/embed/i.test(url)) return url

  const q = (v) => `https://www.google.com/maps?q=${encodeURIComponent(v)}&output=embed`

  const at = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (at) return q(`${at[1]},${at[2]}`)

  const bare = url.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (bare) return q(`${bare[1]},${bare[2]}`)

  try {
    const u = new URL(url)
    const param = u.searchParams.get('q') || u.searchParams.get('query')
    if (param) return q(param)
    const place = u.pathname.match(/\/maps\/place\/([^/]+)/)
    if (place) return q(decodeURIComponent(place[1]).replace(/\+/g, ' '))
    return null // a URL (e.g. short link) we can't turn into an embed
  } catch {
    return q(url) // not a URL — treat it as an address / place query
  }
}

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState(undefined) // undefined=loading, null=not found
  const [active, setActive] = useState(0)

  useEffect(() => {
    getListingById(id).then(setListing).catch(() => setListing(null))
  }, [id])

  if (listing === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8">
        <div className="h-[60vh] animate-pulse rounded-2xl bg-ink/5" />
      </div>
    )
  }

  if (listing === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-40 pb-24 text-center sm:px-8">
        <h1 className="font-serif text-3xl font-semibold text-ink">Apartment not found</h1>
        <p className="mt-3 text-ink/60">This listing may have been removed.</p>
        <Button to="/listings" variant="dark" size="lg" className="mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to apartments
        </Button>
      </div>
    )
  }

  const images = listing.images
  const mapSrc = mapEmbedSrc(listing.mapUrl)
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length)
  const next = () => setActive((a) => (a + 1) % images.length)

  return (
    <div className="bg-offwhite pt-24">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-plum"
        >
          <ArrowLeft className="h-4 w-4" /> All apartments
        </Link>

        {/* Header — the apartment type sits here as an eyebrow; availability is
            judged per-date inside the booking panel, not shown as a global badge. */}
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            {listing.type}
          </span>
          <h1 className="mt-1 font-serif text-4xl font-bold text-ink">{listing.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-ink/60">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" /> {listing.area}, {listing.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold" /> Up to {listing.maxGuests} guests
            </span>
            <Rating value={listing.rating} count={listing.reviewCount} />
          </div>
        </div>

        {/* Gallery + booking panel + details.
            md and up: gallery/details stack on the left with the booking panel
            sitting BESIDE the image on the right (spanning full height, sticky).
            Below md (phones): everything stacks, booking directly under the image. */}
        <div className="mt-8 flex flex-col gap-8 md:grid md:grid-cols-[1.5fr_1fr] md:items-start">
          {/* Gallery */}
          <div className="order-1 md:col-start-1 md:row-start-1">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <img
                src={images[active]}
                alt={`${listing.name} — placeholder ${active + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-plum shadow hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-plum shadow hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-plum/80 px-3 py-1 text-xs text-white backdrop-blur">
                Placeholder image
              </span>
            </div>

            {/* Thumbnails under the main picture */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                    i === active ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Booking panel — beside the image (md+), directly under it on phones */}
          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-3 md:sticky md:top-24 md:self-start">
            <BookingPanel listing={listing} />
            <ul className="mt-5 space-y-2 text-sm text-ink/60">
              {['Free cancellation up to 48h', 'Instant confirmation', 'Verified & secure'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-available" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div className="order-3 md:col-start-1 md:row-start-2">
            <h2 className="font-serif text-2xl font-semibold text-ink">About this apartment</h2>
            <span className="gold-rule mt-3 block !w-16" />
            <p className="mt-5 leading-relaxed text-ink/75">{listing.description}</p>

            <h3 className="mt-10 font-serif text-2xl font-semibold text-ink">What this place offers</h3>
            <span className="gold-rule mt-3 block !w-16" />
            <div className="mt-5 flex flex-wrap gap-3">
              {listing.amenities.map((a) => (
                <AmenityChip key={a} name={a} />
              ))}
            </div>
          </div>

          {/* Location blurb + map — the map only appears when the listing has a
              map link; otherwise just the text blurb shows (no empty box). */}
          <div className="order-4 md:col-start-1 md:row-start-3">
            <h3 className="font-serif text-2xl font-semibold text-ink">Where you’ll be</h3>
            <span className="gold-rule mt-3 block !w-16" />
            <p className="mt-5 text-ink/75">
              Located in {listing.area}, {listing.location} — close to dining, business hubs and
              major routes across the city.
            </p>
            {mapSrc ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10">
                <iframe
                  src={mapSrc}
                  title={`Map — ${listing.name}`}
                  className="block aspect-[16/7] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : listing.mapUrl ? (
              <a
                href={listing.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-plum transition-colors hover:border-gold"
              >
                <MapPin className="h-4 w-4 text-gold" /> Open location in Google Maps
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
