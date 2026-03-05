import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db";
import { CreateOrderSchema, SHIPPING_COSTS } from "../types";

const app = new Hono();

// POST /api/orders - create order from cart
app.post("/", zValidator("json", CreateOrderSchema), async (c) => {
  const { cartId, shippingAddress, shippingMethod, idempotencyKey } = c.req.valid("json");

  // Idempotency check
  const existingOrder = await prisma.order.findUnique({ where: { idempotencyKey } });
  if (existingOrder) {
    return c.json({ data: existingOrder });
  }

  // Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return c.json({ error: { message: "Cart is empty or not found", code: "BAD_REQUEST" } }, 400);
  }

  // Validate stock for all items
  for (const item of cart.items) {
    if (!item.product.isActive) {
      return c.json(
        {
          error: {
            message: `El producto "${item.product.name}" ya no esta disponible`,
            code: "PRODUCT_UNAVAILABLE",
          },
        },
        400
      );
    }
    if (item.quantity > item.product.stock) {
      return c.json(
        {
          error: {
            message: `Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}`,
            code: "INSUFFICIENT_STOCK",
          },
        },
        400
      );
    }
  }

  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + shippingCost;

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        status: "pending",
        total,
        subtotal,
        shippingCost,
        shippingMethod,
        email: shippingAddress.email,
        shippingName: shippingAddress.name,
        shippingAddress: shippingAddress.address,
        shippingCity: shippingAddress.city,
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
        notes: shippingAddress.notes ?? null,
        idempotencyKey,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return newOrder;
  });

  return c.json(
    {
      data: {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
          ...item,
          product: item.product
            ? {
                ...item.product,
                images: JSON.parse(item.product.images) as string[],
                features: item.product.features ? (JSON.parse(item.product.features) as string[]) : null,
                createdAt: item.product.createdAt.toISOString(),
                updatedAt: item.product.updatedAt.toISOString(),
              }
            : null,
        })),
      },
    },
    201
  );
});

// GET /api/orders/:id/validate-stock - re-check stock availability for all items in an order
app.get("/:id/validate-stock", async (c) => {
  const id = c.req.param("id");
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return c.json({ error: { message: "Order not found", code: "NOT_FOUND" } }, 404);
  }

  const issues: Array<{ productName: string; requested: number; available: number }> = [];

  for (const item of order.items) {
    if (!item.product.isActive) {
      issues.push({
        productName: item.product.name,
        requested: item.quantity,
        available: 0,
      });
    } else if (item.quantity > item.product.stock) {
      issues.push({
        productName: item.product.name,
        requested: item.quantity,
        available: item.product.stock,
      });
    }
  }

  return c.json({
    data: {
      valid: issues.length === 0,
      issues,
    },
  });
});

// GET /api/orders/:id - get order by ID
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return c.json({ error: { message: "Order not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({
    data: {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              images: JSON.parse(item.product.images) as string[],
              features: item.product.features ? (JSON.parse(item.product.features) as string[]) : null,
              createdAt: item.product.createdAt.toISOString(),
              updatedAt: item.product.updatedAt.toISOString(),
            }
          : null,
      })),
    },
  });
});

export default app;
