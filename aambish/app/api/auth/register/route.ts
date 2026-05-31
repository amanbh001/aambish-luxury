// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { hashPassword, generateOTP, getOTPExpiry, sendOTPEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ message: 'Password must be 8+ characters' }, { status: 400 });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return NextResponse.json({ message: 'Email already registered' }, { status: 409 });

    const hashed = await hashPassword(password);
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry(10);

    await User.create({ name, email: email.toLowerCase(), password: hashed, verifyOTP: otp, verifyOTPExpiry: otpExpiry, isVerified: false });
    await sendOTPEmail(email, otp, name);

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
