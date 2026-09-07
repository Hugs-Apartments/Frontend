import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react'
import { BookingPanel } from '../components/BookingWidget.jsx'
import { AmenityChip } from '../components/AmenityBadge.jsx'
import { Rating, Button } from '../components/ui.jsx'
import { getListingById } from '../data/mockListings.js'

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState(undefined) // undefined=loading, null=not found
  const [active, setActive] = useState(0)

  useEffect(() => {
    getListingById(id).then(setListing)
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

          {/* Location blurb + map placeholder — always last */}
          <div className="order-4 md:col-start-1 md:row-start-3">
            <h3 className="font-serif text-2xl font-semibold text-ink">Where you’ll be</h3>
            <span className="gold-rule mt-3 block !w-16" />
            <p className="mt-5 text-ink/75">
              Located in {listing.area}, {listing.location} — close to dining, business hubs and
              major routes across the city.
            </p>
            <div className="mt-5 flex aspect-[16/7] items-center justify-center rounded-2xl border border-ink/10 bg-plum/5">
              <span className="inline-flex items-center gap-2 text-sm text-ink/50">
                <MapPin className="h-5 w-5 text-gold" /> Map placeholder
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
