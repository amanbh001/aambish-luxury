// components/layout/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Shop',         href: '/shop' },
  { label: 'Collections',  href: '/shop?view=collections' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
  { label: 'Blog',         href: '/blog' },
];

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount,   setCartCount]   = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncCart = () => {
      try {
        const raw = localStorage.getItem('aambish-cart');
        if (raw) {
          const data = JSON.parse(raw);
          const count = (data.state?.items || []).reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
          setCartCount(count);
        }
      } catch {}
    };
    syncCart();
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  const headerBg = scrolled
    ? 'rgba(250,250,247,0.94)'
    : 'transparent';
  const headerShadow = scrolled
    ? '0 2px 24px rgba(201,169,110,0.10), 0 1px 0 rgba(201,169,110,0.18)'
    : 'none';

  return (
    <>
      <header style={{
        position: 'fixed', top: '40px', left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-height)',
        background: headerBg,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: headerShadow,
        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        <div style={{ height: '100%', maxWidth: '1320px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px' }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: scrolled ? '#2C3528' : '#FFFFFE', letterSpacing: '0.04em', lineHeight: 1.1, transition: 'color 0.4s' }}>aambish</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E', lineHeight: 1 }}>— Luxury —</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} aria-label="Main navigation" className="desktop-nav">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)')}
              >{link.label}</Link>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} aria-label="Search" style={{ color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', display: 'flex', alignItems: 'center', background: 'none', border: 'none', transition: 'color 0.2s', cursor: 'pointer' }}>
              <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className="desktop-icon" style={{ color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', display: 'flex', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#C9A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)')}
            >
              <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>
            </Link>

            {/* Account */}
            <Link href="/profile" aria-label="Account" className="desktop-icon" style={{ color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', display: 'flex', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#C9A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)')}
            >
              <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label={`Cart, ${cartCount} items`} style={{ color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', display: 'flex', position: 'relative', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#C9A96E')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)')}
            >
              <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"/></svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-7px', right: '-7px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', borderRadius: '50%', width: '17px', height: '17px', fontSize: '9px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(201,169,110,0.35)' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="mobile-menu-btn" style={{ color: scrolled ? '#2C3528' : 'rgba(255,255,255,0.88)', display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(44,53,40,0.55)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)} />
          <nav style={{ width: '300px', background: 'linear-gradient(to bottom, #FFFFFE, #F8F7F3)', height: '100%', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '4px', animation: 'slideInRight 0.3s cubic-bezier(0.25,0.46,0.45,0.94)', boxShadow: '-4px 0 32px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: '#2C3528' }}>aambish</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase' }}>— Luxury —</div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ fontSize: '24px', color: '#8A8A7A', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ padding: '14px 0', borderBottom: '1px solid rgba(201,169,110,0.15)', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '20px', color: '#2C3528', fontWeight: 300, textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', paddingTop: '28px' }}>
              <Link href="/profile"  onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '11px', textAlign: 'center', border: '1px solid #2C3528', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', textDecoration: 'none' }}>Account</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '11px', textAlign: 'center', border: '1px solid rgba(201,169,110,0.4)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', textDecoration: 'none' }}>Wishlist</Link>
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(26,26,24,0.72)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '120px', animation: 'fadeIn 0.2s ease' }} onClick={() => setSearchOpen(false)}>
          <div style={{ background: 'linear-gradient(145deg, #FFFFFE, #F8F7F3)', width: '100%', maxWidth: '600px', margin: '0 20px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 24px 64px rgba(0,0,0,0.2), 0 4px 16px rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.2)' }} onClick={e => e.stopPropagation()}>
            <svg style={{ marginLeft: '16px', color: '#C9A96E', flexShrink: 0 }} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input autoFocus type="text" placeholder="Search jewellery, collections, styles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`; } if (e.key === 'Escape') setSearchOpen(false); }}
              style={{ flex: 1, padding: '18px 8px', fontSize: '16px', background: 'none', border: 'none', color: '#1A1A18', fontFamily: 'DM Sans, sans-serif' }}
            />
            <button onClick={() => setSearchOpen(false)} style={{ padding: '12px 16px', color: '#8A8A7A', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>ESC</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (max-width: 900px) { .desktop-nav { display: none !important; } .desktop-icon { display: none !important; } .mobile-menu-btn { display: flex !important; } }
      `}</style>
    </>
  );
}
