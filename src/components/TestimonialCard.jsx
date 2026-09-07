import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  const { name, location, rating, text } = testimonial
  return (
    <figure className="flex h-full flex-col gap-5 rounded-2xl border-l-2 border-gold bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <Quote className="h-8 w-8 shrink-0 text-gold/40 sm:h-10 sm:w-10" aria-hidden="true" />
      <blockquote className="flex-1 text-sm text-ink/80 sm:text-base">
        <p className="leading-relaxed">“{text}”</p>
      </blockquote>
      <figcaption className="shrink-0 border-t border-ink/10 pt-4 sm:w-44 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="mb-2 flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'fill-gold text-gold' : 'text-ink/20'}`}
            />
          ))}
        </div>
        <span className="font-serif text-lg font-semibold text-plum">{name}</span>
        <span className="block text-sm text-ink/50">{location}</span>
      </figcaption>
    </figure>
  )
}
