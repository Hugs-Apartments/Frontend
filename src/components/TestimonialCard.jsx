import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  const { name, location, rating, text } = testimonial
  return (
    <figure className="flex h-full flex-col gap-3 rounded-xl border-l-2 border-gold bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Quote className="h-6 w-6 shrink-0 text-gold/40" aria-hidden="true" />
        <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < rating ? 'fill-gold text-gold' : 'text-ink/20'}`}
            />
          ))}
        </div>
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-ink/80">
        <p>“{text}”</p>
      </blockquote>
      <figcaption className="border-t border-ink/10 pt-3">
        <span className="font-serif text-base font-semibold text-plum">{name}</span>
        <span className="block text-xs text-ink/50">{location}</span>
      </figcaption>
    </figure>
  )
}
