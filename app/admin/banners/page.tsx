// app/admin/banners/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  linkText?: string;
  position: 'hero' | 'mid' | 'offer' | 'category';
  isActive: boolean;
  sortOrder: number;
}

const EMPTY = { title: '', subtitle: '', image: '', mobileImage: '', link: '', linkText: '', position: 'hero' as const, isActive: true, sortOrder: 0 };
const POSITIONS = ['hero', 'mid', 'offer', 'category'];

export default function AdminBannersPage() {
  const [banners, setBanners]     = useState<Banner[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/banners').then(r => r.json()).then(d => setBanners(d.banners || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle || '', image: b.image, mobileImage: b.mobileImage || '', link: b.link || '', linkText: b.linkText || '', position: b.position, isActive: b.isActive, sortOrder: b.sortOrder });
    setEditId(b._id); setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'banner');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (d.url) { setForm(f => ({ ...f, [field]: d.url })); toast.success('Image uploaded'); }
      else toast.error('Upload failed');
    } catch { toast.error('Upload error'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) { toast.error('Please upload a banner image'); return; }
    setSubmitting(true);
    try {
      const url    = editId ? `/api/admin/banners/${editId}` : '/api/admin/banners';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(editId ? 'Banner updated' : 'Banner created'); setShowForm(false); load(); }
      else toast.error('Failed to save');
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/admin/banners/${b._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !b.isActive }) });
    toast.success(b.isActive ? 'Banner hidden' : 'Banner shown');
    load();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    toast.success('Deleted'); load();
  };

  const positionColors: Record<string, string> = { hero: '#7c3aed', mid: '#0284c7', offer: '#C9A96E', category: '#22c55e' };

  const inputStyle = { width: '100%', padding: '10px 13px', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '13px', fontFamily: 'inherit', background: '#FAFAF7', color: '#1A1A18' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2C3528', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3EE', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#2C3528', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: '#C9A96E', fontFamily: 'Georgia, serif', fontSize: '17px', textDecoration: 'none' }}>← aambish</Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', letterSpacing: '0.1em' }}>Banners</span>
        </div>
        <button onClick={openNew} style={{ background: '#C9A96E', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '2px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer' }}>
          + Add Banner
        </button>
      </div>

      <div style={{ padding: '28px' }}>
        {/* Info note */}
        <div style={{ background: 'white', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '4px', padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: '#3D4A38', lineHeight: 1.6, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', color: '#C9A96E', flexShrink: 0, marginTop: '1px' }}>✦</span>
          <span>Banners are displayed across your homepage and collection pages. <strong>Hero</strong> banners replace the main slider. <strong>Offer</strong> banners appear mid-page. <strong>Category</strong> banners appear in the shop. Upload images at 1920×600px for best results.</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '4px' }} />)}
          </div>
        ) : banners.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #ECEAE2', borderRadius: '4px', padding: '80px', textAlign: 'center' }}>
            <p style={{ color: '#8A8A7A', marginBottom: '20px' }}>No banners yet. Add your first banner to go live.</p>
            <button onClick={openNew} style={{ background: '#2C3528', color: 'white', padding: '10px 28px', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '13px' }}>Create Banner</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
            {banners.map(b => (
              <div key={b._id} style={{ background: 'white', border: '1px solid #ECEAE2', borderRadius: '4px', overflow: 'hidden', opacity: b.isActive ? 1 : 0.6 }}>
                {/* Image preview */}
                <div style={{ position: 'relative', height: '140px', background: '#F4F3EE' }}>
                  {b.image ? (
                    <Image src={b.image} alt={b.title} fill sizes="320px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A96E', fontSize: '32px' }}>🖼</div>
                  )}
                  {/* Position badge */}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, background: `${positionColors[b.position]}22`, color: positionColors[b.position], border: `1px solid ${positionColors[b.position]}44`, textTransform: 'capitalize' }}>
                    {b.position}
                  </span>
                  {/* Active badge */}
                  <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, background: b.isActive ? '#d1fae5' : '#f3f4f6', color: b.isActive ? '#065f46' : '#6b7280' }}>
                    {b.isActive ? 'Live' : 'Hidden'}
                  </span>
                </div>

                <div style={{ padding: '16px 18px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>{b.title || 'Untitled Banner'}</h4>
                  {b.subtitle && <p style={{ fontSize: '12px', color: '#8A8A7A', marginBottom: '4px' }}>{b.subtitle}</p>}
                  {b.link && <p style={{ fontSize: '11px', color: '#C9A96E', fontFamily: 'monospace' }}>{b.link}</p>}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button onClick={() => toggleActive(b)} style={{ flex: 1, padding: '7px', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: b.isActive ? '#fef3c7' : '#d1fae5', color: b.isActive ? '#92400e' : '#065f46' }}>
                      {b.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => openEdit(b)} style={{ flex: 1, padding: '7px', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '11px', cursor: 'pointer', background: 'transparent', color: '#C9A96E' }}>Edit</button>
                    <button onClick={() => deleteBanner(b._id)} style={{ padding: '7px 12px', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '11px', cursor: 'pointer', background: 'transparent', color: '#ef4444' }}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.6)', zIndex: 1000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: 'white', borderRadius: '4px', width: '100%', maxWidth: '640px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid #ECEAE2', background: '#FAFAF7' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 300 }}>{editId ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '22px', color: '#8A8A7A', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Banner Image Upload */}
              <div>
                <label style={labelStyle}>Banner Image * (1920×600px recommended)</label>
                <div style={{ border: '2px dashed rgba(201,169,110,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                  {form.image ? (
                    <div style={{ position: 'relative', height: '120px' }}>
                      <Image src={form.image} alt="Banner preview" fill sizes="600px" style={{ objectFit: 'cover' }} />
                      <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '14px' }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', cursor: 'pointer', color: '#8A8A7A' }}>
                      <span style={{ fontSize: '28px', marginBottom: '6px' }}>🖼</span>
                      <span style={{ fontSize: '12px' }}>{uploading ? 'Uploading...' : 'Click to upload banner image'}</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e, 'image')} disabled={uploading} />
                    </label>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: '#8A8A7A', marginTop: '4px' }}>Or paste a Cloudinary/CDN URL below:</p>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://res.cloudinary.com/..." style={{ ...inputStyle, marginTop: '6px' }} />
              </div>

              {/* Mobile Image */}
              <div>
                <label style={labelStyle}>Mobile Image (optional, 768×500px)</label>
                <input value={form.mobileImage} onChange={e => setForm(f => ({ ...f, mobileImage: e.target.value }))} placeholder="URL for mobile version (leave blank to use same image)" style={inputStyle} />
              </div>

              {/* Title + Subtitle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="The Grace Collection" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Minimalist luxury pieces" style={inputStyle} />
                </div>
              </div>

              {/* Link + Button Text */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Link URL</label>
                  <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/shop?collection=grace" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Button Text</label>
                  <input value={form.linkText} onChange={e => setForm(f => ({ ...f, linkText: e.target.value }))} placeholder="Shop Now" style={inputStyle} />
                </div>
              </div>

              {/* Position + Sort Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Position *</label>
                  <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value as Banner['position'] }))} style={{ ...inputStyle, background: 'white' }}>
                    {POSITIONS.map(p => <option key={p} value={p} style={{ textTransform: 'capitalize' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Sort Order (lower = first)</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                </div>
              </div>

              {/* Active toggle */}
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ accentColor: '#C9A96E', width: '15px', height: '15px' }} />
                <span style={{ color: '#2C3528', fontWeight: 500 }}>Show banner on website (live)</span>
              </label>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #ECEAE2' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #2C3528', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#2C3528', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Cancel</button>
                <button type="submit" disabled={submitting || uploading} style={{ padding: '10px 28px', background: submitting ? '#8A8A7A' : '#2C3528', color: 'white', border: 'none', borderRadius: '2px', fontSize: '12px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {submitting ? 'Saving...' : editId ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
