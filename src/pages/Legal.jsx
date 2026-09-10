import { useParams, Navigate, Link } from 'react-router-dom'
import { SectionHeading } from '../components/ui.jsx'

const WHATSAPP = '+234 909 215 7050'
const EMAIL = 'info@hugsluxuryapartments.com'
const EFFECTIVE = 'September 2026'

// All legal copy lives here, keyed by route slug. Content is written for a
// serviced-apartment short-let business and is intended as a reasonable
// starting point — have it reviewed by counsel before going live.
const DOCS = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro:
      'This policy explains what information Hugs Luxury Apartments collects, how we use it and the choices you have. We keep data collection to what we genuinely need to host your stay.',
    sections: [
      {
        h: 'Information we collect',
        p: 'When you make a booking or contact us, we collect your name, email address, phone number, stay dates and any notes you choose to share. Payment is handled by our payment provider — we do not store your full card details on our systems.',
      },
      {
        h: 'How we use your information',
        p: 'We use your details to confirm and manage your reservation, communicate about your stay, provide receipts, prevent fraud and improve our service. We may send booking-related messages by email or WhatsApp.',
      },
      {
        h: 'Sharing',
        p: 'We share information only where needed to deliver your stay — for example with our payment provider to process a transaction, or where required by law. We do not sell your personal data.',
      },
      {
        h: 'Data retention',
        p: 'We keep booking and payment records for as long as needed to meet legal, accounting and operational requirements, after which they are securely deleted or anonymised.',
      },
      {
        h: 'Your rights',
        p: 'You may request access to, correction of, or deletion of your personal data. To make a request, contact us using the details below and we will respond within a reasonable time.',
      },
      {
        h: 'Contact',
        p: `Questions about this policy? Email ${EMAIL} or message us on WhatsApp at ${WHATSAPP}.`,
      },
    ],
  },
  cancellation: {
    eyebrow: 'Legal',
    title: 'Cancellation Policy',
    intro:
      'We understand plans change. This policy explains how cancellations and refunds work for stays booked with Hugs Luxury Apartments.',
    sections: [
      {
        h: 'Free cancellation window',
        p: 'Cancel up to 48 hours before your check-in date and receive a full refund of the amount paid, less any non-refundable payment-processing fee.',
      },
      {
        h: 'Late cancellations',
        p: 'Cancellations made within 48 hours of check-in are eligible for a 50% refund of the accommodation cost. The service fee is non-refundable.',
      },
      {
        h: 'No-shows',
        p: 'If you do not arrive and have not cancelled, the booking is treated as a no-show and no refund is due.',
      },
      {
        h: 'Modifications',
        p: 'To change your dates, contact us as early as possible. Changes are subject to availability and any difference in nightly rate.',
      },
      {
        h: 'How refunds are processed',
        p: 'Approved refunds are returned to your original payment method. Processing times depend on your bank or card provider and are typically 5–10 business days.',
      },
      {
        h: 'Contact',
        p: `To cancel or change a booking, email ${EMAIL} with your booking reference, or message ${WHATSAPP}.`,
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Use',
    intro:
      'These terms govern your use of the Hugs Luxury Apartments website and your booking of our serviced apartments. By using the site or making a reservation, you agree to these terms.',
    sections: [
      {
        h: 'Bookings',
        p: 'A booking is confirmed once payment is received and we issue a confirmation. You are responsible for providing accurate guest details and for ensuring the number of guests does not exceed the stated maximum for the apartment.',
      },
      {
        h: 'Payment',
        p: 'Full payment or a deposit, as indicated at checkout, is required to secure a reservation. Prices are shown in Nigerian Naira and include any service fee stated at the time of booking.',
      },
      {
        h: 'Cancellations & changes',
        p: 'Cancellation and modification terms are shared at the time of booking. Where a stay is cancelled, any refund is processed in line with those terms and the original payment method.',
      },
      {
        h: 'House rules',
        p: 'Guests agree to treat each apartment with care, to avoid causing nuisance to neighbours, and to comply with check-in and check-out times. Smoking and unauthorised events are not permitted. Damage beyond normal wear may be charged.',
      },
      {
        h: 'Liability',
        p: 'We take reasonable care to describe our apartments accurately and to keep them safe and clean. To the extent permitted by law, we are not liable for indirect or consequential loss arising from your stay.',
      },
      {
        h: 'Contact',
        p: `For any questions about these terms, email ${EMAIL} or message ${WHATSAPP}.`,
      },
    ],
  },
  cookies: {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    intro:
      'This policy explains how the Hugs Luxury Apartments website uses cookies and similar technologies, and how you can control them.',
    sections: [
      {
        h: 'What cookies are',
        p: 'Cookies are small text files stored on your device. They help a website remember your preferences and understand how the site is used.',
      },
      {
        h: 'How we use cookies',
        p: 'We use essential cookies to make the site work — for example to remember items you are booking — and, where enabled, analytics cookies to understand which pages are useful so we can improve them.',
      },
      {
        h: 'Managing cookies',
        p: 'You can control or delete cookies through your browser settings. Blocking essential cookies may affect how parts of the site function.',
      },
      {
        h: 'Contact',
        p: `Questions about cookies? Email ${EMAIL}.`,
      },
    ],
  },
}

export default function Legal() {
  const { slug } = useParams()
  const doc = DOCS[slug]
  if (!doc) return <Navigate to="/" replace />

  return (
    <>
      <section className="bg-plum pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{doc.eyebrow}</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">{doc.title}</h1>
          <span className="gold-rule mt-5" />
          <p className="mx-auto mt-4 max-w-2xl text-white/70">{doc.intro}</p>
          <p className="mt-4 text-xs uppercase tracking-wider text-white/40">Effective {EFFECTIVE}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="space-y-10">
          {doc.sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-serif text-xl font-semibold text-ink">{s.h}</h2>
              <span className="gold-rule mt-3 block !w-12" />
              <p className="mt-4 leading-relaxed text-ink/75">{s.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-ink/10 pt-8 text-sm text-ink/60">
          <p>
            See also{' '}
            <Link to="/legal/privacy" className="font-medium text-gold hover:text-plum">Privacy Policy</Link>,{' '}
            <Link to="/legal/terms" className="font-medium text-gold hover:text-plum">Terms of Use</Link> and{' '}
            <Link to="/legal/cookies" className="font-medium text-gold hover:text-plum">Cookie Policy</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
