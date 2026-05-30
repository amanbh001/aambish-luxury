// app/admin/coupons/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minCartValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
  description?: string;
}

const EMPTY_FORM = { code: '', type: 'percentage' as 'percentage' | 'flat', value: '', minCartValue: '0', maxDiscount: '', usageLimit: '', description: '', expiresAt: '', isActive: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/coupons').then(r => r.json()).then(d => setCoupons(d.coupons || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (c: Coupon) => {
    setForm({ code: c.code, type: c.type, value: String(c.value), minCartValue: String(c.minCartValue), maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '', usageLimit: c.usageLimit ? String(c.usageLimit) : '', description: c.description || '', expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '', isActive: c.isActive });
    setEditId(c._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, value: parseFloat(form.value), minCartValue: parseFloat(form.minCartValue || '0'), maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined, usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined, expiresAt: form.expiresAt || undefined };
    try {
      const url = editId ? `/api/admin/coupons/${editId}` : '/api/admin/coupons';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(editId ? 'Coupon updated' : 'Coupon created'); setShowForm(false); load(); }
      else { const d = await res.json(); toast.error(d.message || 'Failed'); }
    } catch { toast.error('Error saving coupon'); }
    finally { setSubmitting(false); }
  };

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !c.isActive }) });
    toast.success(c.isActive ? 'Coupon deactivated' : 'Coupon activated');
    load();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    toast.success('Coupon deleted');
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F0EB', fontFamily: 'var(--font-body)' }}>
      <div style={{ background: 'var(--forest)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>← Admin</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Coupons</span>
        </div>
        <button onClick={openNew} className="btn-gold" style={{ padding: '8px 20px', fontSize: '12px' }}>+ New Coupon</button>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '4px' }} />)
          ) : coupons.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
              <p style={{ fontSize: '18px', marginBottom: '16px' }}>No coupons yet</p>
              <button onClick={openNew} className="btn-primary">Create First Coupon</button>
            </div>
          ) : (
            coupons.map(c => (
              <div key={c._id} style={{ background: 'white', border: `1px solid ${c.isActive ? 'var(--border)' : '#fca5a5'}`, borderRadius: '4px', padding: '24px', position: 'relative', opacity: c.isActive ? 1 : 0.7 }}>
                {/* Active badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <button onClick={() => toggleActive(c)} style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: c.isActive ? '#d1fae5' : '#fee2e2', color: c.isActive ? '#065f46' : '#991b1b', cursor: 'pointer', border: 'none' }}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--ivory-deep)', border: '1px dashed var(--gold)', borderRadius: '4px', padding: '8px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: 'var(--forest)', letterSpacing: '0.1em' }}>{c.code}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gold)' }}>
                      {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </p>
                    {c.description && <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{c.description}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {c.minCartValue > 0 && <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '2px', color: '#6b7280' }}>Min: ₹{c.minCartValue.toLocaleString('en-IN')}</span>}
                  {c.maxDiscount && <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '2px', color: '#6b7280' }}>Max: ₹{c.maxDiscount}</span>}
                  {c.usageLimit && <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '2px', color: '#6b7280' }}>Used: {c.usageCount}/{c.usageLimit}</span>}
                  {c.expiresAt && <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '2px', color: '#6b7280' }}>Expires: {new Date(c.expiresAt).toLocaleDateString('en-IN')}</span>}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => openEdit(c)} style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'underline' }}>Edit</button>
                  <button onClick={() => deleteCoupon(c._id)} style={{ fontSize: '12px', color: '#ef4444', textDecoration: 'underline' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '4px', padding: '40px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{editId ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '24px', color: 'var(--muted)' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Code */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="e.g. AMBISH10" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '0.1em' }} />
              </div>

              {/* Type + Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Discount Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percentage' | 'flat' })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', background: 'white' }}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Value *</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required min="1" placeholder={form.type === 'percentage' ? '10' : '100'} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              {/* Min Cart + Max Discount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Min Cart Value (₹)</label>
                  <input type="number" value={form.minCartValue} onChange={e => setForm({ ...form, minCartValue: e.target.value })} min="0" placeholder="0" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
                {form.type === 'percentage' && (
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Max Discount (₹)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} min="0" placeholder="Optional cap" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                  </div>
                )}
              </div>

              {/* Usage Limit + Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} min="1" placeholder="Unlimited" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Description (internal)</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Welcome offer for new users" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
              </div>

              {/* Active toggle */}
              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <span style={{ color: 'var(--forest)', fontWeight: 500 }}>Active (visible to customers)</span>
              </label>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '10px 24px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '10px 28px', fontSize: '13px' }}>
                  {submitting ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
