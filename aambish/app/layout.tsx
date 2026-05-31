// app/layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '@/components/ui/CookieConsent';
import AnnouncementBar from '@/components/layout/AnnouncementBar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aambish.com'),
  title: {
    default: 'Aambish Luxury — Latest Fine Jewellery at Best Prices',
    template: '%s | Aambish Luxury',
  },
  description:
    'Discover Aambish Luxury — latest minimalist fine jewellery at best prices. Elegant rings, necklaces, earrings & bracelets. Free shipping above ₹2,000. Pay via UPI.',
  keywords: ['luxury jewellery', 'fine jewellery India', 'minimalist jewellery', 'gold jewellery', 'aambish', 'latest jewellery', 'best price jewellery online'],
  authors: [{ name: 'Aambish Luxury' }],
  creator: 'Aambish Luxury',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aambish.com',
    siteName: 'Aambish Luxury',
    title: 'Aambish Luxury — Latest Fine Jewellery at Best Prices',
    description: 'Minimalist fine jewellery for the modern woman. Latest designs, best prices.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Aambish Luxury' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aambish Luxury',
    description: 'Latest minimalist fine jewellery at best prices.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${GA_ID}');
            `}</Script>
          </>
        )}

        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL_ID}');fbq('track','PageView');
          `}</Script>
        )}
      </head>
      <body>
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
          `}</Script>
        )}

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg,#2C3528,#1A1A18)',
              color: '#FAFAF7',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              borderRadius: '2px',
              padding: '12px 20px',
              border: '1px solid rgba(201,169,110,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
          }}
        />

        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
