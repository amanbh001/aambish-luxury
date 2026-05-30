// app/admin/blog/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  isPublished: boolean;
  readTime: number;
  createdAt: string;
}

const EMPTY = { title: '', slug: '', excerpt: '', content: '', category: 'Styling', tags: '', author: 'Aambish Team', readTime: '5', metaTitle: '', metaDescription: '', isPublished: false };
const CATEGORIES = ['Styling', 'Education', 'Care', 'Trends', 'Brand Story', 'Gifting'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/blog').then(r => r.json()).then(d => setPosts(d.posts || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p: Post & { content?: string; tags?: string[]; author?: string; metaTitle?: string; metaDescription?: string }) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content || '', category: p.category, tags: (p.tags || []).join(', '), author: p.author || 'Aambish Team', readTime: String(p.readTime || 5), metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '', isPublished: p.isPublished });
    setEditId(p._id);
    setShowForm(true);
  };

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, readTime: parseInt(form.readTime), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      const url = editId ? `/api/blog/${editId}` : '/api/blog';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(editId ? 'Post updated' : 'Post created'); setShowForm(false); load(); }
      else toast.error('Failed to save');
    } catch { toast.error('Error'); }
    finally { setSubmitting(false); }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    toast.success('Post deleted');
    load();
  };

  const togglePublish = async (p: Post) => {
    await fetch(`/api/blog/${p._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !p.isPublished }) });
    toast.success(p.isPublished ? 'Post unpublished' : 'Post published');
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F0EB', fontFamily: 'var(--font-body)' }}>
      <div style={{ background: 'var(--forest)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>← Admin</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Blog</span>
        </div>
        <button onClick={openNew} className="btn-gold" style={{ padding: '8px 20px', fontSize: '12px' }}>+ New Post</button>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>No blog posts yet. Start writing!</p>
              <button onClick={openNew} className="btn-primary">Write First Post</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--ivory-deep)' }}>
                <tr>
                  {['Title', 'Category', 'Read Time', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr key={p._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#FAFAF9' }}>
                    <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--forest)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', fontFamily: 'monospace' }}>/{p.slug}</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 8px', background: 'var(--ivory-deep)', borderRadius: '2px', fontSize: '11px', fontWeight: 600, color: 'var(--forest-mid)' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--muted)' }}>{p.readTime} min</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => togglePublish(p)} style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer', background: p.isPublished ? '#d1fae5' : '#f3f4f6', color: p.isPublished ? '#065f46' : '#6b7280' }}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={() => openEdit(p as Post & { content?: string; tags?: string[]; author?: string; metaTitle?: string; metaDescription?: string })} style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'underline' }}>Edit</button>
                        {p.isPublished && <Link href={`/blog/${p.slug}`} target="_blank" style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'underline' }}>Preview ↗</Link>}
                        <button onClick={() => deletePost(p._id)} style={{ fontSize: '12px', color: '#ef4444', textDecoration: 'underline' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
          <div style={{ background: 'white', borderRadius: '4px', padding: '40px', width: '100%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{editId ? 'Edit Post' : 'New Blog Post'}</h3>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '24px', color: 'var(--muted)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Title *</label>
                <input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) }); }} required placeholder="How to Style Minimalist Jewellery" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '14px', fontFamily: 'var(--font-body)' }} />
              </div>

              {/* Slug */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>URL Slug *</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required placeholder="how-to-style-minimalist-jewellery" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace' }} />
              </div>

              {/* Category + Read time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', background: 'white' }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Read Time (min)</label>
                  <input type="number" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} min="1" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Excerpt *</label>
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required rows={2} placeholder="A short summary shown in the blog listing..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', resize: 'vertical' }} />
              </div>

              {/* Content */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Content (HTML or Markdown) *</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={10} placeholder="<p>Write your full article here. HTML is supported.</p>" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }} />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest)', display: 'block', marginBottom: '6px' }}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="minimalist, styling, gold jewellery" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
              </div>

              {/* SEO */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>SEO (optional)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} placeholder="Meta title (defaults to post title)" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                  <input value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} placeholder="Meta description (150–160 chars)" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                </div>
              </div>

              <label style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                <span style={{ color: 'var(--forest)', fontWeight: 500 }}>Publish immediately</span>
              </label>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '10px 24px', fontSize: '13px' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '10px 28px', fontSize: '13px' }}>
                  {submitting ? 'Saving...' : editId ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
