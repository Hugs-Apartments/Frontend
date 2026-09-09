import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import ListingCard from '../components/ListingCard.jsx'
import { AmenityIcon } from '../components/AmenityBadge.jsx'
import { SectionHeading, Button, Rating } from '../components/ui.jsx'
import { Link } from 'react-router-dom'
import {
  getListings,
  getListingTypes,
  getCoreAmenities,
  isAvailableForRange,
} from '../data/mockListings.js'
import { formatNaira, formatDateLong } from '../utils/format.js'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const PRICE_MAX = 400000

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const types = getListingTypes()
  const coreAmenities = getCoreAmenities()
  // Locations are the distinct neighbourhoods across the live catalogue.
  const locations = useMemo(
    () => [...new Set(listings.map((l) => l.area).filter(Boolean))].sort(),
    [listings],
  )

  const [selectedTypes, setSelectedTypes] = useState([])
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [minGuests, setMinGuests] = useState(1)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    getListings()
      .then((data) => {
        setListings(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const guestsFromSearch = Number(searchParams.get('guests')) || null
  const locationFromSearch = searchParams.get('location') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const hasDates = Boolean(checkIn && checkOut)

  useEffect(() => {
    if (guestsFromSearch) setMinGuests(guestsFromSearch)
  }, [guestsFromSearch])

  useEffect(() => {
    setLocation(locationFromSearch)
  }, [locationFromSearch])

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const filtered = useMemo(() => {
    let out = listings.filter((l) => {
      if (location && l.area !== location) return false
      if (selectedTypes.length && !selectedTypes.includes(l.type)) return false
      if (l.pricePerNight > maxPrice) return false
      if (l.maxGuests < minGuests) return false
      if (hasDates && !isAvailableForRange(l, checkIn, checkOut)) return false
      if (selectedAmenities.length && !selectedAmenities.every((a) => l.amenities.includes(a)))
        return false
      return true
    })
    out = [...out]
    if (sort === 'price-asc') out.sort((a, b) => a.pricePerNight - b.pricePerNight)
    else if (sort === 'price-desc') out.sort((a, b) => b.pricePerNight - a.pricePerNight)
    else if (sort === 'rating') out.sort((a, b) => b.rating - a.rating)
    return out
  }, [listings, location, selectedTypes, maxPrice, minGuests, selectedAmenities, sort, hasDates, checkIn, checkOut])

  const clearAll = () => {
    setSelectedTypes([])
    setMaxPrice(PRICE_MAX)
    setMinGuests(1)
    setSelectedAmenities([])
    setLocation('')
  }

  const activeCount =
    selectedTypes.length +
    selectedAmenities.length +
    (location ? 1 : 0) +
    (maxPrice < PRICE_MAX ? 1 : 0) +
    (minGuests > 1 ? 1 : 0)

  const FilterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-ink">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-plum">
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Location</legend>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-3 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-sm text-ink/70 outline-none focus:border-gold"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </fieldset>

      {/* Type */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Apartment type</legend>
        <div className="mt-3 space-y-2">
          {types.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={selectedTypes.includes(t)}
                onChange={() => toggle(selectedTypes, setSelectedTypes, t)}
                className="h-4 w-4 accent-plum"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Max price / night</legend>
        <input
          type="range"
          min={70000}
          max={PRICE_MAX}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-plum"
        />
        <p className="mt-1 text-sm text-ink/60">Up to {formatNaira(maxPrice)}</p>
      </fieldset>

      {/* Guests */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Guests</legend>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setMinGuests(g)}
              className={`h-9 w-9 rounded-full border text-sm transition-colors ${
                minGuests === g
                  ? 'border-plum bg-plum text-white'
                  : 'border-ink/20 text-ink/60 hover:border-gold'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Amenities */}
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Amenities</legend>
        <div className="mt-3 space-y-2">
          {coreAmenities.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a)}
                onChange={() => toggle(selectedAmenities, setSelectedAmenities, a)}
                className="h-4 w-4 accent-plum"
              />
              <span className="text-gold"><AmenityIcon name={a} className="h-4 w-4" /></span>
              {a}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <div className="bg-offwhite">
      {/* Page header */}
      <div className="bg-plum pt-28 pb-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Maryland, Lagos" title="Our Apartments" dark align="left" />
          <p className="mt-4 max-w-xl text-white/70">
            Browse our full collection of serviced apartments. Every stay includes our five core comforts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border-t-2 border-gold bg-white p-6 shadow-sm">
            {FilterPanel}
          </div>
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink/60">
              {error ? 'Unavailable' : loading ? 'Loading…' : `${filtered.length} apartment${filtered.length !== 1 ? 's' : ''}`}
              {!loading && !error && hasDates && (
                <span className="text-ink/45"> · {formatDateLong(checkIn)} → {formatDateLong(checkOut)}</span>
              )}
              {!loading && !error && location && <span className="text-ink/45"> · {location}</span>}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm text-ink/70 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeCount > 0 && (
                  <span className="ml-1 rounded-full bg-plum px-1.5 text-xs text-white">{activeCount}</span>
                )}
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-ink/20 bg-white px-4 py-2 text-sm text-ink/70 outline-none focus:border-gold"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <div className="hidden items-center gap-1 rounded-full border border-ink/20 p-1 sm:flex">
                <button
                  onClick={() => setView('grid')}
                  className={`rounded-full p-1.5 ${view === 'grid' ? 'bg-plum text-white' : 'text-ink/50'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`rounded-full p-1.5 ${view === 'list' ? 'bg-plum text-white' : 'text-ink/50'}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {error ? (
            <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-16 text-center">
              <p className="font-serif text-xl text-ink">We couldn’t load apartments</p>
              <p className="mt-2 text-sm text-ink/60">
                Something went wrong reaching our booking service. Please try again.
              </p>
              <Button as="button" onClick={() => window.location.reload()} variant="dark" size="md" className="mt-6">
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-xl bg-ink/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-16 text-center">
              <p className="font-serif text-xl text-ink">No apartments match your filters</p>
              <p className="mt-2 text-sm text-ink/60">Try widening your search.</p>
              <Button as="button" onClick={clearAll} variant="dark" size="md" className="mt-6">
                Clear filters
              </Button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((l) => (
                <ListingRow key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-white p-6">
            <div className="mb-4 flex justify-end">
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="h-6 w-6 text-ink" />
              </button>
            </div>
            {FilterPanel}
            <Button as="button" onClick={() => setShowFilters(false)} size="lg" className="mt-8 w-full">
              Show {filtered.length} results
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ListingRow({ listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border-t-2 border-gold bg-white shadow-sm transition-all hover:shadow-lg sm:flex-row sm:border-l-2 sm:border-t-0"
    >
      <div className="aspect-[4/3] sm:aspect-auto sm:w-64 sm:shrink-0">
        <img
          src={listing.images[0]}
          alt={`${listing.name} — placeholder`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">{listing.type}</span>
            <h3 className="font-serif text-xl font-semibold text-ink group-hover:text-plum">{listing.name}</h3>
          </div>
          <Rating value={listing.rating} count={listing.reviewCount} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ink/60">{listing.description}</p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p>
            <span className="font-serif text-2xl font-bold text-plum">{formatNaira(listing.pricePerNight)}</span>
            <span className="text-sm text-ink/50"> / night</span>
          </p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold group-hover:text-plum">View →</span>
        </div>
      </div>
    </Link>
  )
}
