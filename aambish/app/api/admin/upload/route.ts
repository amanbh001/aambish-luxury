// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = type === 'logo' || type === 'favicon' ? 'aambish/brand' : 'aambish/products';
    const publicId = type === 'logo' ? 'logo' : type === 'favicon' ? 'favicon' : `${Date.now()}`;

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, public_id: type === 'logo' || type === 'favicon' ? publicId : undefined, resource_type: 'image', format: 'webp', quality: 'auto', fetch_format: 'auto' },
        (err, result) => {
          if (err || !result) reject(err);
          else resolve(result as { secure_url: string; public_id: string });
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
