// components/home/NewsletterSection.tsx
'use client';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setDone(true); setLoading(false);
  };

  return (
    <section style={{ background: 'linear-gradient(135deg, #2C3528 0%, #1A1A18 100%)', padding: '100px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle gold sheen top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)' }} />

      <div className="container-narrow">
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '12px' }}>Stay Connected</span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#FFFFFE', marginBottom: '14px' }}>
          First to Know, First to Adore
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(250,250,247,0.6)', marginBottom: '44px', lineHeight: 1.8 }}>
          New arrivals, exclusive offers, and jewellery stories — straight to your inbox.
        </p>

        {done ? (
          <div style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '2px', padding: '22px 48px', display: 'inline-block' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: '#E8D5A8', fontStyle: 'italic' }}>✦ Welcome to the Aambish family</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{ flex: 1, padding: '15px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,169,110,0.25)', borderRight: 'none', borderRadius: '2px 0 0 2px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#FAFAF7' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '15px 28px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', border: 'none', borderRadius: '0 2px 2px 0', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(201,169,110,0.2)' }}>
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '14px' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
