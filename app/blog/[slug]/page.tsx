// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Props { params: { slug: string } }

async function getPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?published=true&category=${category}&limit=3`, { next: { revalidate: 600 } });
    const d = await res.json();
    return (d.posts || []).filter((p: { slug: string }) => p.slug !== excludeSlug).slice(0, 2);
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.featuredImage ? [{ url: post.featuredImage }] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post || !post.isPublished) notFound();

  const related = await getRelatedPosts(post.category, params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: { '@type': 'Organization', name: post.author || 'Aambish Luxury' },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    publisher: { '@type': 'Organization', name: 'Aambish Luxury', logo: { '@type': 'ImageObject', url: 'https://aambish.com/images/logo.png' } },
  };

  return (
    <div className="page-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      {post.featuredImage && (
        <div style={{ position: 'relative', height: '480px', background: 'var(--forest)', overflow: 'hidden' }}>
          <Image src={post.featuredImage} alt={post.title} fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.6 }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,24,0.9) 0%, transparent 60%)' }} />
          <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '48px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>{post.category}</span>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 300, maxWidth: '720px', lineHeight: 1.2 }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
              <span>{post.author || 'Aambish Luxury'}</span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: 'var(--muted)' }}>Blog</Link>
            <span>/</span>
            <Link href={`/blog?category=${post.category}`} style={{ color: 'var(--muted)' }}>{post.category}</Link>
            <span>/</span>
            <span style={{ color: 'var(--forest)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '64px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '80px', alignItems: 'start' }} className="blog-post-grid">
          {/* Article */}
          <article>
            {/* Excerpt */}
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--forest-mid)', lineHeight: 1.8, borderLeft: '3px solid var(--gold)', paddingLeft: '24px', marginBottom: '40px' }}>
              {post.excerpt}
            </p>

            {/* Body */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon.</p>' }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>Tags</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {post.tags.map((tag: string) => (
                    <Link key={tag} href={`/blog?tag=${tag}`} style={{ padding: '6px 14px', background: 'var(--ivory-deep)', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '12px', color: 'var(--forest-mid)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--forest-mid)'; }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Share:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#25D366', color: 'white', borderRadius: '2px', fontSize: '12px', fontWeight: 600 }}>WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#1877F2', color: 'white', borderRadius: '2px', fontSize: '12px', fontWeight: 600 }}>Facebook</a>
            </div>
          </article>

          {/* Sidebar */}
          <aside>
            {/* Back to blog */}
            <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: '2px', padding: '24px', marginBottom: '24px' }}>
              <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--forest)', fontWeight: 500 }}>
                ← All Articles
              </Link>
            </div>

            {/* Shop CTA */}
            <div style={{ background: 'var(--forest)', borderRadius: '2px', padding: '28px', marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--gold-light)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>New Collection</p>
              <h4 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.2rem', marginBottom: '16px', lineHeight: 1.4 }}>Explore Our Latest Arrivals</h4>
              <Link href="/shop?filter=new" className="btn-gold" style={{ fontSize: '12px', padding: '10px 20px', display: 'inline-block' }}>Shop Now</Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: '2px', padding: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Related Articles</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {related.map((r: { slug: string; title: string; readTime: number }) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} style={{ display: 'block', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--forest)', lineHeight: 1.4, marginBottom: '4px', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--forest)')}
                      >{r.title}</p>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{r.readTime} min read</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .blog-content p { color: var(--forest-mid); line-height: 1.9; margin-bottom: 24px; font-size: 15px; }
        .blog-content h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 300; color: var(--forest); margin: 48px 0 20px; }
        .blog-content h3 { font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; color: var(--forest); margin: 36px 0 16px; }
        .blog-content ul, .blog-content ol { padding-left: 24px; margin-bottom: 24px; color: var(--forest-mid); line-height: 2; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content blockquote { border-left: 3px solid var(--gold); padding-left: 24px; margin: 32px 0; font-family: var(--font-display); font-style: italic; font-size: 1.15rem; color: var(--forest); }
        .blog-content img { width: 100%; border-radius: 2px; margin: 32px 0; }
        .blog-content strong { color: var(--forest); font-weight: 600; }
        .blog-content a { color: var(--gold); text-decoration: underline; }
        @media (max-width: 900px) { .blog-post-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
