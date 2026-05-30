// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order, Product } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const [totalOrders, pendingOrders, products, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);
    return NextResponse.json({ totalOrders, pendingOrders, totalProducts: products, totalRevenue: revenueAgg[0]?.total || 0 });
  } catch { return NextResponse.json({ totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalRevenue: 0 }); }
}
