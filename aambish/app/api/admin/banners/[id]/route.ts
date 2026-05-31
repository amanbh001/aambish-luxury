// app/api/admin/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Banner } from '@/lib/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const banner = await Banner.findByIdAndUpdate(params.id, body, { new: true });
    if (!banner) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(banner);
  } catch { return NextResponse.json({ message: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Banner.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'Failed to delete' }, { status: 500 }); }
}
