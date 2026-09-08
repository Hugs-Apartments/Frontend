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
      {/* Brand mark */}
      <img
        src="/HUGS-LOGO-2.png"
        alt=""
        aria-hidden="true"
        className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/50 transition-all group-hover:ring-gold"
      />
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
