// types/index.ts

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  video?: string;
  category: string;
  subCategory?: string;
  tags: string[];
  variants?: ProductVariant[];
  inventory: number;
  sku: string;
  weight?: number;
  material?: string;
  collection?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  schemaMarkup?: object;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  name: string;
  value: string;
  priceModifier?: number;
  inventory?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  isVerified: boolean;
}

export interface Address {
  _id?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minCartValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
  description?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string | User;
  userName: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  linkText?: string;
  position: 'hero' | 'mid' | 'offer' | 'category';
  isActive: boolean;
  sortOrder: number;
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
  };
  announcementBar: {
    text: string;
    isActive: boolean;
  };
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  metaPixelId?: string;
  shippingFreeAbove: number;
  shippingCharge: number;
}
