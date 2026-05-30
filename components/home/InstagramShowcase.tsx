// components/home/InstagramShowcase.tsx
import Link from 'next/link';
import Image from 'next/image';

const posts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  image: `/images/insta-${i + 1}.jpg`,
  alt: `Aambish jewellery — Instagram post ${i + 1}`,
}));

export default function InstagramShowcase() {
  return (
    <section style={{ background: 'linear-gradient(to bottom, #F8F7F3, #F4F3EE)', padding: '80px 0 72px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '10px' }}>Follow Our Journey</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: '#1A1A18', marginBottom: '8px' }}>@aambish.co</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A8A7A' }}>Real jewellery. Real people. Real grace.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
          {posts.map((p, i) => (
            <a
              key={p.id}
              href="https://www.instagram.com/aambish.co"
              target="_blank" rel="noopener noreferrer"
              aria-label={p.alt}
              style={{
                display: 'block', position: 'relative', aspectRatio: '1',
                overflow: 'hidden', borderRadius: '2px',
                background: 'linear-gradient(135deg, #2C3528, #3D4A38)',
                border: '1px solid rgba(201,169,110,0.12)',
                gridColumn: i === 0 ? 'span 1' : undefined,
                gridRow: i === 0 ? 'span 2' : undefined,
              }}
              className="insta-cell"
            >
              <Image src={p.image} alt={p.alt} fill sizes="(max-width:768px) 33vw, 22vw"
                style={{ objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                className="insta-img"
              />
              {/* Hover overlay — ivory+gold toned */}
              <div className="insta-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,247,0.12)', backdropFilter: 'blur(2px)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white" opacity="0.9">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="https://www.instagram.com/aambish.co" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', textDecoration: 'none', borderBottom: '1px solid rgba(201,169,110,0.4)', paddingBottom: '2px' }}>
            Follow @aambish.co on Instagram →
          </a>
        </div>
      </div>

      <style>{`
        .insta-cell:hover .insta-img { transform: scale(1.06); }
        .insta-cell:hover .insta-overlay { opacity: 1 !important; }
        @media (max-width: 600px) {
          .insta-cell:first-child { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
