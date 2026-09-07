import {
  ShieldCheck,
  Zap,
  Wifi,
  Car,
  Droplets,
  Tv,
  Wind,
  ChefHat,
  Utensils,
  Briefcase,
  WashingMachine,
  Trees,
  Building2,
  BellRing,
  Sparkles,
} from 'lucide-react'

// Maps an amenity label to a lucide icon. Falls back to Sparkles.
const ICONS = {
  '24/7 Security': ShieldCheck,
  'Power Supply': Zap,
  'High-Speed WiFi': Wifi,
  'Ample Parking': Car,
  'Clean Water Supply': Droplets,
  'Smart TV': Tv,
  'Air Conditioning': Wind,
  'Full Kitchen': ChefHat,
  Kitchenette: Utensils,
  Workspace: Briefcase,
  Washer: WashingMachine,
  Balcony: Trees,
  'Private Balcony': Trees,
  'City View': Building2,
  Concierge: BellRing,
}

export function AmenityIcon({ name, className = 'h-5 w-5' }) {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}

// Circular gold-line badge with label beneath — used in the amenities strip.
export default function AmenityBadge({ name }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-plum text-gold shadow-sm transition-transform duration-300 hover:scale-105">
        <AmenityIcon name={name} className="h-7 w-7" />
      </span>
      <span className="text-sm font-medium text-ink/80">{name}</span>
    </div>
  )
}

// Inline amenity chip (icon + label) used in listing detail / cards.
export function AmenityChip({ name }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-offwhite px-3 py-2 text-sm text-ink/80">
      <span className="text-gold">
        <AmenityIcon name={name} className="h-4 w-4" />
      </span>
      {name}
    </span>
  )
}
