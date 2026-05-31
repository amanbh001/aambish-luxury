// app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, cartValue } = await req.json();

    if (!code) return NextResponse.json({ valid: false, message: 'Please enter a coupon code' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return NextResponse.json({ valid: false, message: 'Invalid coupon code' });

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' });
    }

    if (cartValue < coupon.minCartValue) {
      return NextResponse.json({ valid: false, message: `Minimum cart value of ₹${coupon.minCartValue.toLocaleString('en-IN')} required` });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((cartValue * coupon.value) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({ valid: true, code: coupon.code, discount, type: coupon.type, value: coupon.value });
  } catch {
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon' }, { status: 500 });
  }
}
