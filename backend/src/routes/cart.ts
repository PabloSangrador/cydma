import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db";
import { AddToCartSchema, UpdateCartItemSchema } from "../types";
import type { Cart, CartItem, Product } from "@prisma/client";

const app = new Hono();

type CartItemWithProduct = CartItem & { product: Product };
type CartWithItems = Cart & { items: CartItemWithProduct[] };

// Helper: parse or create cart by sessionId
async function getOrCreateCart(sessionId: string): Promise<CartWithItems> {
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  return cart;
}

// Helper: format cart for response
function formatCart(cart: CartWithItems) {
  return {
    ...cart,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    items: cart.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
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
  };
}

// GET /api/cart?sessionId=xxx
app.get("/", async (c) => {
  const sessionId = c.req.query("sessionId");
  if (!sessionId) return c.json({ data: null });

  const cart = await getOrCreateCart(sessionId);
  return c.json({ data: formatCart(cart) });
});

// POST /api/cart/add
app.post("/add", zValidator("json", AddToCartSchema), async (c) => {
  const { productId, quantity, sessionId } = c.req.valid("json");

  if (!sessionId) {
    return c.json({ error: { message: "sessionId required", code: "BAD_REQUEST" } }, 400);
  }

  // Verify product and check stock
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return c.json({ error: { message: "Product not found", code: "NOT_FOUND" } }, 404);
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId } });
  }

  // Check existing item quantity + new quantity vs stock
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  const existingQty = existingItem?.quantity ?? 0;
  const totalQty = existingQty + quantity;

  if (totalQty > product.stock) {
    return c.json(
      {
        error: {
          message: `Solo quedan ${product.stock} unidades disponibles`,
          code: "INSUFFICIENT_STOCK",
          available: product.stock,
        },
      },
      400
    );
  }

  // Upsert cart item
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
    },
    update: {
      quantity: { increment: quantity },
    },
  });

  // Update cart updatedAt
  await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });

  const updatedCart = await getOrCreateCart(sessionId);
  return c.json({ data: formatCart(updatedCart) });
});

// PATCH /api/cart/items/:itemId
app.patch("/items/:itemId", zValidator("json", UpdateCartItemSchema), async (c) => {
  const itemId = c.req.param("itemId");
  const { quantity } = c.req.valid("json");

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true, cart: true },
  });

  if (!item) {
    return c.json({ error: { message: "Cart item not found", code: "NOT_FOUND" } }, 404);
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    if (quantity > item.product.stock) {
      return c.json(
        {
          error: {
            message: `Solo quedan ${item.product.stock} unidades disponibles`,
            code: "INSUFFICIENT_STOCK",
            available: item.product.stock,
          },
        },
        400
      );
    }
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  const sessionId = item.cart.sessionId;
  if (!sessionId) {
    return c.json({ error: { message: "Cart has no session", code: "BAD_REQUEST" } }, 400);
  }

  const updatedCart = await getOrCreateCart(sessionId);
  return c.json({ data: formatCart(updatedCart) });
});

// DELETE /api/cart/items/:itemId
app.delete("/items/:itemId", async (c) => {
  const itemId = c.req.param("itemId");

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item) {
    return c.json({ error: { message: "Cart item not found", code: "NOT_FOUND" } }, 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const sessionId = item.cart.sessionId;
  if (!sessionId) {
    return c.json({ error: { message: "Cart has no session", code: "BAD_REQUEST" } }, 400);
  }

  const updatedCart = await getOrCreateCart(sessionId);
  return c.json({ data: formatCart(updatedCart) });
});

// POST /api/cart/merge - merge guest cart into user cart (for login)
app.post("/merge", async (c) => {
  const body = await c.req.json<{ guestSessionId?: string; userSessionId?: string }>();
  const { guestSessionId, userSessionId } = body;

  if (!guestSessionId || !userSessionId) {
    return c.json({ error: { message: "Both sessionIds required", code: "BAD_REQUEST" } }, 400);
  }

  const guestCart = await prisma.cart.findUnique({
    where: { sessionId: guestSessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    const userCart = await getOrCreateCart(userSessionId);
    return c.json({ data: formatCart(userCart) });
  }

  const userCart = await getOrCreateCart(userSessionId);

  // Merge items
  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find((i) => i.productId === guestItem.productId);
    const product = await prisma.product.findUnique({ where: { id: guestItem.productId } });
    if (!product) continue;

    const totalQty = (existing?.quantity ?? 0) + guestItem.quantity;
    const finalQty = Math.min(totalQty, product.stock);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: finalQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: finalQty,
          unitPrice: guestItem.unitPrice,
        },
      });
    }
  }

  // Delete guest cart
  await prisma.cart.delete({ where: { id: guestCart.id } });

  const finalCart = await getOrCreateCart(userSessionId);
  return c.json({ data: formatCart(finalCart) });
});

// DELETE /api/cart/:cartId - clear entire cart (after successful order)
app.delete("/:cartId", async (c) => {
  const cartId = c.req.param("cartId");

  const cart = await prisma.cart.findUnique({ where: { id: cartId } });
  if (!cart) {
    return c.json({ error: { message: "Cart not found", code: "NOT_FOUND" } }, 404);
  }

  await prisma.cartItem.deleteMany({ where: { cartId } });

  return c.json({ data: { cleared: true } });
});

export default app;
