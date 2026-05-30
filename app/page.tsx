// app/page.tsx
import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import OfferBanner from '@/components/home/OfferBanner';
import InstagramShowcase from '@/components/home/InstagramShowcase';
import ReviewsSection from '@/components/home/ReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TrustBadges from '@/components/home/TrustBadges';

export const metadata: Metadata = {
  title: 'Aambish Luxury — Fine Jewellery for the Modern Woman',
  description:
    'Discover handcrafted fine jewellery for the modern woman. Shop rings, necklaces, earrings, and bracelets from Aambish Luxury. Free shipping on orders above ₹2,000.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <FeaturedCollections />
      <BestSellers />
      <OfferBanner
        title="The Golden Hour Collection"
        subtitle="Timeless pieces, crafted in 18k gold vermeil"
        cta="Explore Collection"
        href="/shop?collection=golden-hour"
        bgImage="/images/offer-banner.jpg"
      />
      <NewArrivals />
      <InstagramShowcase />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}
