// app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Jewellery Journal',
  description: 'Stories, styling guides, and care tips from the world of Aambish Luxury.',
};

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?published=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const d = await res.json();
    return d.posts || [];
  } catch {
    return [];
  }
}

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  readTime: number;
  createdAt: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    _id: '1',
    slug: 'how-to-style-minimalist-jewellery',
    title: 'How to Style Minimalist Jewellery for Every Occasion',
    excerpt: 'Minimalism in jewellery is not about wearing less — it is about wearing intentionally. Here is how to curate a minimal stack that speaks volumes.',
    featuredImage: '/images/blog-1.jpg',
    category: 'Styling',
    readTime: 5,
    createdAt: '2025-04-10',
  },
  {
    _id: '2',
    slug: 'gold-vs-gold-vermeil-explained',
    title: 'Gold vs Gold Vermeil: What You Actually Need to Know',
    excerpt: 'Not all gold is created equal. We break down the differences between solid gold, gold-filled, and gold vermeil — and which one is right for you.',
    featuredImage: '/images/blog-2.jpg',
    category: 'Education',
    readTime: 7,
    createdAt: '2025-03-22',
  },
  {
    _id: '3',
    slug: 'jewellery-care-guide',
    title: 'The Complete Guide to Caring for Your Fine Jewellery',
    excerpt: 'Your jewellery is an investment. With the right care, it can last a lifetime. Everything you need to know to keep your pieces gleaming.',
    featuredImage: '/images/blog-3.jpg',
    category: 'Care',
    readTime: 6,
    createdAt: '2025-02-18',
  },
];

export default async function BlogPage() {
  const fetched = await getPosts();
  const posts: BlogPost[] = fetched.length > 0 ? fetched : SAMPLE_POSTS;

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#2C3528,#1A1A18)', padding: '80px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '12px' }}>
            Stories & Insights
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', color: '#FFFFFE', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 300, marginBottom: '16px' }}>
            Jewellery Journal
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(250,250,247,0.6)', maxWidth: '500px', margin: '0 auto', fontSize: '15px', lineHeight: 1.75 }}>
            Styling guides, material stories, and everything jewellery — curated for the modern woman.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="container section-pad">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '32px' }}>
          {posts.map((post, i) => (
            <article key={post._id}>
              <Link href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                {/* Image */}
                <div
                  style={{ position: 'relative', aspectRatio: '16/9', background: 'linear-gradient(135deg,#2C3528,#3D4A38)', borderRadius: '2px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 20px rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.12)' }}
                  className="blog-img-wrap"
                >
                  <Image
                    src={post.featuredImage || '/images/blog-placeholder.jpg'}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                    className="blog-img"
                    priority={i < 2}
                  />
                </div>

                {/* Category */}
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A96E' }}>
                  {post.category}
                </span>

                {/* Title */}
                <h2
                  className="blog-title"
                  style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '1.4rem', fontWeight: 400, lineHeight: 1.3, color: '#1A1A18', margin: '8px 0 12px', transition: 'color 0.2s' }}
                >
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: '#8A8A7A', fontSize: '13px', lineHeight: 1.75, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#8A8A7A' }}>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span>{post.readTime} min read</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .blog-img-wrap:hover .blog-img { transform: scale(1.04); }
        .blog-img-wrap:hover + * + .blog-title,
        a:hover .blog-title { color: #C9A96E !important; }
        @media (max-width: 640px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
