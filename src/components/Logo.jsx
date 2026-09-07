import { Link } from 'react-router-dom'

// Monogram + wordmark. `variant` controls color for dark vs light backgrounds.
export default function Logo({ variant = 'onDark', className = '' }) {
  const wordColor = variant === 'onDark' ? 'text-white' : 'text-plum'

  return (
    <Link
      to="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Hugs Luxury Apartments — home"
    >
      {/* Building/skyline monogram in gold */}
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 transition-colors group-hover:border-gold">
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 text-gold"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 28h24M7 28V13l5-4 5 4v15M20 28V16l4-3 4 3v12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M10 17h2M10 21h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl font-bold tracking-wide ${wordColor}`}>
          HUGS
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-gold">
          Luxury Apartments
        </span>
      </span>
    </Link>
  )
}
