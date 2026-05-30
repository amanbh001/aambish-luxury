// app/register/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Stage = 'form' | 'otp';

export default function RegisterPage() {
  const router = useRouter();
  const [stage,   setStage]   = useState<Stage>('form');
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp,     setOtp]     = useState('');

  const inputStyle = { width: '100%', padding: '13px 15px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", color: '#1A1A18', background: 'rgba(250,250,247,0.8)', transition: 'border-color 0.2s' };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      const data = await res.json();
      if (res.ok) { toast.success('OTP sent to your email'); setStage('otp'); }
      else toast.error(data.message || 'Registration failed');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, otp }) });
      const data = await res.json();
      if (res.ok) { toast.success('Account created! Welcome to Aambish.'); router.push('/profile'); }
      else toast.error(data.message || 'Invalid OTP');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F4F3EE,#ECEAE2)', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px', padding: '48px 40px', boxShadow: '0 8px 40px rgba(201,169,110,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '28px', color: '#2C3528' }}>aambish</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E' }}>— Luxury —</div>
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right,transparent,#C9A96E,transparent)', margin: '16px auto 0' }} />
        </div>

        {stage === 'form' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A7A', display: 'block' }}>Join Aambish</span>
              <h1 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '2rem', fontWeight: 300, color: '#1A1A18', marginTop: '4px' }}>Create Account</h1>
            </div>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Full Name',        key: 'name',    type: 'text'     },
                { label: 'Email Address',    key: 'email',   type: 'email'    },
                { label: 'Password',         key: 'password', type: 'password' },
                { label: 'Confirm Password', key: 'confirm', type: 'password'  },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', display: 'block', marginBottom: '7px' }}>{label}</label>
                  <input type={type} value={(form as Record<string,string>)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor='#C9A96E'}
                    onBlur={e  => e.target.style.borderColor='rgba(201,169,110,0.25)'}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#8A8A7A' : 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', border: 'none', borderRadius: '2px', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px', boxShadow: loading ? 'none' : '0 4px 20px rgba(44,53,40,0.18)' }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '22px', fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#8A8A7A' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#C9A96E', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(201,169,110,0.15),rgba(201,169,110,0.06))', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '22px' }}>✉</div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8A7A' }}>Verification</span>
              <h1 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '2rem', fontWeight: 300, color: '#1A1A18', marginTop: '4px', marginBottom: '10px' }}>Enter OTP</h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#8A8A7A', fontSize: '13px', lineHeight: 1.7 }}>
                We sent a 6-digit code to<br />
                <strong style={{ color: '#2C3528' }}>{form.email}</strong>
              </p>
            </div>
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text" placeholder="Enter 6-digit OTP" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                required maxLength={6}
                style={{ ...inputStyle, fontSize: '28px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '0.3em', padding: '16px' }}
                onFocus={e => e.target.style.borderColor='#C9A96E'}
                onBlur={e  => e.target.style.borderColor='rgba(201,169,110,0.25)'}
              />
              <button type="submit" disabled={loading || otp.length < 6} style={{ padding: '15px', background: (loading || otp.length < 6) ? '#8A8A7A' : 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', border: 'none', borderRadius: '2px', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer', boxShadow: 'none' }}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
            <button onClick={() => { setStage('form'); setOtp(''); }} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '14px', fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#8A8A7A', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Back to registration
            </button>
          </>
        )}
      </div>
    </div>
  );
}
