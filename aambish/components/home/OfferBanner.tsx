// components/home/OfferBanner.tsx
import Link from 'next/link';
import Image from 'next/image';

interface OfferBannerProps {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bgImage: string;
}

export default function OfferBanner({ title, subtitle, cta, href, bgImage }: OfferBannerProps) {
  return (
    <section style={{ position: 'relative', height: '460px', overflow: 'hidden', background: '#1A1A18' }}>
      <Image src={bgImage} alt={title} fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.45 }} />

      {/* Ivory-gold gradient overlay — no green */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,24,0.88) 0%, rgba(44,53,40,0.55) 60%, rgba(201,169,110,0.08) 100%)' }} />
      {/* Gold shimmer bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, rgba(201,169,110,0.1), transparent)' }} />

      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '14px' }}>
          Featured Collection
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 300, color: '#FFFFFE', lineHeight: 1.12, marginBottom: '16px', maxWidth: '680px' }}>
          {title}
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: 'rgba(250,250,247,0.65)', marginBottom: '36px', maxWidth: '460px', lineHeight: 1.75 }}>
          {subtitle}
        </p>
        <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 44px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: '2px', boxShadow: '0 4px 24px rgba(201,169,110,0.28)' }}>
          {cta}
        </Link>
      </div>
    </section>
  );
}
