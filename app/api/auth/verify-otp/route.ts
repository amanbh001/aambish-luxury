// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    if (user.isVerified) return NextResponse.json({ message: 'Already verified' }, { status: 400 });
    if (user.verifyOTP !== otp) return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    if (new Date() > user.verifyOTPExpiry) return NextResponse.json({ message: 'OTP expired. Please register again.' }, { status: 400 });

    await User.findByIdAndUpdate(user._id, { isVerified: true, verifyOTP: null, verifyOTPExpiry: null });

    const token = generateToken({ userId: user._id.toString(), role: user.role });
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}
