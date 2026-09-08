import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import AmenityBadge from '../components/AmenityBadge.jsx'
import { SectionHeading, Button } from '../components/ui.jsx'
import { getCoreAmenities, getWhyHugs } from '../data/mockListings.js'

const WHATSAPP = '+234 909 215 7050'

export default function About() {
  const amenities = getCoreAmenities()
  const why = getWhyHugs()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-plum pt-32 pb-20">
        <img
          src="https://picsum.photos/seed/hugsabout/1920/900"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Our Story</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
            Where luxury feels like a warm embrace
          </h1>
          <span className="gold-rule mt-5" />
          <p className="mx-auto mt-5 max-w-2xl text-white/75">
            Hugs Luxury Apartments began with a simple idea — that a short stay in
            Lagos should feel as warm, secure and effortless as coming home. From
            our base in Maryland, we craft spaces that wrap you in comfort.
          </p>
        </div>
      </section>

      {/* Story blurb */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-t-2 border-gold shadow-lg lg:max-w-md">
            <img src="https://picsum.photos/seed/hugsinterior/900/700" alt="Apartment interior — placeholder" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow="Live Luxury. Feel at Home." title="Considered in every detail" align="left" />
            <p className="mt-5 leading-relaxed text-ink/75">
              Every apartment is styled in our signature palette of deep plum and
              warm gold, with leather headboards, olive-green velvet and champagne
              tones throughout. But beauty is only half the story.
            </p>
            <p className="mt-4 leading-relaxed text-ink/75">
              We obsess over the things that make a stay effortless — round-the-clock
              security, uninterrupted power, fast WiFi and spotless interiors. So you
              can focus on why you came to Lagos, not the logistics.
            </p>
            <Button to="/listings" variant="dark" size="lg" className="mt-8">
              Explore apartments <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Amenities recap */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Always Included" title="Our Five Core Comforts" />
          <div className="mt-12 flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
            {amenities.map((a) => (
              <AmenityBadge key={a} name={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-plum py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="What We Stand For" title="The Hugs Promise" dark />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
            {why.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
                <h3 className="font-serif text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-plum-dark py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Have a question?</h2>
          <span className="gold-rule mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Chat with our team on WhatsApp — we’re happy to help you find the perfect stay.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`} size="lg">
              <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
            </Button>
            <Button to="/contact" variant="outline" size="lg">Contact page</Button>
          </div>
        </div>
      </section>
    </>
  )
}
