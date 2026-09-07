// Shared formatting + date helpers.

export function formatNaira(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Whole nights between two yyyy-mm-dd strings (or Date objects). Min 0.
export function nightsBetween(from, to) {
  if (!from || !to) return 0
  const a = new Date(from)
  const b = new Date(to)
  const ms = b - a
  if (Number.isNaN(ms)) return 0
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// Add n days to a yyyy-mm-dd string, return yyyy-mm-dd.
export function addDaysISO(iso, n) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function formatDateLong(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Booking reference generator for the mock checkout flow.
export function makeBookingRef() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  const year = new Date().getFullYear()
  return `HUGS-${year}-${rand}`
}
