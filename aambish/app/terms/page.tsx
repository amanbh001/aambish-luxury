// app/terms/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions' };

function PolicyLayout({ title, lastUpdated, sections }: { title: string; lastUpdated: string; sections: { h: string; b: string }[] }) {
  return (
    <div className="page-content">
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--border)', padding: '60px 0 40px' }}>
        <div className="container-narrow">
          <span className="section-label">Legal</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>{title}</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '13px' }}>Last updated: {lastUpdated}</p>
        </div>
      </div>
      <div className="container-narrow section-pad">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '14px', color: 'var(--forest)' }}>{s.h}</h3>
              <p style={{ color: 'var(--forest-mid)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return <PolicyLayout title="Terms & Conditions" lastUpdated="1 April 2025" sections={[
    { h: '1. Acceptance of Terms', b: 'By accessing or using the Aambish Luxury website, you agree to be bound by these Terms & Conditions. If you disagree with any part, please do not use our services.' },
    { h: '2. Products & Pricing', b: 'All product descriptions and prices are accurate to the best of our knowledge. We reserve the right to modify prices at any time without prior notice. Product images are representative and may vary slightly in person.' },
    { h: '3. Orders & Payment', b: 'By placing an order, you confirm you are legally capable of entering into a binding contract. Payment is due at the time of order. We accept UPI, credit/debit cards, net banking (via Razorpay), and Cash on Delivery.' },
    { h: '4. Intellectual Property', b: 'All content on this website — including images, logos, text, and design — is owned by Aambish Luxury and protected by copyright laws. Unauthorized use is strictly prohibited.' },
    { h: '5. Limitation of Liability', b: 'Aambish Luxury shall not be liable for indirect or consequential damages arising from the use or inability to use our products or website.' },
    { h: '6. Governing Law', b: 'These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Delhi, India.' },
  ]} />;
}
