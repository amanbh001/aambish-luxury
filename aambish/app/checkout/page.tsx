// app/checkout/page.tsx — UPI only, no COD option
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

type Step = 'address' | 'payment';

const FIELD_DEF = [
  { label: 'Full Name',              key: 'name',    type: 'text',  span: true,  req: true },
  { label: 'Email Address',          key: 'email',   type: 'email', span: false, req: true },
  { label: 'Phone Number',           key: 'phone',   type: 'tel',   span: false, req: true },
  { label: 'Address Line 1',         key: 'line1',   type: 'text',  span: true,  req: true },
  { label: 'Address Line 2 (Optional)', key: 'line2', type: 'text', span: true,  req: false },
  { label: 'City',                   key: 'city',    type: 'text',  span: false, req: true },
  { label: 'State',                  key: 'state',   type: 'text',  span: false, req: true },
  { label: 'PIN Code',               key: 'pincode', type: 'text',  span: false, req: true },
  { label: 'Country',                key: 'country', type: 'text',  span: false, req: false },
];

export default function CheckoutPage() {
  const router  = useRouter();
  const { items, getSubtotal, appliedCoupon, clearCart } = useCartStore();
  const [step,    setStep]    = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '',
    state: '', pincode: '', country: 'India',
  });

  const subtotal = getSubtotal();
  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal - discount >= 2000 ? 0 : 99;
  const total    = subtotal - discount + shipping;

  useEffect(() => { if (items.length === 0) router.push('/cart'); }, [items]);

  const gloss = {
    background: 'linear-gradient(145deg,#FFFFFE 0%,#F8F7F3 100%)',
    border: '1px solid rgba(201,169,110,0.15)',
    borderRadius: '2px',
    boxShadow: '0 2px 16px rgba(201,169,110,0.07)',
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px',
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
    color: '#1A1A18', background: 'rgba(250,250,247,0.8)',
    transition: 'border-color 0.2s',
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.images[0]?.url, price: i.product.price, quantity: i.quantity, variant: i.variant })),
          subtotal, discount, shipping, total,
          couponCode: appliedCoupon?.code,
          shippingAddress: address,
          paymentMethod: 'upi',
        }),
      });
      const { orderId, razorpayOrderId, orderNumber } = await res.json();

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => {
        const opts = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: 'INR',
          name: 'Aambish Luxury',
          description: `Order ${orderNumber}`,
          order_id: razorpayOrderId,
          prefill: { name: address.name, email: address.email, contact: address.phone },
          theme: { color: '#C9A96E' },
          method: { upi: true, card: true, netbanking: true, wallet: true },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            await fetch('/api/orders/verify-payment', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId, ...response }),
            });
            clearCart();
            router.push(`/thankyou?order=${orderNumber}`);
          },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        };
        // @ts-expect-error Razorpay global
        new window.Razorpay(opts).open();
      };
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const UPI_APPS = [
    { name: 'Google Pay', color: '#4285F4' },
    { name: 'PhonePe',    color: '#5F259F' },
    { name: 'Paytm',      color: '#00BAF2' },
    { name: 'BHIM',       color: '#00A859' },
  ];

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom,#F8F7F3,#F0EFE8)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '44px 0 32px' }}>
        <div className="container">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '8px' }}>Secure Checkout</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300 }}>Complete Your Order</h1>

          {/* Steps */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '18px' }}>
            {['Address','Payment'].map((s, i) => {
              const done   = i === 0 && step === 'payment';
              const active = (i === 0 && step === 'address') || (i === 1 && step === 'payment');
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
                    background: done ? 'linear-gradient(135deg,#C9A96E,#A07840)' : active ? '#2C3528' : 'rgba(201,169,110,0.15)',
                    color: (done || active) ? 'white' : '#8A8A7A',
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? '#2C3528' : '#8A8A7A' }}>{s}</span>
                  {i === 0 && <span style={{ color: 'rgba(201,169,110,0.4)', fontSize: '16px', margin: '0 4px' }}>→</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '52px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '52px', alignItems: 'start' }} className="checkout-grid">

          {/* Left — Form */}
          <div>
            {step === 'address' ? (
              <form onSubmit={handleAddressSubmit}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 300, marginBottom: '24px' }}>Delivery Address</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {FIELD_DEF.map(({ label, key, type, span, req }) => (
                    <div key={key} style={{ gridColumn: span ? 'span 2' : 'span 1' }}>
                      <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '7px' }}>{label}</label>
                      <input
                        type={type}
                        value={(address as Record<string, string>)[key]}
                        onChange={e => setAddress({ ...address, [key]: e.target.value })}
                        required={req}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = '#C9A96E')}
                        onBlur={e  => (e.target.style.borderColor = 'rgba(201,169,110,0.25)')}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" style={{ width: '100%', marginTop: '28px', padding: '15px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', border: 'none', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 20px rgba(44,53,40,0.18)' }}>
                  Continue to Payment →
                </button>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 300 }}>Payment</h3>
                  <button onClick={() => setStep('address')} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#C9A96E', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>← Edit Address</button>
                </div>

                {/* Address preview */}
                <div style={{ ...gloss, padding: '18px 20px', marginBottom: '28px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: '#3D4A38', lineHeight: 1.75 }}>
                  <strong style={{ color: '#1A1A18' }}>{address.name}</strong><br />
                  {address.line1}{address.line2 && `, ${address.line2}`}<br />
                  {address.city}, {address.state} – {address.pincode}<br />
                  <span style={{ color: '#8A8A7A' }}>{address.phone}</span>
                </div>

                {/* UPI payment block */}
                <div style={{ ...gloss, padding: '28px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(201,169,110,0.15),rgba(201,169,110,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(201,169,110,0.2)' }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C9A96E" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1A1A18' }}>Pay via UPI</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A' }}>Fast · Secure · Instant confirmation</p>
                    </div>
                  </div>

                  {/* UPI app logos */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {UPI_APPS.map(app => (
                      <div key={app.name} style={{ padding: '8px 16px', background: `${app.color}14`, border: `1px solid ${app.color}30`, borderRadius: '4px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: app.color }}>
                        {app.name}
                      </div>
                    ))}
                    <div style={{ padding: '8px 16px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '4px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#C9A96E' }}>
                      + All UPI Apps
                    </div>
                  </div>

                  <button
                    onClick={handleRazorpay}
                    disabled={loading}
                    style={{ width: '100%', padding: '16px', background: loading ? '#8A8A7A' : 'linear-gradient(135deg,#C9A96E,#A07840)', color: 'white', border: 'none', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 24px rgba(201,169,110,0.3)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    {loading ? (
                      <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Processing...</>
                    ) : (
                      <>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>
                        Pay ₹{total.toLocaleString('en-IN')} via UPI
                      </>
                    )}
                  </button>
                </div>

                {/* Card / Netbanking note */}
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', textAlign: 'center', lineHeight: 1.6 }}>
                  Card & Netbanking also accepted via Razorpay secure gateway.
                </p>

                {/* SSL note */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>
                  256-bit SSL encrypted · Your data is safe
                </div>
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div style={{ ...gloss, padding: '26px', position: 'sticky', top: 'calc(var(--nav-height) + var(--announce-height) + 20px)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', fontWeight: 300, marginBottom: '22px' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              {items.map(item => (
                <div key={item.product._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '54px', height: '66px', flexShrink: 0, background: '#F4F3EE', borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.15)' }}>
                    <Image src={item.product.images[0]?.url || '/images/placeholder.jpg'} alt={item.product.name} fill sizes="54px" style={{ objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'linear-gradient(135deg,#C9A96E,#A07840)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, color: '#1A1A18', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                    {item.variant && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A' }}>Size: {item.variant}</p>}
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#2C3528', flexShrink: 0 }}>
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                <span style={{ color: '#8A8A7A' }}>Subtotal</span>
                <span style={{ color: '#1A1A18' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                  <span style={{ color: '#22c55e' }}>Discount ({appliedCoupon?.code})</span>
                  <span style={{ color: '#22c55e' }}>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                <span style={{ color: '#8A8A7A' }}>Shipping</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : '#1A1A18', fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: '17px', fontWeight: 700, borderTop: '1px solid rgba(201,169,110,0.18)', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: '#2C3528' }}>Total</span>
                <span style={{ color: '#2C3528' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width:900px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
