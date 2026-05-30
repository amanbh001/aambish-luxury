// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Settings } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: 'siteSettings' }).lean();
    return NextResponse.json({ settings: doc?.value || {} });
  } catch { return NextResponse.json({ settings: {} }); }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    await Settings.findOneAndUpdate({ key: 'siteSettings' }, { key: 'siteSettings', value: body }, { upsert: true, new: true });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 }); }
}
