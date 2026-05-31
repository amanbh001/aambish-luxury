// app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Jewellery Journal',
  description: 'Stories, styling guides, and care tips from the world of Aambish Luxury. Explore our jewellery journal.',
};

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?published=true`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const d = await res.json();
    return d.posts || [];
  } catch { return []; }
}

const SAMPLE_POSTS = [
  { _id: '1', slug: 'how-to-style-minimalist-jewellery', title: 'How to Style Minimalist Jewellery for Every Occasion', excerpt: 'Minimalism in jewellery is not about wearing less — its about wearing intentionally. Heres how to curate a minimal stack that speaks volumes.', featuredImage: '/images/blog-1.jpg', category: 'Styling', readTime: 5, createdAt: '2025-04-10' },
  { _id: '2', slug: 'gold-vs-gold-vermeil-explained', title: 'Gold vs Gold Vermeil: What You Actually Need to Know', excerpt: 'Not all gold is created equal. We break down the differences between solid gold, gold-filled, and gold vermeil — and which one is right for you.', featuredImage: '/images/blog-2.jpg', category: 'Education', readTime: 7, createdAt: '2025-03-22' },
  { _id: '3', slug: 'jewellery-care-guide', title: 'The Complete Guide to Caring for Your Fine Jewellery', excerpt: 'Your jewellery is an investment. With the right care, it can last a lifetime. Heres everything you need to know to keep your pieces gleaming.', featuredImage: '/images/blog-3.jpg', category: 'Care', readTime: 6, createdAt: '2025-02-18' },
];

export default async function BlogPage() {
  const posts = (await getPosts()).length > 0 ? await getPosts() : SAMPLE_POSTS;

  return (
    <div className="page-content">
      <div style={{ background: 'var(--forest)', padding: '80px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--gold)' }}>Stories & Insights</span>
          <h1 style={{ color: 'var(--warm-white)', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '16px' }}>Jewellery Journal</h1>
          <p style={{ color: 'rgba(250,250,247,0.65)', maxWidth: '540px', margin: '0 auto', fontSize: '16px' }}>
            Styling guides, material stories, and everything jewellery — curated for the modern woman.
          </p>
        </div>
      </div>

      <div className="container section-pad">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {posts.map((post: typeof SAMPLE_POSTS[number], i: number) => (
            <article key={post._id}>
              <Link href={`/blog/${post.slug}`} style={{ display: 'block' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--ivory-deep)', borderRadius: '2px', overflow: 'hidden', marginBottom: '20px' }} className="blog-img-wrap">
                  <Image src={post.featuredImage || '/images/blog-placeholder.jpg'} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.5s var(--ease-luxury)' }} className="blog-img" priority={i < 2} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>{post.category}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, lineHeight: 1.3, color: 'var(--charcoal)', margin: '8px 0 12px', transition: 'color 0.2s' }} className="blog-title">
                  {post.title}
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>{post.readTime} min read</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .blog-img-wrap:hover .blog-img { transform: scale(1.04); }
        .blog-img-wrap:hover ~ .blog-title, a:hover .blog-title { color: var(--gold) !important; }
      `}</style>
    </div>
  );
}
