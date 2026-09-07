import { Link } from 'react-router-dom'
import { Users, MapPin } from 'lucide-react'
import { Rating } from './ui.jsx'
import { formatNaira } from '../utils/format.js'

export default function ListingCard({ listing }) {
  const {
    id,
    name,
    type,
    area,
    location,
    pricePerNight,
    rating,
    reviewCount,
    maxGuests,
    images,
    available,
  } = listing

  return (
    <Link
      to={`/listings/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border-t-2 border-gold bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0]}
          alt={`${name} — placeholder`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-plum/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold backdrop-blur">
          {type}
        </span>
        <span
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur ${
            available ? 'bg-available/90 text-white' : 'bg-ink/70 text-white/90'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-white' : 'bg-white/70'}`} />
          {available ? 'Available' : 'Booked'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold text-ink transition-colors group-hover:text-plum">
            {name}
          </h3>
          <Rating value={rating} count={reviewCount} />
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gold" />
            {area}, {location.split(',')[0]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold" />
            {maxGuests} guests
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-ink">
            <span className="font-serif text-2xl font-bold text-plum">
              {formatNaira(pricePerNight)}
            </span>
            <span className="text-sm text-ink/50"> / night</span>
          </p>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold transition-colors group-hover:text-plum">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
