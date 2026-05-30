// app/api/orders/mine/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/lib/models';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ orders: [] });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ orders: [] });

    await connectDB();
    const orders = await Order.find({ user: payload.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
