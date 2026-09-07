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
    pricePerNight,
    rating,
    reviewCount,
    maxGuests,
    images,
  } = listing

  return (
    <Link
      to={`/listings/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border-t-2 border-gold bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum/10"
    >
      {/* Clean image — no overlays. The type lives in the body below. */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0]}
          alt={`${name} — placeholder`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gold sm:text-[10px]">
          {type}
        </span>
        <div className="mt-0.5 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-serif text-sm font-semibold text-ink transition-colors group-hover:text-plum sm:text-base">
            {name}
          </h3>
          <span className="hidden shrink-0 sm:block">
            <Rating value={rating} count={reviewCount} />
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/55">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {area}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-gold" />
            {maxGuests}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="text-ink">
            <span className="font-serif text-base font-bold text-plum sm:text-lg">
              {formatNaira(pricePerNight)}
            </span>
            <span className="text-[11px] text-ink/50"> /night</span>
          </p>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.15em] text-gold transition-colors group-hover:text-plum sm:inline">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
