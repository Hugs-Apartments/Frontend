// Supabase client — STUB for now.
//
// The frontend currently runs entirely on mock data (see data/mockListings.js).
// When the backend is ready, install @supabase/supabase-js and replace the
// stub below with a real client, then point the service functions in
// mockListings.js at it.
//
//   npm install @supabase/supabase-js
//
//   import { createClient } from '@supabase/supabase-js'
//   export const supabase = createClient(
//     import.meta.env.VITE_SUPABASE_URL,
//     import.meta.env.VITE_SUPABASE_ANON_KEY,
//   )

const notReady = () => {
  throw new Error(
    'Supabase is not wired up yet — the frontend is running on mock data. ' +
      'See src/lib/supabaseClient.js for how to enable it.',
  )
}

export const supabase = {
  from: notReady,
  auth: { getSession: notReady, signInWithPassword: notReady },
}

export const SUPABASE_ENABLED = false
