// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { comparePassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) return NextResponse.json({ message: 'Email and password required' }, { status: 400 });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    if (!user.isVerified) return NextResponse.json({ message: 'Please verify your email first' }, { status: 403 });

    const valid = await comparePassword(password, user.password);
    if (!valid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const token = generateToken({ userId: user._id.toString(), role: user.role });
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
