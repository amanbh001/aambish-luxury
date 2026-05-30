// app/contact/page.tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setSent(true);
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch { toast.error('Failed to send. Try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '13px 15px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", color: '#1A1A18', background: 'rgba(250,250,247,0.8)', transition: 'border-color 0.2s' };
  const labelStyle: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '8px' };

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>
      <div style={{ background: 'linear-gradient(to bottom,#F8F7F3,#F0EFE8)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '52px 0 36px' }}>
        <div className="container">
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '8px' }}>We're Here for You</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300 }}>Contact Us</h1>
        </div>
      </div>

      <div className="container section-pad">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '80px', alignItems: 'start' }} className="contact-grid">

          {/* Info */}
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, marginBottom: '20px' }}>Get in Touch</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#3D4A38', lineHeight: 1.85, marginBottom: '40px', fontSize: '14px' }}>
              Questions about an order, need styling advice, or want to explore a custom piece? Our team is happy to help.
            </p>

            {[
              { icon: '✉', label: 'Email', value: 'hello@aambish.com', href: 'mailto:hello@aambish.com' },
              { icon: '📱', label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
              { icon: '📸', label: 'Instagram', value: '@aambish.co', href: 'https://www.instagram.com/aambish.co' },
              { icon: '⏰', label: 'Hours', value: 'Mon–Sat, 10am–7pm IST', href: null },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '42px', height: '42px', background: 'linear-gradient(145deg,rgba(201,169,110,0.12),rgba(201,169,110,0.06))', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: '3px' }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", color: '#2C3528', fontSize: '14px', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}>{item.value}</a>
                  ) : (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#2C3528', fontSize: '14px' }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ marginTop: '36px', padding: '20px 22px', background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#8A8A7A', lineHeight: 1.7 }}>
                ✦ We typically respond within <strong style={{ color: '#2C3528' }}>2–4 business hours</strong> during working hours. For urgent queries, reach us on WhatsApp.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: '2px', padding: '36px', boxShadow: '0 4px 24px rgba(201,169,110,0.08)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(44,53,40,0.2)' }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#C9A96E" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', fontWeight: 300, marginBottom: '10px' }}>Message Received</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8A8A7A', fontSize: '14px', marginBottom: '24px' }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }} style={{ padding: '12px 28px', background: 'transparent', border: '1px solid rgba(201,169,110,0.4)', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', cursor: 'pointer' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='rgba(201,169,110,0.25)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="your@email.com" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='rgba(201,169,110,0.25)'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required style={{ ...inputStyle, background: 'rgba(250,250,247,0.9)' }}>
                    <option value="">Select a topic</option>
                    <option>Order Enquiry</option>
                    <option>Product Question</option>
                    <option>Custom Order</option>
                    <option>Gifting</option>
                    <option>Payment Help</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="How can we help you?" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='rgba(201,169,110,0.25)'} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#8A8A7A' : 'linear-gradient(135deg,#2C3528,#1A1A18)', color: 'white', border: 'none', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(44,53,40,0.18)' }}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.contact-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
