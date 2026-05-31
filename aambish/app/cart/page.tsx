// app/cart/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, appliedCoupon, applyCoupon, removeCoupon, getSubtotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal  = getSubtotal();
  const discount  = appliedCoupon?.discount || 0;
  const shipping  = subtotal - discount >= 2000 ? 0 : 99;
  const total     = subtotal - discount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res  = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode.toUpperCase(), cartValue: subtotal }) });
      const data = await res.json();
      if (data.valid) { applyCoupon(data.code, data.discount); toast.success(`Coupon applied! You save ₹${data.discount}`); }
      else toast.error(data.message || 'Invalid coupon code');
    } catch { toast.error('Failed to apply coupon'); }
    finally { setCouponLoading(false); }
  };

  const gloss = { background: 'linear-gradient(145deg, #FFFFFE 0%, #F8F7F3 100%)', border: '1px solid rgba(201,169,110,0.15)', boxShadow: '0 2px 16px rgba(201,169,110,0.07)' };

  if (items.length === 0) {
    return (
      <div className="page-content" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', background: 'linear-gradient(to bottom, #FAFAF7, #F4F3EE)' }}>
        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="rgba(201,169,110,0.4)" strokeWidth={1} style={{ marginBottom: '24px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
        </svg>
        <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2rem', color: '#2C3528', marginBottom: '12px', fontWeight: 300 }}>Your cart is empty</h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#8A8A7A', marginBottom: '32px', fontSize: '14px' }}>Discover graceful pieces for every occasion.</p>
        <Link href="/shop" style={{ display: 'inline-flex', padding: '14px 36px', background: '#2C3528', color: '#FAFAF7', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom, #FAFAF7, #F4F3EE)' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(to bottom, #F8F7F3, #F4F3EE)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '44px 0 32px' }}>
        <div className="container">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '8px' }}>Your Selection</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300 }}>Shopping Cart</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '52px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: '40px', alignItems: 'start' }} className="cart-grid">

          {/* Items */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A8A7A' }}>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              <button onClick={() => { clearCart(); toast('Cart cleared'); }} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Clear cart</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {items.map(item => (
                <div key={`${item.product._id}-${item.variant}`} style={{ ...gloss, padding: '20px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <Link href={`/product/${item.product.slug}`} style={{ flexShrink: 0 }}>
                    <div style={{ width: '88px', height: '108px', position: 'relative', borderRadius: '2px', overflow: 'hidden', background: '#F4F3EE', border: '1px solid rgba(201,169,110,0.15)' }}>
                      <Image src={item.product.images[0]?.url || '/images/placeholder.jpg'} alt={item.product.name} fill sizes="88px" style={{ objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {item.product.collection && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#828e65' }}>{item.product.collection}</span>}
                    <Link href={`/product/${item.product.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '18px', fontWeight: 400, color: '#1A1A18', marginTop: '4px', marginBottom: '4px' }}>{item.product.name}</h3>
                    </Link>
                    {item.variant && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', marginBottom: '6px' }}>Size: {item.variant}</p>}
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: '#2C3528', fontSize: '14px', marginBottom: '14px' }}>₹{item.product.price.toLocaleString('en-IN')}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', background: 'rgba(250,250,247,0.8)' }}>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={{ padding: '8px 13px', fontSize: '16px', color: '#2C3528', background: 'none', border: 'none', cursor: 'pointer' }}>−</button>
                        <span style={{ padding: '8px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, minWidth: '36px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={{ padding: '8px 13px', fontSize: '16px', color: '#2C3528', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#2C3528' }}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        <button onClick={() => { removeItem(item.product._id); toast('Item removed'); }} style={{ color: '#8A8A7A', fontSize: '20px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Remove">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ ...gloss, padding: '28px', position: 'sticky', top: 'calc(var(--nav-height) + var(--announce-height) + 20px)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, marginBottom: '24px' }}>Order Summary</h3>

            {/* Coupon */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '9px' }}>Coupon Code</label>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2px' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#166534', fontWeight: 600 }}>✓ {appliedCoupon.code} applied</span>
                  <button onClick={() => { removeCoupon(); setCouponCode(''); toast('Coupon removed'); }} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#dc2626', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    style={{ flex: 1, padding: '10px 13px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', background: 'rgba(250,250,247,0.8)', letterSpacing: '0.06em', color: '#1A1A18' }} />
                  <button onClick={handleApplyCoupon} disabled={couponLoading} style={{ padding: '10px 16px', background: '#2C3528', color: 'white', border: 'none', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', flexShrink: 0 }}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                <span style={{ color: '#8A8A7A' }}>Subtotal</span>
                <span style={{ color: '#2C3528' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                  <span style={{ color: '#22c55e' }}>Discount</span>
                  <span style={{ color: '#22c55e' }}>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                <span style={{ color: '#8A8A7A' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : '#1A1A18', fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A', background: 'rgba(201,169,110,0.08)', padding: '9px 12px', borderRadius: '2px' }}>
                  Add ₹{(2000 - (subtotal - discount)).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '17px', fontWeight: 700, borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '14px', marginTop: '4px' }}>
                <span style={{ color: '#2C3528' }}>Total</span>
                <span style={{ color: '#2C3528' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', background: 'linear-gradient(135deg, #2C3528, #1A1A18)', color: '#FAFAF7', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', marginBottom: '12px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(44,53,40,0.18)' }}>
              Proceed to Checkout
            </Link>

            {/* UPI note */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A', marginBottom: '18px' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>
              Pay via UPI — GPay · PhonePe · Paytm
            </div>

            <Link href="/shop" style={{ display: 'block', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', textDecoration: 'underline' }}>
              Continue Shopping
            </Link>

            <div style={{ display: 'flex', gap: '14px', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid rgba(201,169,110,0.15)', justifyContent: 'center' }}>
              {['✦ Latest Designs', '⟡ Best Price', '⬡ Fast Delivery'].map(t => (
                <span key={t} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: '#8A8A7A' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){ .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
