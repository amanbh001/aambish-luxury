// app/admin/orders/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const STATUS_COLORS: Record<string, string> = { pending:'#f59e0b', confirmed:'#3b82f6', processing:'#8b5cf6', shipped:'#06b6d4', delivered:'#22c55e', cancelled:'#ef4444', refunded:'#6b7280' };

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  shippingAddress: { name: string; city: string; phone: string };
  items: { name: string; quantity: number; price: number }[];
  couponCode?: string;
  discount?: number;
  paymentMethod?: string;
  trackingNumber?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const load = () => {
    setLoading(true);
    const q = statusFilter ? `?status=${statusFilter}` : '';
    fetch(`/api/admin/orders${q}`)
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    toast.success('Status updated');
    load();
    if (selected?._id === orderId) setSelected({ ...selected, status });
  };

  const updateTracking = async () => {
    if (!selected || !trackingInput.trim()) return;
    await fetch(`/api/admin/orders/${selected._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingNumber: trackingInput.trim() }) });
    toast.success('Tracking number saved');
    setSelected({ ...selected, trackingNumber: trackingInput.trim() });
    load();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F0EB', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ background: 'var(--forest)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/admin" style={{ color: 'var(--gold)', fontSize: '16px', fontFamily: 'var(--font-display)' }}>← Admin</Link>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Orders</span>
      </div>

      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* Table */}
        <div>
          {/* Filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '8px 16px', borderRadius: '2px', fontSize: '12px', fontWeight: 500, border: '1px solid var(--border)', background: statusFilter === s ? 'var(--forest)' : 'white', color: statusFilter === s ? 'white' : 'var(--forest)', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em', textTransform: s ? 'capitalize' : undefined }}>
                {s || 'All Orders'}
              </button>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>No orders found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--ivory-deep)' }}>
                  <tr>
                    {['Order', 'Customer', 'Amount', 'Status', 'Payment', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order._id} style={{ borderTop: '1px solid var(--border)', background: selected?._id === order._id ? '#FFFDF5' : i % 2 === 0 ? 'white' : '#FAFAF9', cursor: 'pointer' }} onClick={() => { setSelected(order); setTrackingInput(order.trackingNumber || ''); }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--forest)' }}>#{order.orderNumber}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{order.shippingAddress?.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{order.shippingAddress?.city}</p>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>₹{order.total?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ padding: '4px 8px', border: `1px solid ${STATUS_COLORS[order.status]}`, borderRadius: '2px', fontSize: '11px', fontWeight: 600, color: STATUS_COLORS[order.status], background: `${STATUS_COLORS[order.status]}15`, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ color: STATUS_COLORS[s] }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '2px', background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7', color: order.paymentStatus === 'paid' ? '#065f46' : '#92400e' }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'underline' }}>Details</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Order Detail Panel */}
        {selected && (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>#{selected.orderNumber}</h3>
              <button onClick={() => setSelected(null)} style={{ fontSize: '20px', color: 'var(--muted)' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Status</p>
                <select value={selected.status} onChange={(e) => updateStatus(selected._id, e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)', background: 'white' }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              {/* Tracking */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Tracking Number</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} placeholder="Enter tracking #" style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
                  <button onClick={updateTracking} className="btn-primary" style={{ padding: '9px 16px', fontSize: '12px' }}>Save</button>
                </div>
              </div>

              {/* Customer */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>Customer & Address</p>
                <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--forest-mid)' }}>
                  <strong style={{ color: 'var(--forest)', display: 'block' }}>{selected.shippingAddress?.name}</strong>
                  {selected.shippingAddress?.phone}<br />
                  {selected.shippingAddress?.city}
                </div>
              </div>

              {/* Items */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>Items</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selected.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--forest-mid)' }}>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600, color: 'var(--forest)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {selected.couponCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#22c55e' }}>
                      <span>Coupon: {selected.couponCode}</span>
                      <span>−₹{selected.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--forest)' }}>₹{selected.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                <span>Payment:</span>
                <span style={{ fontWeight: 600, color: 'var(--forest)', textTransform: 'uppercase' }}>{selected.paymentMethod}</span>
                <span style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '10px', fontWeight: 700, background: selected.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7', color: selected.paymentStatus === 'paid' ? '#065f46' : '#92400e' }}>{selected.paymentStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
