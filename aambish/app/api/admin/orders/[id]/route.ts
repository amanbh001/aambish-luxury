// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/lib/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, body, { new: true });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch { return NextResponse.json({ message: 'Failed to update order' }, { status: 500 }); }
}
