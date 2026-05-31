// components/home/NewArrivals.tsx
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?filter=new&limit=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return []; }
}

export default async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section style={{ padding: '100px 0', background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '10px' }}>Just Arrived</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, color: '#1A1A18' }}>New Arrivals</h2>
          </div>
          <Link href="/shop?filter=new" style={{ padding: '11px 28px', background: 'transparent', border: '1px solid rgba(201,169,110,0.4)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', textDecoration: 'none', transition: 'all 0.25s' }}>
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '40px', color: 'rgba(201,169,110,0.3)', marginBottom: '16px' }}>✦</div>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.2rem', color: '#8A8A7A', fontStyle: 'italic' }}>New pieces arriving soon. Stay tuned.</p>
          </div>
        )}
      </div>
    </section>
  );
}
