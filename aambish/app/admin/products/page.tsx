// app/admin/products/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Product } from '@/types';

const EMPTY_FORM = {
  name: '', slug: '', shortDescription: '', description: '',
  price: '', comparePrice: '', category: '', collection: '',
  sku: '', inventory: '', material: '', weight: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false, isTrending: false,
  rating: '0', reviewCount: '0',
  metaTitle: '', metaDescription: '',
  tags: '',
};

const CATEGORIES = ['Rings','Necklaces','Earrings','Bracelets','Sets','Pendants','Anklets','Maang Tikka'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic'|'description'|'seo'|'rating'>('basic');
  const PER_PAGE = 20;

  const load = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ limit: String(PER_PAGE), page: String(page) });
    if (search) q.set('q', search);
    fetch(`/api/products?${q}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const openNew = () => {
    setForm(EMPTY_FORM); setEditSlug(null); setActiveTab('basic'); setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      price: String(p.price),
      comparePrice: p.comparePrice ? String(p.comparePrice) : '',
      category: p.category, collection: p.collection || '',
      sku: p.sku, inventory: String(p.inventory),
      material: p.material || '', weight: p.weight ? String(p.weight) : '',
      isFeatured: p.isFeatured, isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller, isTrending: p.isTrending,
      rating: String(p.rating || 0), reviewCount: String(p.reviewCount || 0),
      metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '',
      tags: (p.tags || []).join(', '),
    });
    setEditSlug(p.slug); setActiveTab('basic'); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      inventory: parseInt(form.inventory) || 0,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      rating: parseFloat(form.rating) || 0,
      reviewCount: parseInt(form.reviewCount) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      const url = editSlug ? `/api/products/${editSlug}` : '/api/products';
      const method = editSlug ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editSlug ? 'Product updated!' : 'Product created!');
        setShowForm(false); load();
      } else {
        const d = await res.json(); toast.error(d.message || 'Failed to save');
      }
    } catch { toast.error('Error saving product'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    toast.success('Product deleted'); load();
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  const inputStyle = {
    width: '100%', padding: '10px 13px',
    border: '1px solid #E8E8E0', borderRadius: '2px',
    fontSize: '13px', fontFamily: 'inherit',
    background: '#FAFAF7', color: '#1A1A18',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600 as const,
    letterSpacing: '0.08em', textTransform: 'uppercase' as const,
    color: '#2C3528', marginBottom: '6px',
  };

  const FORM_TABS = [
    { key: 'basic' as const, label: 'Basic Info' },
    { key: 'description' as const, label: 'Description' },
    { key: 'rating' as const, label: 'Rating' },
    { key: 'seo' as const, label: 'SEO' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3EE', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Admin Header */}
      <div style={{ background: '#2C3528', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/admin" style={{ color: '#C9A96E', fontFamily: 'Georgia, serif', fontSize: '17px' }}>← aambish</Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', letterSpacing: '0.1em' }}>Products</span>
          <span style={{ background: 'rgba(201,169,110,0.2)', color: '#C9A96E', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{total} total</span>
        </div>
        <button onClick={openNew} style={{ background: '#C9A96E', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '2px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer' }}>
          + Add Product
        </button>
      </div>

      {/* Controls */}
      <div style={{ padding: '20px 28px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search products by name, SKU, category..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ ...inputStyle, width: '320px', padding: '10px 16px', background: 'white' }}
        />
        <span style={{ fontSize: '13px', color: '#8A8A7A' }}>
          Showing {products.length} of {total} products (page {page} / {totalPages || 1})
        </span>
      </div>

      {/* Table */}
      <div style={{ padding: '0 28px 32px' }}>
        <div style={{ background: 'white', border: '1px solid #ECEAE2', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(201,169,110,0.07)' }}>
          {/* Table Head */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 0.8fr 0.8fr 1.2fr 0.9fr', gap: '8px', padding: '11px 16px', background: '#F4F3EE', borderBottom: '1px solid #ECEAE2' }}>
            {['Product', 'Category', 'Price', 'Stock', 'Flags', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A7A' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8A8A7A' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <p style={{ color: '#8A8A7A', marginBottom: '20px', fontSize: '14px' }}>No products found</p>
              <button onClick={openNew} style={{ background: '#2C3528', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '13px' }}>Add First Product</button>
            </div>
          ) : (
            products.map((p, i) => (
              <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 0.8fr 0.8fr 1.2fr 0.9fr', gap: '8px', padding: '13px 16px', borderBottom: '1px solid #ECEAE2', background: i % 2 === 0 ? 'white' : '#FEFEFE', alignItems: 'center' }}>
                {/* Product */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
                  {p.images?.[0] ? (
                    <div style={{ width: '44px', height: '54px', position: 'relative', flexShrink: 0, borderRadius: '2px', overflow: 'hidden', background: '#F4F3EE', border: '1px solid #ECEAE2' }}>
                      <Image src={p.images[0].url} alt={p.name} fill sizes="44px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '44px', height: '54px', background: '#F4F3EE', borderRadius: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#C9A96E', border: '1px solid #ECEAE2' }}>◈</div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#2C3528', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: '10px', color: '#8A8A7A', marginTop: '2px', fontFamily: 'monospace' }}>/{p.slug}</p>
                    {p.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                        <span style={{ fontSize: '10px', color: '#C9A96E' }}>{'★'.repeat(Math.round(p.rating))}</span>
                        <span style={{ fontSize: '10px', color: '#8A8A7A' }}>{p.rating.toFixed(1)} ({p.reviewCount})</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Category */}
                <span style={{ fontSize: '12px', color: '#3D4A38' }}>{p.category}</span>
                {/* Price */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C3528' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  {p.comparePrice && <div style={{ fontSize: '11px', color: '#8A8A7A', textDecoration: 'line-through' }}>₹{p.comparePrice.toLocaleString('en-IN')}</div>}
                </div>
                {/* Stock */}
                <span style={{ fontSize: '12px', fontWeight: 600, color: p.inventory > 10 ? '#22c55e' : p.inventory > 0 ? '#f59e0b' : '#ef4444' }}>
                  {p.inventory > 0 ? p.inventory : 'Out'}
                </span>
                {/* Flags */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {p.isFeatured   && <span style={{ padding: '2px 6px', background: '#ede9fe', color: '#7c3aed', borderRadius: '2px', fontSize: '9px', fontWeight: 700 }}>Featured</span>}
                  {p.isNewArrival && <span style={{ padding: '2px 6px', background: '#d1fae5', color: '#065f46', borderRadius: '2px', fontSize: '9px', fontWeight: 700 }}>New</span>}
                  {p.isBestSeller && <span style={{ padding: '2px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '2px', fontSize: '9px', fontWeight: 700 }}>Best Seller</span>}
                  {p.isTrending  && <span style={{ padding: '2px 6px', background: '#fce7f3', color: '#9d174d', borderRadius: '2px', fontSize: '9px', fontWeight: 700 }}>Trending</span>}
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openEdit(p)} style={{ fontSize: '12px', color: '#C9A96E', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p.slug, p.name)} style={{ fontSize: '12px', color: '#ef4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: '7px 16px', border: '1px solid #ECEAE2', borderRadius: '2px', background: 'white', fontSize: '12px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
            {Array.from({ length: Math.min(totalPages, 15) }, (_, i) => {
              const p = totalPages > 15 ? Math.max(1, page - 7) + i : i + 1;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)} style={{ width: '36px', height: '36px', border: '1px solid #ECEAE2', borderRadius: '2px', background: p === page ? '#2C3528' : 'white', color: p === page ? 'white' : '#2C3528', fontSize: '13px', cursor: 'pointer' }}>{p}</button>
              );
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ padding: '7px 16px', border: '1px solid #ECEAE2', borderRadius: '2px', background: 'white', fontSize: '12px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next →</button>
          </div>
        )}
      </div>

      {/* ─── Form Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.6)', zIndex: 1000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: 'white', borderRadius: '4px', width: '100%', maxWidth: '820px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #ECEAE2', background: '#FAFAF7' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1A1A18', fontWeight: 300 }}>{editSlug ? 'Edit Product' : 'Add New Product'}</h3>
                <p style={{ fontSize: '12px', color: '#8A8A7A', marginTop: '2px' }}>Fill in the details below. Description supports up to 250+ words with rich formatting.</p>
              </div>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '24px', color: '#8A8A7A', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ECEAE2', background: '#FAFAF7' }}>
              {FORM_TABS.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 500, color: activeTab === t.key ? '#2C3528' : '#8A8A7A', borderBottom: activeTab === t.key ? '2px solid #C9A96E' : '2px solid transparent', background: 'none', border: 'none', borderBottom: activeTab === t.key ? '2px solid #C9A96E' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}>
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* ── BASIC INFO TAB ── */}
                {activeTab === 'basic' && (
                  <>
                    {/* Name + Slug */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Product Name *</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: editSlug ? form.slug : autoSlug(e.target.value) })} required placeholder="e.g. Celestial Stack Ring" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>URL Slug *</label>
                        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required placeholder="celestial-stack-ring" style={{ ...inputStyle, fontFamily: 'monospace' }} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label style={labelStyle}>Short Description (shown in listings)</label>
                      <textarea value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} rows={2} placeholder="One or two lines about the product..." style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                    </div>

                    {/* Price + Compare */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Price (₹) *</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min="1" placeholder="2499" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>Compare Price (₹)</label>
                        <input type="number" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} placeholder="3200 (optional)" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>Inventory *</label>
                        <input type="number" value={form.inventory} onChange={e => setForm({ ...form, inventory: e.target.value })} required min="0" placeholder="100" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                    </div>

                    {/* Category + Collection + SKU */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Category *</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required style={{ ...inputStyle, background: 'white' }}>
                          <option value="">Select category</option>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Collection</label>
                        <input value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })} placeholder="e.g. Celestial" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>SKU *</label>
                        <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required placeholder="AAM-RNG-001" style={{ ...inputStyle, fontFamily: 'monospace' }} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                    </div>

                    {/* Material + Tags */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Material</label>
                        <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="18k Gold Vermeil, Sterling Silver…" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>Tags (comma separated)</label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="minimalist, gold, stacking, gift" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      </div>
                    </div>

                    {/* Flags */}
                    <div>
                      <label style={{ ...labelStyle, marginBottom: '12px' }}>Product Flags</label>
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {[
                          { key: 'isFeatured',   label: 'Featured on Homepage' },
                          { key: 'isNewArrival', label: 'New Arrival' },
                          { key: 'isBestSeller', label: 'Best Seller' },
                          { key: 'isTrending',   label: 'Trending' },
                        ].map(({ key, label }) => (
                          <label key={key} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', cursor: 'pointer', color: '#2C3528' }}>
                            <input type="checkbox" checked={(form as Record<string,boolean|string>)[key] as boolean} onChange={e => setForm({ ...form, [key]: e.target.checked })} style={{ accentColor: '#C9A96E', width: '15px', height: '15px' }} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── DESCRIPTION TAB ── */}
                {activeTab === 'description' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={labelStyle}>Full Description *</label>
                      <span style={{ fontSize: '11px', color: '#8A8A7A' }}>
                        {form.description.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length} words
                        {form.description.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length >= 200 &&
                          <span style={{ color: '#22c55e', marginLeft: '4px' }}>✓ 200+ words</span>
                        }
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8A8A7A', marginBottom: '12px', lineHeight: 1.6 }}>
                      Use the toolbar below to add <strong>headings</strong>, <strong>bold text</strong>, bullet lists, and more. You can write up to 250+ words to fully describe your product.
                    </p>

                    {/* Rich-text toolbar */}
                    <div style={{ border: '1px solid #ECEAE2', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ background: '#F4F3EE', borderBottom: '1px solid #ECEAE2', padding: '8px 12px', display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {[
                          { label: 'H2', tag: 'h2', title: 'Heading 2' },
                          { label: 'H3', tag: 'h3', title: 'Heading 3' },
                          { label: 'B', tag: 'strong', title: 'Bold' },
                          { label: 'I', tag: 'em', title: 'Italic' },
                        ].map(({ label, tag, title }) => (
                          <button
                            key={tag} type="button" title={title}
                            onClick={() => {
                              const textarea = document.getElementById('desc-textarea') as HTMLTextAreaElement;
                              if (!textarea) return;
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const selected = form.description.slice(start, end) || 'Your text here';
                              const wrapped = tag === 'h2' || tag === 'h3'
                                ? `\n<${tag}>${selected}</${tag}>\n`
                                : `<${tag}>${selected}</${tag}>`;
                              const next = form.description.slice(0, start) + wrapped + form.description.slice(end);
                              setForm({ ...form, description: next });
                            }}
                            style={{ padding: '5px 10px', background: 'white', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '12px', fontWeight: tag === 'strong' ? 700 : 400, fontStyle: tag === 'em' ? 'italic' : 'normal', cursor: 'pointer', color: '#2C3528', minWidth: '36px', textAlign: 'center' }}
                          >
                            {label}
                          </button>
                        ))}
                        <div style={{ width: '1px', height: '24px', background: '#ECEAE2', margin: '0 4px' }} />
                        <button type="button" title="Bullet List"
                          onClick={() => setForm({ ...form, description: form.description + '\n<ul>\n  <li>Feature one</li>\n  <li>Feature two</li>\n</ul>\n' })}
                          style={{ padding: '5px 10px', background: 'white', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#2C3528' }}>
                          • List
                        </button>
                        <button type="button" title="Paragraph break"
                          onClick={() => setForm({ ...form, description: form.description + '\n\n<p></p>\n\n' })}
                          style={{ padding: '5px 10px', background: 'white', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#2C3528' }}>
                          ¶ Para
                        </button>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#8A8A7A' }}>HTML supported</span>
                      </div>
                      <textarea
                        id="desc-textarea"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        rows={14}
                        placeholder={`<p>Write a rich, detailed product description here. You can use up to 250+ words.</p>\n\n<h2>About This Piece</h2>\n<p>Describe the inspiration, design, and craftsmanship...</p>\n\n<h3>Materials & Details</h3>\n<ul>\n  <li>18k gold vermeil finish</li>\n  <li>Hypoallergenic</li>\n</ul>`}
                        style={{ width: '100%', padding: '14px 16px', border: 'none', fontSize: '13px', fontFamily: 'monospace', lineHeight: 1.7, resize: 'vertical', color: '#1A1A18', background: '#FEFEFE', display: 'block' }}
                      />
                    </div>

                    {/* Live preview */}
                    {form.description && (
                      <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A7A', marginBottom: '8px' }}>Preview</p>
                        <div
                          className="product-description"
                          style={{ background: '#FAFAF7', border: '1px solid #ECEAE2', borderRadius: '2px', padding: '20px 24px', fontSize: '14px', lineHeight: 1.85 }}
                          dangerouslySetInnerHTML={{ __html: form.description }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ── RATING TAB ── */}
                {activeTab === 'rating' && (
                  <div>
                    <div style={{ background: '#FFFBF0', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '2px', padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                      ★ Set the rating and review count manually. This is the rating displayed on product cards and the product page. You can update these anytime as your real reviews grow.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                        <label style={labelStyle}>Star Rating (0.0 – 5.0)</label>
                        <input
                          type="number" min="0" max="5" step="0.1"
                          value={form.rating}
                          onChange={e => setForm({ ...form, rating: e.target.value })}
                          placeholder="4.8"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor='#C9A96E'}
                          onBlur={e => e.target.style.borderColor='#E8E8E0'}
                        />
                        {parseFloat(form.rating) > 0 && (
                          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1,2,3,4,5].map(s => (
                                <span key={s} style={{ fontSize: '20px', color: s <= Math.round(parseFloat(form.rating)) ? '#C9A96E' : '#E8E8E0' }}>★</span>
                              ))}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C3528' }}>{parseFloat(form.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Total Review Count</label>
                        <input
                          type="number" min="0"
                          value={form.reviewCount}
                          onChange={e => setForm({ ...form, reviewCount: e.target.value })}
                          placeholder="128"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor='#C9A96E'}
                          onBlur={e => e.target.style.borderColor='#E8E8E0'}
                        />
                        {parseInt(form.reviewCount) > 0 && (
                          <p style={{ marginTop: '8px', fontSize: '12px', color: '#8A8A7A' }}>
                            Will display as: ★ {parseFloat(form.rating).toFixed(1)} ({parseInt(form.reviewCount)} reviews)
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '24px', background: '#F4F3EE', border: '1px solid #ECEAE2', borderRadius: '2px', padding: '20px 24px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#2C3528', marginBottom: '12px', letterSpacing: '0.04em' }}>Quick Rating Presets</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                          { label: '★★★★★ 5.0 (48 reviews)', rating: '5.0', count: '48' },
                          { label: '★★★★★ 4.9 (120 reviews)', rating: '4.9', count: '120' },
                          { label: '★★★★½ 4.8 (76 reviews)',  rating: '4.8', count: '76' },
                          { label: '★★★★½ 4.7 (32 reviews)',  rating: '4.7', count: '32' },
                        ].map(preset => (
                          <button key={preset.rating} type="button"
                            onClick={() => setForm({ ...form, rating: preset.rating, reviewCount: preset.count })}
                            style={{ padding: '8px 14px', background: 'white', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#2C3528', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C9A96E'; (e.currentTarget as HTMLElement).style.color = '#C9A96E'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ECEAE2'; (e.currentTarget as HTMLElement).style.color = '#2C3528'; }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SEO TAB ── */}
                {activeTab === 'seo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '2px', padding: '12px 16px', fontSize: '12px', color: '#166534' }}>
                      ✓ Good SEO = more free traffic from Google. Fill these in for every product.
                    </div>
                    <div>
                      <label style={labelStyle}>Meta Title <span style={{ fontWeight: 400, color: '#8A8A7A' }}>(defaults to product name)</span></label>
                      <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} maxLength={60} placeholder="Celestial Stack Ring — Aambish Luxury" style={inputStyle} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      <p style={{ fontSize: '11px', color: form.metaTitle.length > 55 ? '#f59e0b' : '#8A8A7A', marginTop: '4px' }}>{form.metaTitle.length}/60 chars recommended</p>
                    </div>
                    <div>
                      <label style={labelStyle}>Meta Description <span style={{ fontWeight: 400, color: '#8A8A7A' }}>(shown in Google search results)</span></label>
                      <textarea value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} maxLength={160} rows={3} placeholder="Shop the Celestial Stack Ring by Aambish Luxury. Minimalist fine jewellery crafted with grace. Best price, fast delivery." style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='#C9A96E'} onBlur={e => e.target.style.borderColor='#E8E8E0'} />
                      <p style={{ fontSize: '11px', color: form.metaDescription.length > 150 ? '#f59e0b' : '#8A8A7A', marginTop: '4px' }}>{form.metaDescription.length}/160 chars recommended</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div style={{ padding: '18px 32px', borderTop: '1px solid #ECEAE2', background: '#FAFAF7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {FORM_TABS.filter(t => t.key !== activeTab).map(t => (
                    <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ECEAE2', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#8A8A7A' }}>
                      {t.label} →
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #2C3528', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', color: '#2C3528', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} style={{ padding: '10px 28px', background: submitting ? '#8A8A7A' : '#2C3528', color: 'white', border: 'none', borderRadius: '2px', fontSize: '12px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {submitting ? 'Saving...' : editSlug ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
