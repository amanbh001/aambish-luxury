// components/ui/CookieConsent.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('aambish-cookie-consent');
    if (!consent) setTimeout(() => setVisible(true), 1800);
  }, []);

  const accept  = () => { localStorage.setItem('aambish-cookie-consent', 'accepted');  setVisible(false); };
  const decline = () => { localStorage.setItem('aambish-cookie-consent', 'essential'); setVisible(false); };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '20px', right: '20px', zIndex: 9999,
      maxWidth: '500px',
      background: 'linear-gradient(145deg, #1A1A18, #2C3528)',
      border: '1px solid rgba(201,169,110,0.2)',
      borderRadius: '4px',
      padding: '22px 26px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(201,169,110,0.1)',
      animation: 'fadeUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
    }}>
      {/* Gold top line */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)', marginBottom: '16px' }} />
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', lineHeight: 1.7, color: 'rgba(250,250,247,0.8)', marginBottom: '16px' }}>
        We use cookies to improve your experience and for analytics.{' '}
        <Link href="/privacy-policy" style={{ color: '#E8D5A8', textDecoration: 'underline' }}>Privacy Policy</Link>
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={accept} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', border: 'none', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Accept All
        </button>
        <button onClick={decline} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'rgba(250,250,247,0.55)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}>
          Essential Only
        </button>
      </div>
    </div>
  );
}
