// app/admin/page.tsx — full dashboard with ivory/gold palette
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats { totalOrders: number; totalRevenue: number; totalProducts: number; pendingOrders: number; }
interface Order { _id: string; orderNumber: string; status: string; total: number; createdAt: string; shippingAddress?: { name: string; city: string }; }

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#22c55e', cancelled: '#ef4444', refunded: '#6b7280',
};

const NAV_ITEMS = [
  { label: 'Products', href: '/admin/products', icon: '◈', desc: 'Manage catalogue' },
  { label: 'Orders',   href: '/admin/orders',   icon: '📦', desc: 'View & update orders' },
  { label: 'Coupons',  href: '/admin/coupons',  icon: '🏷', desc: 'Promo codes' },
  { label: 'Banners',  href: '/admin/banners',  icon: '🖼', desc: 'Homepage banners' },
  { label: 'Blog',     href: '/admin/blog',     icon: '✍', desc: 'Content & SEO' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙', desc: 'Site configuration' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [stats,        setStats]        = useState<Stats>({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/orders?limit=6').then(r => r.json()),
    ]).then(([s, o]) => {
      setStats(s || {});
      setRecentOrders(o.orders || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F3EE', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right,#2C3528,#1A1A18)', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#C9A96E' }}>aambish</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>|</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/" target="_blank" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textDecoration: 'none' }}>View Site ↗</Link>
          <button onClick={handleLogout} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', background: 'linear-gradient(to bottom,#FFFFFE,#F8F7F3)', borderRight: '1px solid rgba(201,169,110,0.18)', padding: '20px 0', flexShrink: 0 }}>
          <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(201,169,110,0.15)', marginBottom: '8px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8A7A' }}>Navigation</p>
          </div>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 18px', fontSize: '13px', color: '#2C3528', textDecoration: 'none', transition: 'all 0.15s', borderLeft: '3px solid transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(201,169,110,0.08)'; (e.currentTarget as HTMLElement).style.borderLeftColor='#C9A96E'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.borderLeftColor='transparent'; }}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: '#8A8A7A', marginTop: '1px' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 300, color: '#1A1A18', marginBottom: '6px' }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#8A8A7A', marginBottom: '28px' }}>Welcome back. Here is an overview of your store.</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '32px' }}>
            {[
              { label: 'Total Revenue',   value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, color: '#22c55e',  icon: '₹' },
              { label: 'Total Orders',    value: stats.totalOrders   || 0,                                  color: '#3b82f6',  icon: '📦' },
              { label: 'Pending Orders',  value: stats.pendingOrders || 0,                                  color: '#f59e0b',  icon: '⏳' },
              { label: 'Total Products',  value: stats.totalProducts || 0,                                  color: '#C9A96E',  icon: '◈' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderLeft: `3px solid ${stat.color}`, borderRadius: '4px', padding: '20px', boxShadow: '0 2px 12px rgba(201,169,110,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A7A', marginBottom: '8px' }}>{stat.label}</p>
                    <p style={{ fontSize: '26px', fontWeight: 700, color: '#1A1A18' }}>{loading ? '—' : stat.value}</p>
                  </div>
                  <span style={{ fontSize: '22px', opacity: 0.4 }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8A7A', marginBottom: '14px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px', marginBottom: '32px' }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: '4px', padding: '18px 14px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', display: 'block', boxShadow: '0 1px 6px rgba(201,169,110,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(201,169,110,0.45)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 6px 24px rgba(201,169,110,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(201,169,110,0.18)'; (e.currentTarget as HTMLElement).style.transform='none'; (e.currentTarget as HTMLElement).style.boxShadow='0 1px 6px rgba(201,169,110,0.06)'; }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C3528' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: '#8A8A7A', marginTop: '2px' }}>{item.desc}</div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8A7A' }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: '12px', color: '#C9A96E', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ background: 'linear-gradient(145deg,#FFFFFE,#F8F7F3)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(201,169,110,0.07)' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8A8A7A' }}>Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#8A8A7A', fontSize: '14px' }}>No orders yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(201,169,110,0.06)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                    {['Order #', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8A7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(201,169,110,0.02)' }}>
                      <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 700, color: '#2C3528' }}>#{order.orderNumber}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A18' }}>{order.shippingAddress?.name || '—'}</p>
                        <p style={{ fontSize: '11px', color: '#8A8A7A' }}>{order.shippingAddress?.city || ''}</p>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: 600, color: '#2C3528' }}>₹{order.total?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', background: `${STATUS_COLORS[order.status] || '#6b7280'}18`, color: STATUS_COLORS[order.status] || '#6b7280', textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '12px', color: '#8A8A7A' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <Link href="/admin/orders" style={{ fontSize: '12px', color: '#C9A96E', textDecoration: 'underline' }}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
