import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  const { name, location, rating, text } = testimonial
  return (
    <figure className="flex h-full flex-col rounded-2xl border-t-2 border-gold bg-white p-7 shadow-sm">
      <Quote className="h-8 w-8 text-gold/40" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-ink/80">
        <p className="leading-relaxed">“{text}”</p>
      </blockquote>
      <div className="mt-6 flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-gold text-gold' : 'text-ink/20'}`}
          />
        ))}
      </div>
      <figcaption className="mt-3">
        <span className="font-serif text-lg font-semibold text-plum">{name}</span>
        <span className="block text-sm text-ink/50">{location}</span>
      </figcaption>
    </figure>
  )
}
