// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Blog } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: Record<string, unknown> = {};
    if (published === 'true') query.isPublished = true;
    if (category) query.category = category;

    const posts = await Blog.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return NextResponse.json({ posts });
  } catch { return NextResponse.json({ posts: [] }); }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const post = await Blog.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error && 'code' in e && (e as NodeJS.ErrnoException).code === '11000' ? 'Slug already exists' : 'Failed to create post';
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
