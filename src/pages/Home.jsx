import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Sparkles, Zap, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [featured, setFeatured] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const amenities = getCoreAmenities()
  const why = getWhyHugs()

  useEffect(() => {
    getFeaturedListings(4).then(setFeatured)
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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
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
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length]
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-gold/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={testimonials} />

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

function TestimonialsCarousel({ testimonials }) {
  const scroller = useRef(null)

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Guest Stories"
          title="Loved by our guests"
          align="left"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-plum/20 text-plum transition-colors hover:bg-plum hover:text-white"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-plum/20 text-plum transition-colors hover:bg-plum hover:text-white"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {testimonials.map((t) => (
          <div key={t.id} className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </section>
  )
}
