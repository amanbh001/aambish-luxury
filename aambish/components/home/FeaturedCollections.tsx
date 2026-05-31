// components/home/FeaturedCollections.tsx
import Link from 'next/link';
import Image from 'next/image';

const collections = [
  { name: 'Celestial',  slug: 'celestial', image: '/images/col-celestial.jpg', count: 24, desc: 'Inspired by the night sky',   accent: '#3D4A38' },
  { name: 'Bloom',      slug: 'bloom',     image: '/images/col-bloom.jpg',     count: 18, desc: 'Floral forms, refined',       accent: '#2C3528' },
  { name: 'Minimal',    slug: 'minimal',   image: '/images/col-minimal.jpg',   count: 32, desc: 'Less is everything',          accent: '#1A1A18' },
  { name: 'Heirloom',   slug: 'heirloom',  image: '/images/col-heirloom.jpg',  count: 15, desc: 'Made to be passed down',      accent: '#2C3528' },
];

export default function FeaturedCollections() {
  return (
    <section style={{ padding: '100px 0', background: 'linear-gradient(to bottom,#FAFAF7,#F8F7F3)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '12px' }}>
            Curated For You
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#1A1A18' }}>
            Shop by Collection
          </h2>
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to right,transparent,#C9A96E,transparent)', margin: '16px auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
          {collections.map((col, i) => (
            <Link
              key={col.slug}
              href={`/shop?collection=${col.slug}`}
              style={{
                display: 'block', position: 'relative', borderRadius: '2px', overflow: 'hidden',
                aspectRatio: i === 0 ? '2/3' : '3/4',
                background: col.accent,
                gridRow: i === 0 ? 'span 2' : undefined,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(44,53,40,0.12)',
              }}
              className="col-card"
            >
              <Image
                src={col.image} alt={col.name} fill
                sizes="(max-width:640px) 100vw, 25vw"
                style={{ objectFit: 'cover', transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                className="col-img"
              />
              {/* Glossy overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(26,26,24,0.72) 0%,rgba(26,26,24,0.1) 50%,transparent 100%)' }} />
              {/* Subtle gold sheen */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(201,169,110,0.06),transparent 60%)', pointerEvents: 'none' }} />

              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(232,213,168,0.75)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '5px' }}>{col.desc}</p>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#FFFFFE', fontSize: i === 0 ? '28px' : '22px', fontWeight: 300, marginBottom: '3px' }}>{col.name}</h3>
                <span style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{col.count} pieces</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .col-card:hover .col-img { transform: scale(1.06); }
        @media (max-width: 768px) {
          .col-card:first-child { grid-row: span 1 !important; aspect-ratio: 3/4 !important; }
          section > div > div[style*="grid-template-columns"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          section > div > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
