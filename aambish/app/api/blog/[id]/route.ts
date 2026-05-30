// app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    // Support both ObjectId and slug lookup
    const query = mongoose.isValidObjectId(params.id)
      ? { _id: params.id }
      : { slug: params.id };
    const post = await Blog.findOne(query).lean();
    if (!post) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch { return NextResponse.json({ message: 'Failed' }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const post = await Blog.findByIdAndUpdate(params.id, body, { new: true });
    if (!post) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch { return NextResponse.json({ message: 'Failed' }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'Failed' }, { status: 500 }); }
}
