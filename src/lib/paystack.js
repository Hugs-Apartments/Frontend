// Paystack integration.
//
// Real payments are NEVER charged from card details typed into our own form —
// the guest is redirected to Paystack's secure checkout. The flow is:
//
//   1. Backend POST /api/payments/initialize  → { authorization_url, reference }
//   2. Browser redirects to authorization_url (Paystack-hosted checkout)
//   3. Paystack redirects back to our callback, backend verifies the reference
//   4. On success the backend emails the guest a confirmation + PDF receipt
//
// Until VITE_API_URL is wired up we run in MOCK mode: no redirect, no charge —
// initPayment just resolves with a simulated success so the UI is clickable.

import { makeBookingRef } from '../utils/format.js'

const API_URL = import.meta.env.VITE_API_URL ?? ''
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? ''

// Real Paystack runs only when we have both a backend to initialize against and
// a public key. Otherwise we simulate.
export const PAYSTACK_ENABLED = Boolean(API_URL && PAYSTACK_PUBLIC_KEY)

// Kicks off payment.
//   Real mode  → { redirect: true, authorizationUrl, reference }
//                (caller should send the browser to authorizationUrl)
//   Mock mode  → { status: 'success', reference, simulated: true, ... }
export async function initPayment({ amount, email, bookingRef, metadata }) {
  const reference = bookingRef ?? makeBookingRef()

  if (PAYSTACK_ENABLED) {
    const res = await fetch(`${API_URL}/api/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, email, reference, metadata }),
    })
    if (!res.ok) throw new Error('Could not start payment. Please try again.')
    const data = await res.json()
    return {
      redirect: true,
      authorizationUrl: data.authorization_url ?? data.authorizationUrl,
      reference: data.reference ?? reference,
    }
  }

  // Mock: pretend the redirect happened and Paystack returned success.
  await new Promise((r) => setTimeout(r, 1400))
  return {
    status: 'success',
    reference,
    amount,
    email,
    paidAt: new Date().toISOString(),
    channel: 'card',
    simulated: true,
  }
}
