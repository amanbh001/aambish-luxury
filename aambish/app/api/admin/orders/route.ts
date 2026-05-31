// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).populate('user', 'name email').lean();
    return NextResponse.json({ orders });
  } catch { return NextResponse.json({ orders: [] }); }
}
