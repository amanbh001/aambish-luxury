// components/home/BestSellers.tsx
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

async function getBestSellers(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?filter=bestsellers&limit=4`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return []; }
}

export default async function BestSellers() {
  const products = await getBestSellers();

  return (
    <section style={{ padding: '100px 0', background: 'linear-gradient(to bottom,#F4F3EE,#ECEAE2)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '10px' }}>Most Loved</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#1A1A18' }}>Best Sellers</h2>
          </div>
          <Link href="/shop?filter=bestsellers" style={{ padding: '11px 28px', background: 'transparent', border: '1px solid rgba(201,169,110,0.4)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', textDecoration: 'none', transition: 'all 0.25s' }}>
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                <div style={{ padding: '14px' }}>
                  <div className="skeleton" style={{ height: '10px', width: '55%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
