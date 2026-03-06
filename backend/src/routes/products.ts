import { Hono } from "hono";
import { prisma } from "../db";

const app = new Hono();

// GET /api/products - list all active products with optional filter
app.get("/", async (c) => {
  const categoryId = c.req.query("category");
  const subcategoryId = c.req.query("subcategory");
  const search = c.req.query("search");

  const where: {
    isActive: boolean;
    categoryId?: string;
    subcategoryId?: string;
    name?: { contains: string };
  } = { isActive: true };

  if (categoryId) where.categoryId = categoryId;
  if (subcategoryId) where.subcategoryId = subcategoryId;
  if (search) where.name = { contains: search };

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return c.json({
    data: products.map((p) => ({
      ...p,
      images: JSON.parse(p.images) as string[],
      features: p.features ? (JSON.parse(p.features) as string[]) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  });
});

// GET /api/products/counts - product count grouped by categoryId
app.get("/counts", async (c) => {
  const rows = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { isActive: true },
    _count: { id: true },
  });
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.categoryId] = row._count.id;
  }
  return c.json({ data: counts });
});

// GET /api/products/:slug - get product by slug
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return c.json({ error: { message: "Product not found", code: "NOT_FOUND" } }, 404);
  }

  return c.json({
    data: {
      ...product,
      images: JSON.parse(product.images) as string[],
      features: product.features ? (JSON.parse(product.features) as string[]) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    },
  });
});

export default app;
