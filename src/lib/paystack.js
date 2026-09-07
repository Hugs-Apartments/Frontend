// Paystack integration — STUB for now.
//
// The checkout flow currently simulates payment in the UI only (no charge is
// made). When the backend is ready, install the inline script or SDK and
// replace initPayment below with a real Paystack call.
//
//   Popup approach (client-side):
//   <script src="https://js.paystack.co/v1/inline.js"></script>
//   then window.PaystackPop.setup({ key, email, amount, ref, callback })
//
//   Or initialize server-side and redirect to the returned authorization_url.

import { makeBookingRef } from '../utils/format.js'

// Simulates a payment. Resolves with a mock success result after a short delay.
export async function initPayment({ amount, email, bookingRef }) {
  await new Promise((r) => setTimeout(r, 1400))
  return {
    status: 'success',
    reference: bookingRef ?? makeBookingRef(),
    amount,
    email,
    paidAt: new Date().toISOString(),
    channel: 'card',
    simulated: true,
  }
}

export const PAYSTACK_ENABLED = false
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? ''
