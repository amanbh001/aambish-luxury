// components/home/TrustBadges.tsx
const badges = [
  { icon: '✦', title: 'Latest Jewellery',   desc: 'New designs every week' },
  { icon: '⟡', title: 'Best Price',          desc: 'Better than offline stores' },
  { icon: '⬡', title: 'Free Shipping',       desc: 'On orders above ₹2,000' },
  { icon: '◎', title: 'Secure UPI Payment',  desc: 'GPay · PhonePe · Paytm' },
];

export default function TrustBadges() {
  return (
    <section style={{
      background: 'linear-gradient(to bottom, #FFFFFF, #F8F7F3)',
      borderBottom: '1px solid rgba(201,169,110,0.18)',
      boxShadow: '0 2px 20px rgba(201,169,110,0.07)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
        }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '22px 28px',
              borderRight: i < badges.length - 1 ? '1px solid rgba(201,169,110,0.15)' : 'none',
            }}>
              <span style={{ fontSize: '22px', color: '#C9A96E', lineHeight: 1, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#2C3528', marginBottom: '2px', letterSpacing: '0.02em' }}>{b.title}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr 1fr !important; }
          section > div > div > div { border-right: none !important; border-bottom: 1px solid rgba(201,169,110,0.15); padding: 16px 20px !important; }
          section > div > div > div:nth-child(odd) { border-right: 1px solid rgba(201,169,110,0.15) !important; }
          section > div > div > div:nth-last-child(-n+2) { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
