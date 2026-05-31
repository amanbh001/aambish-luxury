// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 16px', background: 'linear-gradient(135deg,#FAFAF7,#F4F3EE)' }}>
      <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(7rem,22vw,15rem)', fontWeight: 300, color: 'rgba(201,169,110,0.15)', lineHeight: 1, display: 'block', marginBottom: '0' }}>404</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '12px' }}>Page Not Found</span>
      <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.5rem,4vw,2.4rem)', fontWeight: 300, color: '#2C3528', marginBottom: '14px' }}>
        This page seems to have wandered off
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8A8A7A', maxWidth: '380px', lineHeight: 1.8, marginBottom: '40px', fontSize: '14px' }}>
        The page you are looking for does not exist or may have moved. Let us get you back to something beautiful.
      </p>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(44,53,40,0.18)' }}>
          Go Home
        </Link>
        <Link href="/shop" style={{ padding: '12px 32px', background: 'transparent', color: '#2C3528', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.35)', borderRadius: '2px', textDecoration: 'none' }}>
          Browse Collection
        </Link>
      </div>
    </div>
  );
}
