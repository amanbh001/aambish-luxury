// components/layout/AnnouncementBar.tsx
'use client';
import { useState } from 'react';

const MESSAGES = [
  '✦ Latest Jewellery Designs — Updated Weekly',
  '✦ Best Price Guaranteed — Better Than Offline Stores',
  '✦ Free Shipping on Orders Above ₹2,000',
  '✦ Pay Securely via UPI — GPay · PhonePe · Paytm',
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="announce-bar"
      role="banner"
      aria-label="Site announcements"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        display: 'flex', gap: '80px', whiteSpace: 'nowrap',
        animation: 'marquee 30s linear infinite',
      }}>
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', letterSpacing: '0.14em' }}>{msg}</span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(232,213,168,0.5)', fontSize: '18px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
      >×</button>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { div { animation: none !important; } }
      `}</style>
    </div>
  );
}
