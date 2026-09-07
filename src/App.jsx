import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Listings from './pages/Listings.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Booking from './pages/Booking.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Legal from './pages/Legal.jsx'
import { Button } from './components/ui.jsx'

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-40 pb-24 text-center">
      <span className="font-serif text-7xl font-bold text-gold">404</span>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-ink/60">The page you’re looking for doesn’t exist.</p>
      <Button to="/" variant="dark" size="lg" className="mt-8">Back home</Button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:slug" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
