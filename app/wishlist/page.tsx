// app/wishlist/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/lib/store';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { items }              = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (items.length === 0) { setLoading(false); return; }
    fetch(`/api/products?ids=${items.join(',')}`)
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [items.join(',')]);

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>
      <div style={{ background: 'linear-gradient(to bottom,#F8F7F3,#F0EFE8)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '52px 0 36px' }}>
        <div className="container">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '8px' }}>Your Curated Edit</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300 }}>Wishlist</h1>
          {items.length > 0 && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#8A8A7A', marginTop: '8px', fontSize: '13px' }}>
              {items.length} saved {items.length === 1 ? 'piece' : 'pieces'}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px 80px' }}>
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                <div style={{ padding: '14px' }}>
                  <div className="skeleton" style={{ height: '10px', width: '55%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="rgba(201,169,110,0.4)" strokeWidth={1} style={{ margin: '0 auto 20px', display: 'block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <h2 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '1.8rem', fontWeight: 300, color: '#2C3528', marginBottom: '12px' }}>Nothing saved yet</h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#8A8A7A', marginBottom: '32px', fontSize: '14px', lineHeight: 1.7 }}>
              Browse our latest collection and save the pieces that speak to you.
            </p>
            <Link href="/shop" style={{ display: 'inline-flex', padding: '14px 36px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(44,53,40,0.18)' }}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
