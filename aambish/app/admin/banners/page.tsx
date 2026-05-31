// app/blog/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';

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

const SAMPLE_POSTS = [
  { _id: '1', slug: 'how-to-style-minimalist-jewellery', title: 'How to Style Minimalist Jewellery for Every Occasion', excerpt: "Minimalism in jewellery is not about wearing less — its about wearing intentionally. Heres how to curate a minimal stack that speaks volumes.", featuredImage: '/images/blog-1.jpg', category: 'Styling', readTime: 5, createdAt: '2025-04-10' },
  { _id: '2', slug: 'gold-vs-gold-vermeil-explained', title: 'Gold vs Gold Vermeil: What You Actually Need to Know', excerpt: "Not all gold is created equal. We break down the differences between solid gold, gold-filled, and gold vermeil — and which one is right for you.", featuredImage: '/images/blog-2.jpg', category: 'Education', readTime: 7, createdAt: '2025-03-22' },
  { _id: '3', slug: 'jewellery-care-guide', title: 'The Complete Guide to Caring for Your Fine Jewellery', excerpt: "Your jewellery is an investment. With the right care, it can last a lifetime. Heres everything you need to know to keep your pieces gleaming.", featuredImage: '/images/blog-3.jpg', category: 'Care', readTime: 6, createdAt: '2025-02-18' },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Our Journal</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Stories, guides, and inspiration from Aambish.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_POSTS.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-56 w-full bg-gray-100">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    📷
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="uppercase tracking-wider">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>
                <h2 className="font-serif text-xl mb-2 group-hover:text-amber-700 transition">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 text-amber-600 text-sm font-medium group-hover:underline">
                  Read more →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
