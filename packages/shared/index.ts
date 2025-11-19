import { z } from 'zod';

// Authentication schemas
export const emailLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const otpLoginSchema = z.object({
  identifier: z.string(), // email or phone
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone is required',
});

export const passwordResetRequestSchema = z.object({
  identifier: z.string(), // email or phone
});

export const passwordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  categoryId: z.string(),
  brand: z.string().optional(),
  sku: z.string(),
  price: z.number().positive('Price must be positive'),
  mrp: z.number().positive('MRP must be positive'),
  discount: z.number().min(0).max(100).default(0),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  thumbnail: z.string().optional(),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item is required'),
  shippingAddressId: z.string(),
  billingAddressId: z.string().optional(),
  paymentMethod: z.string(),
});

// Address schemas
export const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  country: z.string().default('India'),
  type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  isDefault: z.boolean().default(false),
});

// Review schemas
export const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Seller schemas
export const sellerProfileSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters'),
  gst: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST number').optional(),
  pan: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN number').optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional(),
});

// Export types
export type EmailLogin = z.infer<typeof emailLoginSchema>;
export type PhoneLogin = z.infer<typeof phoneLoginSchema>;
export type OTPLogin = z.infer<typeof otpLoginSchema>;
export type Signup = z.infer<typeof signupSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CreateReview = z.infer<typeof createReviewSchema>;
export type SellerProfile = z.infer<typeof sellerProfileSchema>;
