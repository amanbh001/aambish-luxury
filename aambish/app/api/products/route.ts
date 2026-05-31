// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models';

export const revalidate = 60; // ISR 60s

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q          = searchParams.get('q');
    const category   = searchParams.get('category');
    const filter     = searchParams.get('filter');
    const collection = searchParams.get('collection');
    const sort       = searchParams.get('sort') || '';
    const page       = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const minPrice   = searchParams.get('minPrice');
    const maxPrice   = searchParams.get('maxPrice');
    const ids        = searchParams.get('ids');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (ids) {
      query._id = { $in: ids.split(',').filter(Boolean) };
    } else {
      if (q)          query.$text       = { $search: q };
      if (category && category !== 'All') query.category = { $regex: new RegExp(category, 'i') };
      if (collection) query.collection  = { $regex: new RegExp(collection, 'i') };
      if (filter === 'new')         query.isNewArrival = true;
      if (filter === 'bestsellers') query.isBestSeller = true;
      if (filter === 'featured')    query.isFeatured   = true;
      if (filter === 'trending')    query.isTrending   = true;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)                   query.price.$gte = parseInt(minPrice);
        if (maxPrice && parseInt(maxPrice) < 999999) query.price.$lte = parseInt(maxPrice);
      }
    }

    let sortObj: Record<string, 1 | -1> = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price-asc')    sortObj = { price: 1 };
    else if (sort === 'price-desc')   sortObj = { price: -1 };
    else if (sort === 'bestsellers')  sortObj = { reviewCount: -1 };
    else if (sort === 'rating')       sortObj = { rating: -1 };
    else if (sort === 'new')          sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('slug name shortDescription price comparePrice images category collection tags isFeatured isNewArrival isBestSeller isTrending rating reviewCount inventory sku material')
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json(
      { products, total, page, totalPages: Math.ceil(total / limit) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', products: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // Auto-generate SKU if missing
    if (!body.sku) body.sku = `AAM-${Date.now()}`;
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const msg = (error as NodeJS.ErrnoException).code === '11000' ? 'Slug or SKU already exists' : 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
