import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Sparkles, Zap, MapPin, ArrowRight } from 'lucide-react'
import Hero from '../components/Hero.jsx'
import ListingCard from '../components/ListingCard.jsx'
import AmenityBadge from '../components/AmenityBadge.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import { SectionHeading, Button } from '../components/ui.jsx'
import {
  getFeaturedListings,
  getTestimonials,
  getCoreAmenities,
  getWhyHugs,
} from '../data/mockListings.js'

const WHY_ICONS = [ShieldCheck, Sparkles, Zap, MapPin]

export default function Home() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [featured, setFeatured] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [featuredError, setFeaturedError] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const amenities = getCoreAmenities()
  const why = getWhyHugs()

  // A guest returning from the (simulated) Paystack checkout can land on the
  // site root with ?reference=… — forward them to the callback page to verify.
  useEffect(() => {
    if (params.get('reference')) {
      navigate(`/payment/callback?${params.toString()}`, { replace: true })
    }
  }, [params, navigate])

  useEffect(() => {
    getFeaturedListings()
      .then((data) => {
        setFeatured(data)
        setFeaturedLoading(false)
      })
      .catch(() => {
        setFeaturedError(true)
        setFeaturedLoading(false)
      })
    getTestimonials().then(setTestimonials)
  }, [])

  return (
    <>
      <Hero />

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured Apartments"
          subtitle="A selection of our most-loved stays, each styled in warm plum and gold."
        />
        {featuredLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-ink/5" />
            ))}
          </div>
        ) : featuredError ? (
          <p className="mt-12 text-center text-ink/50">
            We couldn’t load apartments just now. Please refresh to try again.
          </p>
        ) : featured.length === 0 ? (
          <p className="mt-12 text-center text-ink/50">
            New apartments are on their way — check back soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <Button to="/listings" variant="dark" size="lg">
            View all apartments <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Amenities strip */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Every Stay Includes"
            title="Comfort, Guaranteed"
            subtitle="The essentials, always handled — so you can simply relax."
          />
          <div className="mt-12 flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
            {amenities.map((a) => (
              <AmenityBadge key={a} name={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Hugs */}
      <section className="bg-plum py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Why Hugs"
            title="The Hugs Difference"
            dark
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {why.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length]
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-gold/40 sm:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-serif text-base font-semibold text-white sm:mt-5 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70 sm:mt-2 sm:text-sm">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials — shown only once real guest reviews exist */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

      {/* CTA */}
      <section className="bg-plum-dark py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Your Lagos home awaits
          </h2>
          <span className="gold-rule mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Book a stay in minutes. Secure, comfortable and effortlessly elegant.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/listings" size="lg">
              Explore Apartments <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function Testimonials({ testimonials }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Guest Stories"
        title="Loved by our guests"
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
    </section>
  )
}
