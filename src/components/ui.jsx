import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

// Section title with a thin gold rule beneath — the signature divider.
export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col ${alignment}`}>
      {eyebrow && (
        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </span>
      )}
      <h2 className={`font-serif text-3xl font-semibold sm:text-4xl ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      <span className={`gold-rule mt-4 ${align === 'center' ? '' : 'ml-0'}`} />
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base ${dark ? 'text-white/70' : 'text-ink/70'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

const baseBtn =
  'inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const sizes = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-sm',
}

const variants = {
  // gold on plum
  primary: 'bg-gold text-plum hover:bg-champagne hover:shadow-lg hover:shadow-gold/20',
  // plum on white
  dark: 'bg-plum text-white hover:bg-plum-dark',
  outline: 'border border-gold text-gold hover:bg-gold hover:text-plum',
  ghost: 'text-gold hover:text-champagne',
}

export function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const cls = `${baseBtn} ${sizes[size]} ${variants[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }
  const Tag = as
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  )
}

export function Rating({ value, count, className = '', dark = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
      <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`}>
        {value.toFixed(1)}
      </span>
      {count != null && (
        <span className={`text-sm ${dark ? 'text-white/60' : 'text-ink/50'}`}>
          ({count})
        </span>
      )}
    </span>
  )
}

// Circular gold-line badge used for amenity icons.
export function IconBadge({ children, className = '' }) {
  return (
    <span
      className={`flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-plum text-gold shadow-sm ${className}`}
    >
      {children}
    </span>
  )
}
