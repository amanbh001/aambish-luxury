// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(payload.userId).select('-password -verifyOTP -verifyOTPExpiry -resetOTP -resetOTPExpiry').lean();
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
