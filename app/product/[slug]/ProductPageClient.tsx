// app/product/[slug]/ProductPageClient.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from '@/lib/store';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function ProductPageClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const addRecent = useRecentlyViewedStore((s) => s.add);
  const wishlisted = isWishlisted(product._id);

  useEffect(() => { addRecent(product); }, [product._id]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    toast.success('Added to cart ✦');
    window.dispatchEvent(new Event('storage'));
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    window.location.href = '/checkout';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://aambish.com/product/${product.slug}`;
  const whatsappMsg = encodeURIComponent(`Check out "${product.name}" on Aambish Luxury 💍\n${shareUrl}`);

  const cardStyle = {
    background: 'linear-gradient(145deg, #FFFFFE 0%, #F8F7F3 100%)',
    border: '1px solid rgba(201,169,110,0.15)',
    borderRadius: '2px',
    boxShadow: '0 2px 16px rgba(201,169,110,0.08)',
  };

  return (
    <div className="page-content">
      {/* Breadcrumb */}
      <div style={{ background: 'linear-gradient(to bottom, #F8F7F3, #F4F3EE)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '12px 0' }}>
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#8A8A7A', fontFamily: 'DM Sans, sans-serif', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#8A8A7A' }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: '#8A8A7A' }}>Shop</Link>
            {product.category && (<><span>/</span><Link href={`/shop?category=${product.category.toLowerCase()}`} style={{ color: '#8A8A7A' }}>{product.category}</Link></>)}
            <span>/</span>
            <span style={{ color: '#2C3528' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: '56px 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '72px', alignItems: 'start' }} className="product-detail-grid">

          {/* ── Gallery ── */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--announce-height) + 20px)' }}>
            {/* Main image */}
            <div
              style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '2px', background: 'linear-gradient(160deg, #F4F3EE, #ECEAE2)', cursor: zoom ? 'zoom-out' : 'zoom-in', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 4px 32px rgba(201,169,110,0.1)' }}
              onClick={() => setZoom(!zoom)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoom(false)}
            >
              <Image
                src={product.images[activeImg]?.url || '/images/placeholder.jpg'}
                alt={product.images[activeImg]?.alt || product.name}
                fill priority
                sizes="(max-width:768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  transformOrigin: zoom ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                  transform: zoom ? 'scale(2.2)' : 'scale(1)',
                  transition: zoom ? 'none' : 'transform 0.4s ease',
                }}
              />
              {/* Glossy sheen */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.isNewArrival && <span style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '1px', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>New</span>}
                {discount > 0 && <span style={{ background: 'rgba(192,57,43,0.88)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '4px 10px', borderRadius: '1px', fontFamily: 'DM Sans, sans-serif' }}>−{discount}%</span>}
              </div>

              {/* Zoom hint */}
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(250,250,247,0.88)', backdropFilter: 'blur(6px)', padding: '5px 10px', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#8A8A7A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                Hover to zoom
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: '76px', height: '88px', position: 'relative', borderRadius: '2px', overflow: 'hidden', border: i === activeImg ? '2px solid #C9A96E' : '2px solid transparent', background: '#F4F3EE', cursor: 'pointer', boxShadow: i === activeImg ? '0 2px 12px rgba(201,169,110,0.2)' : 'none', transition: 'all 0.2s' }}>
                    <Image src={img.url} alt={img.alt || `View ${i+1}`} fill sizes="76px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            {product.collection && (
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#828e65', display: 'block', marginBottom: '10px' }}>
                {product.collection} Collection
              </span>
            )}

            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.9rem, 3vw, 2.8rem)', fontWeight: 300, color: '#1A1A18', lineHeight: 1.15, marginBottom: '16px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#C9A96E' : '#E8E8E0'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#2C3528', fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A' }}>({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '30px', color: '#2C3528', fontWeight: 400 }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && (
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '17px', color: '#8A8A7A', textDecoration: 'line-through' }}>
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: '#fef2f2', color: '#c0392b', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '2px' }}>
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Best price note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '22px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#828e65', fontWeight: 500 }}>
              <span>✦</span>
              <span>Best Price — Better than offline stores</span>
            </div>

            {/* Short desc */}
            {product.shortDescription && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#3D4A38', lineHeight: 1.85, marginBottom: '24px' }}>
                {product.shortDescription}
              </p>
            )}

            <div style={{ borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '22px', marginBottom: '22px' }}>
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '10px' }}>
                    {product.variants[0]?.name}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.variants.map((v) => (
                      <button key={v.value} onClick={() => setSelectedVariant(v.value)} style={{ padding: '9px 18px', border: `1px solid ${selectedVariant === v.value ? '#2C3528' : 'rgba(201,169,110,0.25)'}`, background: selectedVariant === v.value ? '#2C3528' : 'rgba(250,250,247,0.8)', color: selectedVariant === v.value ? 'white' : '#2C3528', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}>
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '10px' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', width: 'fit-content', background: 'rgba(250,250,247,0.8)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '11px 16px', fontSize: '18px', color: '#2C3528', lineHeight: 1 }}>−</button>
                  <span style={{ padding: '11px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1A1A18', minWidth: '44px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))} style={{ padding: '11px 16px', fontSize: '18px', color: '#2C3528', lineHeight: 1 }}>+</button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={handleAddToCart} disabled={product.inventory === 0} style={{ flex: 1, padding: '15px', background: 'transparent', color: '#2C3528', border: '1px solid #2C3528', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: product.inventory === 0 ? 'not-allowed' : 'pointer', opacity: product.inventory === 0 ? 0.5 : 1, transition: 'all 0.25s' }}
                onMouseEnter={e => { if (product.inventory > 0) { (e.currentTarget as HTMLButtonElement).style.background='#2C3528'; (e.currentTarget as HTMLButtonElement).style.color='#FAFAF7'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='transparent'; (e.currentTarget as HTMLButtonElement).style.color='#2C3528'; }}
              >
                {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={product.inventory === 0} style={{ flex: 1, padding: '15px', background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white', border: 'none', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: product.inventory === 0 ? 'not-allowed' : 'pointer', opacity: product.inventory === 0 ? 0.5 : 1, boxShadow: '0 4px 20px rgba(201,169,110,0.28)', transition: 'all 0.25s' }}>
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => { toggle(product._id); toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥'); }}
              style={{ width: '100%', padding: '13px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: wishlisted ? '#c0392b' : '#8A8A7A', background: wishlisted ? '#fef2f2' : 'rgba(250,250,247,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '22px', transition: 'all 0.25s' }}
            >
              <svg width="15" height="15" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {/* UPI Payment note */}
            <div style={{ background: 'linear-gradient(135deg, rgba(250,250,247,0.8), rgba(244,243,238,0.8))', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C9A96E" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#2C3528', marginBottom: '1px' }}>Pay via UPI</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>Google Pay · PhonePe · Paytm · BHIM</p>
              </div>
            </div>

            {/* Share */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Share:</span>
              <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 16px', background: '#25D366', color: 'white', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em' }}>WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 16px', background: '#1877F2', color: 'white', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em' }}>Facebook</a>
            </div>

            {/* Product details */}
            <div style={{ borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '22px' }}>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2C3528', marginBottom: '14px' }}>Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.material && (
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ color: '#8A8A7A', minWidth: '90px', flexShrink: 0 }}>Material</span>
                    <span style={{ color: '#2C3528' }}>{product.material}</span>
                  </div>
                )}
                {product.sku && (
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ color: '#8A8A7A', minWidth: '90px', flexShrink: 0 }}>SKU</span>
                    <span style={{ color: '#8A8A7A', fontFamily: 'monospace' }}>{product.sku}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ color: '#8A8A7A', minWidth: '90px', flexShrink: 0 }}>Availability</span>
                  <span style={{ color: product.inventory > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                    {product.inventory > 0 ? `In Stock (${product.inventory} pieces)` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div style={{ display: 'flex', gap: '18px', marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(201,169,110,0.18)', flexWrap: 'wrap' }}>
              {['✦ Latest Design', '⟡ Best Price', '⬡ Fast Delivery', '◎ UPI Secure'].map(b => (
                <span key={b} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Full Description ── */}
        {product.description && (
          <div style={{ borderTop: '1px solid rgba(201,169,110,0.18)', marginTop: '80px', paddingTop: '64px' }}>
            <div style={{ maxWidth: '740px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.2rem', fontWeight: 300, color: '#1A1A18', marginBottom: '28px' }}>About This Piece</h2>
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}
