// lib/models.ts
import mongoose, { Schema, model, models } from 'mongoose';

// ── Product ────────────────────────────────────────────────
const ProductImageSchema = new Schema({ url: String, alt: String, width: Number, height: Number }, { _id: false });
const ProductVariantSchema = new Schema({ name: String, value: String, priceModifier: { type: Number, default: 0 }, inventory: { type: Number, default: 0 } }, { _id: false });

const ProductSchema = new Schema({
  slug:            { type: String, required: true, unique: true, index: true },
  name:            { type: String, required: true },
  description:     { type: String, default: '' },       // Rich HTML, up to 250+ words
  shortDescription:{ type: String, default: '' },
  price:           { type: Number, required: true },
  comparePrice:    Number,
  images:          [ProductImageSchema],
  video:           String,
  category:        { type: String, required: true, index: true },
  subCategory:     String,
  tags:            [String],
  variants:        [ProductVariantSchema],
  inventory:       { type: Number, default: 0, index: true },
  sku:             { type: String, required: true, unique: true },
  weight:          Number,
  material:        String,
  collection:      { type: String, index: true },
  isFeatured:      { type: Boolean, default: false, index: true },
  isNewArrival:    { type: Boolean, default: false, index: true },
  isBestSeller:    { type: Boolean, default: false, index: true },
  isTrending:      { type: Boolean, default: false, index: true },
  // Admin-editable rating & review count
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:     { type: Number, default: 0, min: 0 },
  // SEO
  metaTitle:       String,
  metaDescription: String,
}, { timestamps: true });

// Full-text search index across name, description, tags
ProductSchema.index({ name: 'text', description: 'text', tags: 'text', shortDescription: 'text' });
// Compound index for common filtered queries
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ collection: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: -1, createdAt: -1 });
ProductSchema.index({ rating: -1, reviewCount: -1 });

// ── Category ────────────────────────────────────────────────
const CategorySchema = new Schema({
  name: { type: String, required: true }, slug: { type: String, required: true, unique: true },
  description: String, image: String, parentCategory: String,
  isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
  metaTitle: String, metaDescription: String,
}, { timestamps: true });

// ── User ────────────────────────────────────────────────────
const AddressSchema = new Schema({
  name: String, line1: String, line2: String, city: String,
  state: String, pincode: String, country: { type: String, default: 'India' },
  phone: String, isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true, lowercase: true, index: true },
  password:         { type: String, required: true },
  phone:            String,
  role:             { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses:        [AddressSchema],
  wishlist:         [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isVerified:       { type: Boolean, default: false },
  verifyOTP:        String,
  verifyOTPExpiry:  Date,
  resetOTP:         String,
  resetOTPExpiry:   Date,
}, { timestamps: true });

// ── Order ────────────────────────────────────────────────────
const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: String, image: String, price: Number, quantity: Number, variant: String,
}, { _id: false });

const OrderSchema = new Schema({
  orderNumber:    { type: String, required: true, unique: true, index: true },
  user:           { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items:          [OrderItemSchema],
  subtotal:       Number,
  discount:       { type: Number, default: 0 },
  couponCode:     String,
  shipping:       { type: Number, default: 0 },
  total:          Number,
  status:         { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'pending', index: true },
  paymentStatus:  { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  paymentMethod:  String,
  paymentId:      String,
  shippingAddress: AddressSchema,
  trackingNumber: String,
  notes:          String,
}, { timestamps: true });

// ── Coupon ────────────────────────────────────────────────────
const CouponSchema = new Schema({
  code:       { type: String, required: true, unique: true, uppercase: true },
  type:       { type: String, enum: ['percentage', 'flat'], required: true },
  value:      { type: Number, required: true },
  minCartValue: { type: Number, default: 0 },
  maxDiscount:  Number,
  usageLimit:   Number,
  usageCount:   { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  expiresAt:    Date,
  description:  String,
}, { timestamps: true });

// ── Review ────────────────────────────────────────────────────
const ReviewSchema = new Schema({
  product:    { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName:   String,
  rating:     { type: Number, min: 1, max: 5, required: true },
  title:      String,
  body:       { type: String, required: true },
  images:     [String],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// ── Banner ────────────────────────────────────────────────────
const BannerSchema = new Schema({
  title: String, subtitle: String,
  image: { type: String, required: true }, mobileImage: String,
  link: String, linkText: String,
  position: { type: String, enum: ['hero','mid','offer','category'], default: 'hero' },
  isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

// ── Blog ──────────────────────────────────────────────────────
const BlogSchema = new Schema({
  slug:           { type: String, required: true, unique: true },
  title:          { type: String, required: true },
  excerpt:        String,
  content:        String,
  featuredImage:  String,
  category:       String,
  tags:           [String],
  author:         String,
  readTime:       Number,
  isPublished:    { type: Boolean, default: false },
  metaTitle:      String,
  metaDescription:String,
}, { timestamps: true });

// ── Settings ──────────────────────────────────────────────────
const SettingsSchema = new Schema({ key: { type: String, unique: true, required: true }, value: Schema.Types.Mixed }, { timestamps: true });

// Export
export const Product  = models.Product  || model('Product',  ProductSchema);
export const Category = models.Category || model('Category', CategorySchema);
export const User     = models.User     || model('User',     UserSchema);
export const Order    = models.Order    || model('Order',    OrderSchema);
export const Coupon   = models.Coupon   || model('Coupon',   CouponSchema);
export const Review   = models.Review   || model('Review',   ReviewSchema);
export const Banner   = models.Banner   || model('Banner',   BannerSchema);
export const Blog     = models.Blog     || model('Blog',     BlogSchema);
export const Settings = models.Settings || model('Settings', SettingsSchema);
