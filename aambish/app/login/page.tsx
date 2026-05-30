// app/login/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { toast.success('Welcome back!'); router.push('/profile'); }
      else toast.error(data.message || 'Login failed');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '13px 15px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", color: '#1A1A18', background: 'rgba(250,250,247,0.8)', transition: 'border-color 0.2s' };

  return (
    <div className="page-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F4F3EE,#ECEAE2)', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px', padding: '48px 40px', boxShadow: '0 8px 40px rgba(201,169,110,0.1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '28px', color: '#2C3528', marginBottom: '4px' }}>aambish</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E' }}>— Luxury —</div>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right,transparent,#C9A96E,transparent)', margin: '16px auto 0' }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A7A', display: 'block', marginTop: '16px' }}>Welcome Back</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '2rem', fontWeight: 300, color: '#1A1A18', marginTop: '4px' }}>Sign In</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Email Address', key: 'email',    type: 'email'    },
            { label: 'Password',      key: 'password', type: 'password' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '7px' }}>{label}</label>
              <input type={type} value={(form as Record<string,string>)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A96E'}
                onBlur={e  => e.target.style.borderColor = 'rgba(201,169,110,0.25)'}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#8A8A7A' : 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', border: 'none', borderRadius: '2px', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '6px', boxShadow: loading ? 'none' : '0 4px 20px rgba(44,53,40,0.18)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#8A8A7A' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#C9A96E', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
