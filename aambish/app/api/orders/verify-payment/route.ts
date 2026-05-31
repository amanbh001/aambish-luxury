// app/api/orders/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { Order } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(sign).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
    }

    await connectDB();
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      status: 'confirmed',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Payment verification failed' }, { status: 500 });
  }
}
