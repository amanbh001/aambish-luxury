# Aambish Luxury — E-Commerce Website

A premium, modern jewellery e-commerce platform built with Next.js 14 (App Router), MongoDB, and deployed on Vercel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, SSR) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + HTTP-only cookies + OTP email |
| Payments | Razorpay (UPI, Card, Netbanking, COD) |
| Images | Cloudinary + Next.js Image Optimization |
| State | Zustand (cart, wishlist, recently viewed) |
| Email | Nodemailer (SMTP) |
| Styling | Pure CSS with CSS variables |
| Deployment | Vercel (CDN + Edge) |

---

## Project Structure

```
aambish/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (SEO, analytics)
│   ├── shop/               # Shop listing page
│   ├── product/[slug]/     # Product detail page
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout with Razorpay
│   ├── login/              # Login page
│   ├── register/           # Register + OTP verification
│   ├── profile/            # User dashboard + order history
│   ├── wishlist/           # Wishlist page
│   ├── blog/               # Blog listing + post detail
│   ├── contact/            # Contact us form
│   ├── thankyou/           # Order confirmation (/thankyou)
│   ├── admin/              # Admin panel
│   │   ├── products/       # Product CRUD
│   │   ├── orders/         # Order management + status updates
│   │   ├── coupons/        # Coupon management
│   │   ├── banners/        # Banner management
│   │   ├── blog/           # Blog CMS
│   │   └── settings/       # Logo, SEO, analytics, shipping
│   ├── api/                # API routes
│   │   ├── products/       # Products CRUD
│   │   ├── auth/           # Login, register, OTP, me, logout
│   │   ├── orders/         # Create order, verify payment, my orders
│   │   ├── coupons/        # Coupon validation
│   │   ├── blog/           # Blog CRUD
│   │   ├── contact/        # Contact form email
│   │   └── admin/          # Admin: stats, orders, settings, upload
│   ├── sitemap.ts          # Auto-generated XML sitemap
│   ├── robots.ts           # Robots.txt
│   └── not-found.tsx       # Custom 404 page
├── components/
│   ├── layout/             # Header, Footer, AnnouncementBar
│   ├── home/               # Hero, Collections, BestSellers, etc.
│   ├── product/            # ProductCard
│   └── ui/                 # CookieConsent
├── lib/
│   ├── db.ts               # MongoDB connection
│   ├── models.ts           # Mongoose schemas
│   ├── auth.ts             # JWT, bcrypt, OTP, email
│   └── store.ts            # Zustand stores
├── types/index.ts          # TypeScript interfaces
├── styles/globals.css      # Design system + global styles
├── .env.example            # Environment variables template
├── next.config.js          # Next.js config (images, headers)
└── vercel.json             # Vercel deployment config
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd aambish
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

Required services:
- **MongoDB Atlas** — free tier works for dev: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Cloudinary** — free tier for image uploads: [cloudinary.com](https://cloudinary.com)
- **Razorpay** — create test account: [razorpay.com](https://razorpay.com)
- **Gmail SMTP** — enable App Passwords in Google account settings

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Create Admin User

After starting the server, run this in a separate terminal to seed an admin user:

```bash
# Use MongoDB Compass or Atlas UI to update the role field:
# Find user by email → change role from "user" to "admin"
# Then access /admin to manage the site
```

---

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/aambish.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Import Repository
2. Select your GitHub repo
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Click **Deploy**

### 3. Custom Domain (Hostinger)

In your Hostinger DNS settings, add:
```
Type: CNAME
Name: @  (or www)
Value: cname.vercel-dns.com
TTL: 3600
```

Then in Vercel → Project Settings → Domains → Add your domain.

---

## Key Features

### Customer-Facing
- ✅ Luxury homepage with hero video/image
- ✅ Shop with filters (category, price, collection, sort)
- ✅ Product detail with image zoom, variants, add to cart
- ✅ Wishlist (persisted in localStorage)
- ✅ Cart with coupon code validation
- ✅ Checkout with Razorpay (UPI/Card/Netbanking) + COD
- ✅ OTP email verification on signup
- ✅ User profile with order history
- ✅ WhatsApp & Facebook product sharing
- ✅ Cookie consent popup
- ✅ Blog with SEO-optimised posts
- ✅ All policy pages (Privacy, Terms, Refund, Shipping)

### Admin Panel (/admin)
- ✅ Dashboard with revenue/order stats
- ✅ Product CRUD (add, edit, delete, featured flags)
- ✅ Order management with status updates + tracking numbers
- ✅ Coupon system (%, flat, min cart, expiry, usage limit)
- ✅ Blog CMS (publish/draft, SEO fields, categories)
- ✅ Site settings (logo upload, favicon, announcement bar, analytics IDs, social links, shipping rates)

### SEO & Performance
- ✅ Server-Side Rendering (SSR) with ISR
- ✅ Dynamic meta titles and descriptions
- ✅ Open Graph tags for social sharing
- ✅ JSON-LD schema markup on product pages
- ✅ Auto-generated XML sitemap (/sitemap.xml)
- ✅ Robots.txt
- ✅ Canonical tags via Next.js metadata
- ✅ WebP image format with lazy loading
- ✅ Core Web Vitals optimised
- ✅ Google Analytics 4 + GTM + Meta Pixel ready

---

## Coupon Examples

| Code | Type | Value | Min Cart |
|---|---|---|---|
| AMBISH10 | Percentage | 10% | ₹500 |
| FLAT200 | Flat | ₹200 | ₹1000 |
| WELCOME15 | Percentage | 15% | ₹0 |

Create these in `/admin/coupons`.

---

## Adding Products

1. Go to `/admin/products` → **+ Add Product**
2. Fill in: name, slug, price, category, SKU, inventory
3. After creating, upload images via Cloudinary (use the URL in the product images array via MongoDB or add an image upload UI extension)

For bulk product import, use MongoDB Compass to insert documents directly following the schema in `lib/models.ts`.

---

## Image Assets Needed

Place these in `public/images/`:
- `logo.png` — main logo (from uploaded file: aambish_logo.jpeg → rename/convert)
- `logo-white.png` — white version for dark backgrounds
- `hero-poster.jpg` — hero section fallback image (1920×1080)
- `og-image.jpg` — Open Graph share image (1200×630)
- `col-celestial.jpg`, `col-bloom.jpg`, `col-minimal.jpg`, `col-heirloom.jpg` — collection images
- `blog-1.jpg`, `blog-2.jpg`, `blog-3.jpg` — blog feature images
- `insta-1.jpg` through `insta-6.jpg` — Instagram section images
- `offer-banner.jpg` — offer banner background

Place videos in `public/videos/`:
- `hero.mp4` and `hero.webm` — homepage hero video

**Note:** For production, all images should be served from Cloudinary for automatic WebP conversion and CDN delivery.

---

## Design System

### Color Palette
```css
--ivory: #FAFAF7          /* Page background */
--gold: #C9A96E           /* Primary accent */
--forest: #2C3528         /* Primary dark */
--charcoal: #1A1A18       /* Text */
--muted: #8A8A7A          /* Secondary text */
```

### Typography
- **Display/Headings:** Cormorant Garamond (serif, elegant)
- **Body/UI:** DM Sans (clean, modern)

---

## Support

For questions about deployment or customisation, contact the development team.
