// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/lib/models';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

function generateOrderNumber(): string {
  const prefix = 'AAM';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { items, subtotal, discount, shipping, total, couponCode, shippingAddress, paymentMethod = 'razorpay' } = body;

    const orderNumber = generateOrderNumber();

    // Create order in DB
    const order = await Order.create({
      orderNumber,
      user: payload.userId,
      items,
      subtotal,
      discount,
      shipping,
      total,
      couponCode,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    if (paymentMethod === 'cod') {
      return NextResponse.json({ orderId: order._id, orderNumber });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: orderNumber,
    });

    return NextResponse.json({ orderId: order._id, razorpayOrderId: razorpayOrder.id, orderNumber });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
