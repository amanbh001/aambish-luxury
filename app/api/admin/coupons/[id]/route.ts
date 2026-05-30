// app/api/admin/coupons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/lib/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true });
    if (!coupon) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(coupon);
  } catch { return NextResponse.json({ message: 'Failed' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Coupon.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'Failed' }, { status: 500 }); }
}
