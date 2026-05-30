// components/home/HeroSection.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh', minHeight: '600px', maxHeight: '920px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2C3528 0%, #1A1A18 100%)',
      }}
      aria-label="Hero — Aambish Luxury"
    >
      {/* Background media */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/images/hero-poster.jpg" alt="Aambish Luxury fine jewellery" fill priority sizes="100vw"
          style={{ objectFit: 'cover', opacity: videoLoaded ? 0 : 1, transition: 'opacity 0.8s ease' }} />
        <video autoPlay muted loop playsInline preload="none" poster="/images/hero-poster.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: videoLoaded ? 1 : 0, transition: 'opacity 1.2s ease' }}>
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4"  type="video/mp4" />
        </video>
      </div>

      {/* Glossy ivory-toned gradient overlay — no green */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(26,26,24,0.78) 0%, rgba(26,26,24,0.42) 55%, rgba(26,26,24,0.15) 100%)' }} />

      {/* Subtle gold sheen at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(201,169,110,0.08), transparent)' }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 'calc(var(--nav-height) + var(--announce-height))' }}>
        <div style={{ maxWidth: '580px', animation: 'fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '18px' }}>
            Crafted with Grace
          </span>

          <h1 style={{ color: '#FFFFFE', fontSize: 'clamp(3rem, 7vw, 6.2rem)', lineHeight: 1.06, fontWeight: 300, marginBottom: '10px', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Wear Your
          </h1>
          <h1 style={{ color: '#E8D5A8', fontSize: 'clamp(3rem, 7vw, 6.2rem)', lineHeight: 1.06, fontWeight: 300, marginBottom: '28px', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Elegance
          </h1>

          {/* Word row */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}>
            {['Minimalist', 'Graceful', 'Luxury'].map((w, i) => (
              <span key={i} style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '14px', fontStyle: 'italic', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>
                {w}{i < 2 && <span style={{ marginLeft: '20px', color: 'rgba(201,169,110,0.3)' }}>·</span>}
              </span>
            ))}
          </div>

          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(250,250,247,0.72)', fontSize: '15px', lineHeight: 1.85, marginBottom: '40px', maxWidth: '440px', animation: 'fadeUp 0.9s 0.15s cubic-bezier(0.25,0.46,0.45,0.94) both', opacity: 0 }}>
            Minimalist fine jewellery for the modern woman. Latest designs. Best prices. Delivered in 2 days.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', animation: 'fadeUp 0.9s 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both', opacity: 0 }}>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 36px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: '2px', boxShadow: '0 4px 24px rgba(201,169,110,0.3)', transition: 'all 0.3s' }}>
              Shop Now
            </Link>
            <Link href="/shop?filter=new" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 30px', color: '#FFFFFE', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '2px', backdropFilter: 'blur(4px)', transition: 'all 0.3s' }}>
              New Arrivals →
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', animation: 'fadeIn 2s 1s both', opacity: 0 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: '1px', height: '44px', background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' }} />
      </div>
    </section>
  );
}
