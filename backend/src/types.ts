import { z } from "zod";

// ─── Product ──────────────────────────────────────────────────
export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int(),
  images: z.array(z.string()),
  categoryId: z.string(),
  subcategoryId: z.string().nullable(),
  features: z.array(z.string()).nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

// ─── Cart ─────────────────────────────────────────────────────
export const CartItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  productId: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number(),
  product: ProductSchema.optional(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  id: z.string(),
  sessionId: z.string().nullable(),
  userId: z.string().nullable(),
  items: z.array(CartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Cart = z.infer<typeof CartSchema>;

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(999),
  sessionId: z.string().optional(),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(999),
});

// ─── Order ────────────────────────────────────────────────────
export const ShippingAddressSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().default("ES"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const ShippingMethodSchema = z.enum(["standard", "express"]);
export type ShippingMethod = z.infer<typeof ShippingMethodSchema>;

export const CreateOrderSchema = z.object({
  cartId: z.string(),
  shippingAddress: ShippingAddressSchema,
  shippingMethod: ShippingMethodSchema.default("standard"),
  idempotencyKey: z.string(),
});

export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  product: ProductSchema.optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  status: z.string(),
  total: z.number(),
  subtotal: z.number(),
  shippingCost: z.number(),
  shippingMethod: z.string(),
  email: z.string(),
  shippingName: z.string(),
  shippingAddress: z.string(),
  shippingCity: z.string(),
  shippingPostalCode: z.string(),
  shippingCountry: z.string(),
  notes: z.string().nullable(),
  stripePaymentIntentId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(OrderItemSchema),
});
export type Order = z.infer<typeof OrderSchema>;

// ─── Payment ──────────────────────────────────────────────────
export const CreatePaymentIntentSchema = z.object({
  orderId: z.string(),
});

export const CreatePaymentIntentResponseSchema = z.object({
  clientSecret: z.string().nullable(),
  paymentIntentId: z.string(),
});
export type CreatePaymentIntentResponse = z.infer<typeof CreatePaymentIntentResponseSchema>;

// ─── User ─────────────────────────────────────────────────────
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  company: z.string().optional(),
});

// ─── API Helpers ──────────────────────────────────────────────
export const SHIPPING_COSTS = {
  standard: 8.9,
  express: 19.9,
} as const;
