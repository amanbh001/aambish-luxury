// app/shipping-policy/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Shipping Policy' };

function PolicyLayout({ title, lastUpdated, sections }: { title: string; lastUpdated: string; sections: { h: string; b: string }[] }) {
  return (
    <div className="page-content">
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--border)', padding: '60px 0 40px' }}>
        <div className="container-narrow">
          <span className="section-label">Delivery</span>
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

export default function ShippingPage() {
  return <PolicyLayout title="Shipping Policy" lastUpdated="1 April 2025" sections={[
    { h: 'Processing Time', b: 'All orders are processed within 2–4 business days of confirmation. Orders placed on weekends or public holidays are processed the next working day.\n\nYou\'ll receive a dispatch confirmation email with tracking details once your order ships.' },
    { h: 'Shipping Charges', b: 'Free shipping on all orders above ₹2,000.\nStandard shipping (below ₹2,000): ₹99 flat.\nExpress shipping (select pincodes): ₹149.' },
    { h: 'Delivery Timeframes', b: 'Metro cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata): 3–5 business days.\nOther cities & towns: 5–7 business days.\nRemote areas: 7–10 business days.\n\nDelivery times are estimates and may vary due to courier delays or weather conditions.' },
    { h: 'Tracking Your Order', b: 'Once shipped, you\'ll receive tracking details via email and SMS. You can also track your order through the "My Orders" section of your profile page.' },
    { h: 'Packaging', b: 'Every Aambish piece is carefully packed in our signature gift box with tissue paper and a care card — perfect for gifting, right out of the box. Gift notes can be added at checkout.' },
    { h: 'International Shipping', b: 'International shipping is currently unavailable. We are working on expanding our delivery to select international destinations — sign up for our newsletter to be notified.' },
  ]} />;
}
