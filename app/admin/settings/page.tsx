// app/admin/settings/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Settings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  announcementText: string;
  announcementActive: boolean;
  shippingFreeAbove: number;
  shippingCharge: number;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  razorpayKeyId: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Aambish Luxury', tagline: 'Fine Jewellery for the Modern Woman',
    email: '', phone: '', address: '', announcementText: '', announcementActive: true,
    shippingFreeAbove: 2000, shippingCharge: 99,
    googleAnalyticsId: '', googleTagManagerId: '', metaPixelId: '',
    instagramUrl: '', facebookUrl: '', whatsappNumber: '', razorpayKeyId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { if (d.settings) setSettings(s => ({ ...s, ...d.settings })); }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if (res.ok) toast.success('Settings saved successfully');
      else toast.error('Failed to save settings');
    } catch { toast.error('Error saving settings'); }
    finally { setSaving(false); }
  };

  const uploadFile = async (file: File, type: 'logo' | 'favicon') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const d = await res.json();
      if (d.url) toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`);
    } catch { toast.error('Upload failed'); }
  };

  const TABS = [
    { key: 'general', label: 'General' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'analytics', label: 'Analytics & Ads' },
    { key: 'social', label: 'Social & Contact' },
    { key: 'payments', label: 'Payments' },
  ];

  const Field = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px', alignItems: 'start', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--forest)', marginBottom: '4px' }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</p>}
      </div>
      <div>{children}</div>
    </div>
  );

  const Input = ({ value, onChange, placeholder, type = 'text' }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--charcoal)' }}
      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  );

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--muted)' }}>Loading settings...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F0EB', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ background: 'var(--forest)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>← Admin</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Settings</span>
        </div>
        <button onClick={save} disabled={saving} className="btn-gold" style={{ padding: '8px 24px', fontSize: '12px' }}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Tab nav */}
        <aside style={{ width: '180px', background: 'white', borderRight: '1px solid var(--border)', paddingTop: '16px', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', fontSize: '13px', fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? 'var(--forest)' : 'var(--muted)', background: activeTab === t.key ? 'var(--ivory-deep)' : 'transparent', borderLeft: activeTab === t.key ? '3px solid var(--gold)' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '32px 40px', maxWidth: '820px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '8px', color: 'var(--charcoal)' }}>
            {TABS.find(t => t.key === activeTab)?.label}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '32px' }}>
            Changes are saved globally across your site.
          </p>

          {activeTab === 'general' && (
            <div>
              <Field label="Site Name" desc="Your brand name displayed in the browser tab and emails">
                <Input value={settings.siteName} onChange={v => setSettings(s => ({ ...s, siteName: v }))} placeholder="Aambish Luxury" />
              </Field>
              <Field label="Tagline" desc="Short brand description used in SEO meta tags">
                <Input value={settings.tagline} onChange={v => setSettings(s => ({ ...s, tagline: v }))} placeholder="Fine Jewellery for the Modern Woman" />
              </Field>
              <Field label="Announcement Bar" desc="The scrolling banner shown at the top of every page">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Input value={settings.announcementText} onChange={v => setSettings(s => ({ ...s, announcementText: v }))} placeholder="✦ Free Shipping on Orders Above ₹2,000" />
                  <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={settings.announcementActive} onChange={e => setSettings(s => ({ ...s, announcementActive: e.target.checked }))} />
                    <span>Show announcement bar</span>
                  </label>
                </div>
              </Field>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <Field label="Logo" desc="Upload your logo. Recommended: PNG with transparent background, 300×100px minimum">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ width: '180px', height: '60px', background: 'var(--ivory-deep)', border: '1px dashed var(--border)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/images/logo.png" alt="Logo preview" style={{ maxHeight: '48px', maxWidth: '160px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'logo')} />
                  <button onClick={() => logoRef.current?.click()} className="btn-outline" style={{ padding: '9px 20px', fontSize: '12px', width: 'fit-content' }}>Upload New Logo</button>
                  <p style={{ fontSize: '11px', color: 'var(--muted)' }}>This also updates the logo shown in emails and the admin panel.</p>
                </div>
              </Field>
              <Field label="Favicon" desc="The small icon shown in the browser tab. Upload a 32×32px ICO or PNG file">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--ivory-deep)', border: '1px dashed var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/favicon.ico" alt="Favicon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <input ref={faviconRef} type="file" accept="image/x-icon,image/png" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'favicon')} />
                  <button onClick={() => faviconRef.current?.click()} className="btn-outline" style={{ padding: '9px 20px', fontSize: '12px', width: 'fit-content' }}>Upload Favicon</button>
                </div>
              </Field>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <Field label="Free Shipping Threshold" desc="Orders above this amount get free shipping">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '13px' }}>₹</span>
                  <input type="number" value={settings.shippingFreeAbove} onChange={e => setSettings(s => ({ ...s, shippingFreeAbove: parseInt(e.target.value) }))} min="0" style={{ width: '100%', padding: '10px 12px 10px 28px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </Field>
              <Field label="Standard Shipping Charge" desc="Charged on orders below the free shipping threshold">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '13px' }}>₹</span>
                  <input type="number" value={settings.shippingCharge} onChange={e => setSettings(s => ({ ...s, shippingCharge: parseInt(e.target.value) }))} min="0" style={{ width: '100%', padding: '10px 12px 10px 28px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </Field>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <Field label="Google Analytics ID" desc="Your GA4 Measurement ID (e.g. G-XXXXXXXXXX)">
                <Input value={settings.googleAnalyticsId} onChange={v => setSettings(s => ({ ...s, googleAnalyticsId: v }))} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="Google Tag Manager ID" desc="Your GTM Container ID (e.g. GTM-XXXXXXX)">
                <Input value={settings.googleTagManagerId} onChange={v => setSettings(s => ({ ...s, googleTagManagerId: v }))} placeholder="GTM-XXXXXXX" />
              </Field>
              <Field label="Meta Pixel ID" desc="Your Facebook/Meta Pixel ID for conversion tracking">
                <Input value={settings.metaPixelId} onChange={v => setSettings(s => ({ ...s, metaPixelId: v }))} placeholder="XXXXXXXXXXXXXXXXXX" />
              </Field>
              <div style={{ marginTop: '24px', padding: '16px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '4px', fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                ⚠ After saving, these IDs are injected into every page via the site layout. Changes take effect on the next deployment or server restart.
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <Field label="Email Address" desc="Support email shown on the contact page and in emails">
                <Input value={settings.email} onChange={v => setSettings(s => ({ ...s, email: v }))} placeholder="hello@aambish.com" type="email" />
              </Field>
              <Field label="Phone / WhatsApp Number" desc="Include country code, e.g. +919876543210">
                <Input value={settings.phone} onChange={v => setSettings(s => ({ ...s, phone: v }))} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Business Address" desc="Shown in the footer and contact page">
                <textarea value={settings.address} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} rows={3} placeholder="123, Jewellery Lane, New Delhi – 110001" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', resize: 'vertical' }} />
              </Field>
              <Field label="Instagram URL">
                <Input value={settings.instagramUrl} onChange={v => setSettings(s => ({ ...s, instagramUrl: v }))} placeholder="https://instagram.com/aambishluxury" />
              </Field>
              <Field label="Facebook URL">
                <Input value={settings.facebookUrl} onChange={v => setSettings(s => ({ ...s, facebookUrl: v }))} placeholder="https://facebook.com/aambishluxury" />
              </Field>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <Field label="Razorpay Key ID" desc="Your public Razorpay Key ID (starts with rzp_live_ or rzp_test_)">
                <Input value={settings.razorpayKeyId} onChange={v => setSettings(s => ({ ...s, razorpayKeyId: v }))} placeholder="rzp_live_XXXXXXXXXXXXXXXX" />
              </Field>
              <div style={{ marginTop: '24px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '13px', color: '#166534', lineHeight: 1.7 }}>
                🔒 The Razorpay Secret Key must be set via the <strong>RAZORPAY_KEY_SECRET</strong> environment variable in your Vercel dashboard — never store secrets here.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
