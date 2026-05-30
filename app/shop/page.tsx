// app/shop/page.tsx
import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop Fine Jewellery',
  description: 'Browse our complete collection of fine jewellery — rings, necklaces, earrings, and bracelets. Filter by category, price, material, and collection.',
};

interface ShopPageProps {
  searchParams: {
    q?: string;
    category?: string;
    filter?: string;
    collection?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  return <ShopClient searchParams={searchParams} />;
}
