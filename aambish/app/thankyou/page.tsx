// app/thankyou/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed — Aambish Luxury',
  robots: { index: false },
};

export default function ThankYouPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="page-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: 'linear-gradient(135deg,#FAFAF7 0%,#F4F3EE 100%)' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Gold checkmark */}
        <div style={{
          width: '84px', height: '84px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#2C3528,#1A1A18)',
          border: '1px solid rgba(201,169,110,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          animation: 'fadeUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both',
          boxShadow: '0 8px 32px rgba(44,53,40,0.22), 0 2px 8px rgba(201,169,110,0.15)',
        }}>
          <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#C9A96E" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '10px', animation: 'fadeUp 0.6s 0.1s both', opacity: 0 }}>
          Order Confirmed
        </span>

        <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem,5vw,3.4rem)', fontWeight: 300, color: '#1A1A18', marginBottom: '16px', animation: 'fadeUp 0.6s 0.2s both', opacity: 0 }}>
          Thank You!
        </h1>

        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#3D4A38', lineHeight: 1.85, marginBottom: '10px', fontSize: '15px', animation: 'fadeUp 0.6s 0.3s both', opacity: 0 }}>
          Your order <strong style={{ color: '#2C3528', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '17px' }}>#{searchParams.order}</strong> has been confirmed.
          A confirmation email is on its way to you.
        </p>

        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8A8A7A', fontSize: '14px', marginBottom: '48px', animation: 'fadeUp 0.6s 0.35s both', opacity: 0 }}>
          Your piece will be lovingly packed and dispatched within 2–4 business days.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.45s both', opacity: 0 }}>
          <Link href="/profile" style={{ padding: '13px 32px', border: '1px solid #2C3528', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2C3528', textDecoration: 'none', transition: 'all 0.25s' }}>
            View Orders
          </Link>
          <Link href="/shop" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FAFAF7', textDecoration: 'none', boxShadow: '0 4px 20px rgba(44,53,40,0.18)' }}>
            Continue Shopping
          </Link>
        </div>

        {/* Steps card */}
        <div style={{
          marginTop: '56px', padding: '32px 28px',
          background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)',
          border: '1px solid rgba(201,169,110,0.18)',
          borderRadius: '2px',
          boxShadow: '0 4px 24px rgba(201,169,110,0.08)',
          animation: 'fadeUp 0.6s 0.55s both', opacity: 0,
          textAlign: 'left',
        }}>
          <h4 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#1A1A18', marginBottom: '24px', textAlign: 'center' }}>
            What Happens Next?
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { step: '1', title: 'Order Confirmed',  desc: 'You\'ll receive a confirmation to your email shortly' },
              { step: '2', title: 'Lovingly Packed',  desc: 'Your jewellery is carefully wrapped in our signature box' },
              { step: '3', title: 'Dispatched',       desc: 'Tracking details sent via email and SMS' },
              { step: '4', title: 'Delivered to You', desc: 'Arrives within 2–7 business days' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,rgba(201,169,110,0.15),rgba(201,169,110,0.08))',
                  border: '1px solid rgba(201,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '14px', color: '#C9A96E', fontWeight: 500,
                }}>
                  {item.step}
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A1A18', marginBottom: '2px' }}>{item.title}</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
