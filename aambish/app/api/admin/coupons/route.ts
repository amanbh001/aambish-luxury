// app/api/admin/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch { return NextResponse.json({ coupons: [] }); }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error && 'code' in e && (e as NodeJS.ErrnoException).code === '11000' ? 'Coupon code already exists' : 'Failed to create coupon';
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
