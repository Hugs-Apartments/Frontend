import { SearchWidget } from './BookingWidget.jsx'

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-plum">
      {/* Background image (placeholder) with plum wash */}
      <img
        src="https://picsum.photos/seed/hugshero/1920/1200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-plum-dark/85 via-plum/80 to-plum-dark/95" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:px-8">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Live Luxury.
            <br />
            <span className="italic text-gold">Feel at Home.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Premium serviced apartments where warmth meets refinement. Secure,
            seamless and styled for the way you want to stay.
          </p>
        </div>

        <div className="mt-10">
          <SearchWidget />
        </div>
      </div>
    </section>
  )
}
