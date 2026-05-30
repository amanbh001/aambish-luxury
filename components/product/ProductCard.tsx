// components/product/ProductCard.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore, useWishlistStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product._id);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article
        onMouseEnter={() => { setHovered(true); if (product.images.length > 1) setImgIdx(1); }}
        onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
        style={{
          background: 'linear-gradient(145deg, #FFFFFE 0%, #F8F7F3 100%)',
          borderRadius: '2px',
          overflow: 'hidden',
          border: '1px solid rgba(201,169,110,0.15)',
          boxShadow: hovered
            ? '0 12px 48px rgba(201,169,110,0.18), 0 2px 12px rgba(0,0,0,0.06)'
            : '0 2px 16px rgba(201,169,110,0.08)',
          transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          transform: hovered ? 'translateY(-4px)' : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'linear-gradient(160deg, #F4F3EE, #ECEAE2)' }}>
          <Image
            src={product.images[imgIdx]?.url || '/images/placeholder.jpg'}
            alt={product.images[imgIdx]?.alt || product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            priority={priority}
            style={{
              objectFit: 'cover',
              transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Subtle glossy sheen overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {product.isNewArrival && (
              <span style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '1px', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>New</span>
            )}
            {product.isBestSeller && (
              <span style={{ background: '#2C3528', color: '#E8D5A8', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '1px', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>Best Seller</span>
            )}
            {discount > 0 && (
              <span style={{ background: 'rgba(192,57,43,0.9)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: '1px', fontFamily: 'DM Sans, sans-serif' }}>−{discount}%</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(250,250,247,0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: wishlisted ? '#c0392b' : '#8A8A7A',
              border: wishlisted ? '1px solid rgba(192,57,43,0.3)' : '1px solid rgba(255,255,255,0.6)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(6px)',
              transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <svg width="15" height="15" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          {/* Add to Cart — slides up on hover */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}>
            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              style={{
                width: '100%', padding: '11px',
                background: 'rgba(44,53,40,0.93)',
                backdropFilter: 'blur(12px)',
                color: '#E8D5A8',
                fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                border: 'none', borderRadius: '2px', cursor: 'pointer',
              }}
            >
              {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 14px 17px' }}>
          {product.collection && (
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#828e65' }}>
              {product.collection}
            </span>
          )}
          <h3 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '16px', fontWeight: 400,
            color: '#1A1A18', marginTop: '4px', marginBottom: '8px', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Stars */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '9px' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#C9A96E' : '#E8E8E0'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>
                ({product.reviewCount})
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#2C3528' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', textDecoration: 'line-through' }}>
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#C9A96E', fontWeight: 600 }}>
                {discount}% off
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
