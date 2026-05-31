// app/product/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((img: { url: string }) => img.url),
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Aambish Luxury' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://aambish.com/product/${params.slug}`,
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
