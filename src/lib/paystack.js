// Paystack payment kickoff (frontend side).
//
// Card details are NEVER typed into our own form — the guest is redirected to
// Paystack's secure hosted checkout. The flow is:
//
//   1. createBooking()  → a pending booking row (has an id + reference)
//   2. initPayment({ bookingId })  → { authorizationUrl, reference }
//   3. Browser redirects to authorizationUrl (Paystack-hosted checkout)
//   4. Paystack redirects back to /payment/callback?reference=…
//   5. verifyPayment(reference) confirms the booking; the backend then emails
//      the guest a confirmation + PDF receipt.
//
// The backend runs a simulated checkout when no Paystack secret key is set, so
// this same flow works end-to-end in development against a configured backend.

const API_URL = import.meta.env.VITE_API_URL ?? ''
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? ''

// Payments require a backend to initialise against. (Hosted checkout does not
// need the public key on the frontend — the backend initialises the charge.)
export const PAYSTACK_ENABLED = Boolean(API_URL)

// Starts a charge for an already-created booking. Returns the hosted-checkout
// URL to send the browser to.
export async function initPayment({ bookingId }) {
  if (!API_URL) throw new Error('Payment service is not configured.')
  const res = await fetch(`${API_URL}/api/payments/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking_id: bookingId }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not start payment. Please try again.')
  return {
    authorizationUrl: data.authorization_url,
    reference: data.reference,
    simulated: data.simulated ?? false,
  }
}

// Verifies a payment after the guest is redirected back. On success the backend
// marks the booking completed and emails the receipt. Returns { status, reference }.
export async function verifyPayment(reference) {
  if (!API_URL) throw new Error('Payment service is not configured.')
  const res = await fetch(`${API_URL}/api/payments/verify/${encodeURIComponent(reference)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not verify your payment.')
  return { status: data.status, reference: data.booking_reference ?? reference }
}
