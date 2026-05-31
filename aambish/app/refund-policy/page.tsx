// app/refund-policy/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Refund Policy' };

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

export default function RefundPage() {
  return <PolicyLayout title="Refund & Return Policy" lastUpdated="1 April 2025" sections={[
    { h: 'Our Return Policy', b: 'We want you to love your purchase. If you\'re not completely satisfied, we accept returns within 7 days of delivery for unused, undamaged items in original packaging.' },
    { h: 'Eligibility for Returns', b: 'Items must be in original, unworn condition with all tags attached.\nCustomised or personalised items cannot be returned.\nItems marked "Final Sale" are not eligible.\nProof of purchase is required for all returns.' },
    { h: 'How to Initiate a Return', b: '1. Email returns@aambish.com with your order number and reason within 7 days of delivery.\n2. Our team will respond within 24 hours with return instructions.\n3. Pack the item securely in its original packaging.\n4. Ship via a trackable courier. Return shipping costs are borne by the customer unless the item is defective.' },
    { h: 'Refund Processing', b: 'Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund.\n\nApproved refunds are processed within 5–7 business days to your original payment method. UPI and card refunds may take an additional 3–5 working days depending on your bank.' },
    { h: 'Exchanges', b: 'We offer exchanges for the same item in a different size or variant, subject to availability. Contact us within 7 days of delivery to request an exchange.' },
    { h: 'Damaged or Defective Items', b: 'If you receive a damaged or defective item, please email us at returns@aambish.com within 48 hours of delivery with photos. We will arrange a free replacement or full refund at no cost to you.' },
  ]} />;
}
