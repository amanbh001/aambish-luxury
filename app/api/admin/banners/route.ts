// app/api/admin/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Banner } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ banners });
  } catch { return NextResponse.json({ banners: [] }); }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const banner = await Banner.create(body);
    return NextResponse.json(banner, { status: 201 });
  } catch { return NextResponse.json({ message: 'Failed to create banner' }, { status: 500 }); }
}
