// app/shop/ShopClient.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';

const CATEGORIES = ['All','Rings','Necklaces','Earrings','Bracelets','Sets & Combos','Pendants','Anklets'];
const SORT_OPTIONS = [
  { label: 'Featured',           value: '' },
  { label: 'Newest First',       value: 'new' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Sellers',       value: 'bestsellers' },
  { label: 'Top Rated',          value: 'rating' },
];
const PRICE_RANGES = [
  { label: 'All Prices',       min: 0,     max: 999999 },
  { label: 'Under ₹1,000',     min: 0,     max: 1000 },
  { label: '₹1,000 – ₹2,500',  min: 1000,  max: 2500 },
  { label: '₹2,500 – ₹5,000',  min: 2500,  max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000,  max: 10000 },
  { label: 'Above ₹10,000',    min: 10000, max: 999999 },
];

interface ShopClientProps {
  searchParams: {
    q?: string; category?: string; filter?: string;
    collection?: string; sort?: string; page?: string;
    minPrice?: string; maxPrice?: string;
  };
}

const gloss = {
  background: 'linear-gradient(145deg,#FFFFFE 0%,#F8F7F3 100%)',
  border: '1px solid rgba(201,169,110,0.15)',
  borderRadius: '2px',
};

export default function ShopClient({ searchParams }: ShopClientProps) {
  const router   = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.category || 'All';
  const sort     = searchParams.sort     || '';
  const page     = parseInt(searchParams.page || '1');
  const perPage  = 16;

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { ...searchParams, ...updates };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/shop?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (searchParams.q)          q.set('q',          searchParams.q);
    if (searchParams.category && searchParams.category !== 'All') q.set('category', searchParams.category);
    if (searchParams.filter)     q.set('filter',     searchParams.filter);
    if (searchParams.collection) q.set('collection', searchParams.collection);
    if (searchParams.sort)       q.set('sort',       searchParams.sort);
    if (searchParams.minPrice)   q.set('minPrice',   searchParams.minPrice);
    if (searchParams.maxPrice)   q.set('maxPrice',   searchParams.maxPrice);
    q.set('page',  String(page));
    q.set('limit', String(perPage));

    fetch(`/api/products?${q.toString()}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotal(d.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [JSON.stringify(searchParams), page]);

  const totalPages = Math.ceil(total / perPage);

  const activePrice = PRICE_RANGES.find(r =>
    String(r.min) === (searchParams.minPrice || '0') &&
    String(r.max) === (searchParams.maxPrice || '999999')
  );

  const tabStyle = (active: boolean) => ({
    padding: '9px 18px',
    borderRadius: '2px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '11px',
    fontWeight: 500 as const,
    letterSpacing: '0.06em',
    border: active ? 'none' : '1px solid rgba(201,169,110,0.25)',
    background: active
      ? 'linear-gradient(135deg,#2C3528,#1A1A18)'
      : 'linear-gradient(145deg,#FFFFFE,#F8F7F3)',
    color:  active ? '#FAFAF7' : '#2C3528',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s',
    boxShadow: active ? '0 2px 12px rgba(44,53,40,0.18)' : '0 1px 4px rgba(201,169,110,0.06)',
  });

  const priceTabStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: '2px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '11px',
    fontWeight: 500 as const,
    border: active ? 'none' : '1px solid rgba(201,169,110,0.2)',
    background: active
      ? 'linear-gradient(135deg,#C9A96E,#A07840)'
      : 'linear-gradient(145deg,#FFFFFE,#F8F7F3)',
    color: active ? 'white' : '#2C3528',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s',
    boxShadow: active ? '0 2px 10px rgba(201,169,110,0.25)' : 'none',
  });

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(to bottom,#F8F7F3,#F0EFE8)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '52px 0 36px' }}>
        <div className="container">
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '8px' }}>
            {searchParams.q ? 'Search Results' : 'Discover Elegance'}
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#1A1A18', marginBottom: '8px' }}>
            {searchParams.q
              ? `Results for "${searchParams.q}"`
              : searchParams.filter === 'new'         ? 'New Arrivals'
              : searchParams.filter === 'bestsellers' ? 'Best Sellers'
              : searchParams.collection               ? `${searchParams.collection} Collection`
              : 'Shop Fine Jewellery'}
          </h1>
          {total > 0 && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A8A7A' }}>
              {total} {total === 1 ? 'piece' : 'pieces'} found
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => updateParams({ category: cat, page: '1' })} style={tabStyle(category === cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8A8A7A', alignSelf: 'center', marginRight: '2px' }}>Price:</span>
            {PRICE_RANGES.map(range => {
              const active = String(range.min) === (searchParams.minPrice || '0') &&
                             String(range.max) === (searchParams.maxPrice || '999999');
              return (
                <button key={range.label}
                  onClick={() => updateParams({ minPrice: String(range.min), maxPrice: String(range.max), page: '1' })}
                  style={priceTabStyle(active)}
                >{range.label}</button>
              );
            })}
          </div>
          <select value={sort} onChange={e => updateParams({ sort: e.target.value, page: '1' })}
            style={{ padding: '10px 16px', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#2C3528', background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', cursor: 'pointer', boxShadow: '0 1px 4px rgba(201,169,110,0.06)', flexShrink: 0 }}>
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Active filter chips */}
        {(searchParams.filter || searchParams.collection || searchParams.q) && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {searchParams.filter && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#C9A96E' }}>
                {searchParams.filter === 'new' ? 'New Arrivals' : 'Best Sellers'}
                <button onClick={() => updateParams({ filter: '' })} style={{ fontSize: '14px', lineHeight: 1, color: '#C9A96E', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {searchParams.q && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#C9A96E' }}>
                "{searchParams.q}"
                <button onClick={() => updateParams({ q: '' })} style={{ fontSize: '14px', lineHeight: 1, color: '#C9A96E', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </span>
            )}
            <button onClick={() => router.push('/shop')}
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A', cursor: 'pointer' }}>
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ ...gloss, overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                <div style={{ padding: '14px' }}>
                  <div className="skeleton" style={{ height: '10px', width: '50%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '10px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 4} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '64px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
                  disabled={page === 1}
                  style={{ padding: '9px 20px', ...gloss, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#2C3528', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.45 : 1 }}
                >← Prev</button>

                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 4, totalPages - 9));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => updateParams({ page: String(p) })}
                      style={{ width: '40px', height: '40px', ...gloss, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer',
                        background: p === page ? 'linear-gradient(135deg,#2C3528,#1A1A18)' : 'linear-gradient(145deg,#FFFFFE,#F8F7F3)',
                        color: p === page ? 'white' : '#2C3528',
                        boxShadow: p === page ? '0 2px 12px rgba(44,53,40,0.2)' : '0 1px 4px rgba(201,169,110,0.06)',
                      }}>
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) })}
                  disabled={page === totalPages}
                  style={{ padding: '9px 20px', ...gloss, fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#2C3528', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.45 : 1 }}
                >Next →</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '48px', color: 'rgba(201,169,110,0.3)', marginBottom: '20px' }}>◈</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.6rem', color: '#8A8A7A', fontWeight: 300, fontStyle: 'italic', marginBottom: '16px' }}>
              No pieces found
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#8A8A7A', marginBottom: '28px' }}>
              Try a different category or adjust your filters.
            </p>
            <button onClick={() => router.push('/shop')}
              style={{ padding: '12px 32px', background: 'transparent', border: '1px solid #2C3528', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2C3528', cursor: 'pointer' }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
