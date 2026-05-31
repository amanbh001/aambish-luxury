// app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'orders' | 'wishlist';
const STATUS_COLORS: Record<string, string> = {
  pending:'#f59e0b', confirmed:'#3b82f6', processing:'#8b5cf6',
  shipped:'#06b6d4', delivered:'#22c55e', cancelled:'#ef4444', refunded:'#6b7280',
};

interface UserType { name: string; email: string; phone?: string; }
interface OrderType { _id: string; orderNumber: string; status: string; total: number; createdAt: string; items: { name: string; image: string }[]; }

export default function ProfilePage() {
  const router = useRouter();
  const [tab,     setTab]     = useState<Tab>('overview');
  const [user,    setUser]    = useState<UserType | null>(null);
  const [orders,  setOrders]  = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); else router.push('/login'); })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'orders') {
      fetch('/api/orders/mine').then(r => r.json()).then(d => setOrders(d.orders || []));
    }
  }, [tab]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/');
  };

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid rgba(201,169,110,0.2)', borderTopColor: '#C9A96E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview'  },
    { key: 'orders',   label: 'My Orders' },
    { key: 'wishlist', label: 'Wishlist'  },
  ];

  return (
    <div className="page-content" style={{ background: 'linear-gradient(to bottom,#FAFAF7,#F4F3EE)' }}>
      {/* Profile hero */}
      <div style={{ background: 'linear-gradient(135deg,#2C3528,#1A1A18)', padding: '56px 0 40px', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(201,169,110,0.18),rgba(201,169,110,0.06))', border: '1px solid rgba(201,169,110,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '26px', color: '#E8D5A8' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(232,213,168,0.7)', marginBottom: '4px' }}>Welcome back</p>
                <h2 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', color: '#FFFFFE', fontSize: '1.6rem', fontWeight: 300 }}>{user?.name}</h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(250,250,247,0.45)', fontSize: '13px' }}>{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{ padding: '10px 24px', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '2px', color: 'rgba(232,213,168,0.8)', fontFamily: "'DM Sans',sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', borderBottom: '1px solid rgba(201,169,110,0.18)', boxShadow: '0 2px 12px rgba(201,169,110,0.06)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '18px 28px', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', color: tab === t.key ? '#2C3528' : '#8A8A7A', borderBottom: tab === t.key ? '2px solid #C9A96E' : '2px solid transparent', background: 'none', border: 'none', borderBottom: tab === t.key ? '2px solid #C9A96E' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px', minHeight: '60vh' }}>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
            {[
              { title: 'My Orders',        desc: 'View & track your orders',    icon: '📦', action: () => setTab('orders') },
              { title: 'My Wishlist',       desc: 'Pieces you have saved',       icon: '♥',  action: () => setTab('wishlist') },
              { title: 'New Arrivals',      desc: 'Discover our latest designs', icon: '✦',  href: '/shop?filter=new' },
              { title: 'Best Sellers',      desc: 'Our most loved pieces',       icon: '⟡',  href: '/shop?filter=bestsellers' },
            ].map(card => (
              <div
                key={card.title}
                onClick={card.action || (() => card.href && router.push(card.href!))}
                style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: '2px', padding: '28px', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(201,169,110,0.06)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(201,169,110,0.45)'; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 8px 28px rgba(201,169,110,0.14)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(201,169,110,0.18)'; el.style.transform='none'; el.style.boxShadow='0 2px 12px rgba(201,169,110,0.06)'; }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{card.icon}</div>
                <h4 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '1.2rem', fontWeight: 400, color: '#1A1A18', marginBottom: '6px' }}>{card.title}</h4>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '13px', color: '#8A8A7A' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '1.6rem', fontWeight: 300, marginBottom: '28px' }}>Order History</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', color: '#8A8A7A', fontSize: '1.3rem', fontStyle: 'italic', marginBottom: '24px' }}>No orders yet.</p>
                <Link href="/shop" style={{ display: 'inline-flex', padding: '13px 32px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.map(order => (
                  <div key={order._id} style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: '2px', padding: '22px', boxShadow: '0 2px 12px rgba(201,169,110,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '14px', color: '#2C3528' }}>#{order.orderNumber}</p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '12px', color: '#8A8A7A', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ padding: '5px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: `${STATUS_COLORS[order.status] || '#6b7280'}18`, color: STATUS_COLORS[order.status] || '#6b7280', textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, color: '#2C3528', fontSize: '14px' }}>
                          ₹{order.total?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      {order.items?.slice(0, 4).map((item, i) => (
                        <div key={i} style={{ width: '48px', height: '58px', flexShrink: 0, background: '#F4F3EE', borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.15)', position: 'relative' }}>
                          {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <div style={{ width: '48px', height: '58px', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '11px', color: '#C9A96E', fontWeight: 600 }}>
                          +{(order.items?.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist redirect */}
        {tab === 'wishlist' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond,Georgia,serif', fontSize: '1.6rem', fontWeight: 300, marginBottom: '20px' }}>My Wishlist</h3>
            <Link href="/wishlist" style={{ display: 'inline-flex', padding: '13px 32px', background: 'linear-gradient(135deg,#2C3528,#1A1A18)', color: '#FAFAF7', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
              View Wishlist →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
