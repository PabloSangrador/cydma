/**
 * @module catalog
 * @description CYDMA product catalog data and helper utilities.
 */

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  detailedDescription?: string;
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  subsubcategoryId?: string;
  features?: string[];
  relatedProducts?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: SubSubcategory[];
}

export interface SubSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────────
export const categories: Category[] = [
  {
    id: "acorazadas",
    name: "Acorazadas",
    slug: "acorazadas",
    description: "Puertas acorazadas de alta seguridad",
    image: "",
    subcategories: [
      { id: "eco-t", name: "ECO-T", slug: "eco-t" },
      { id: "idom", name: "IDOM", slug: "idom" },
      { id: "premium-4c", name: "PREMIUM 4C", slug: "premium-4c" },
      { id: "thor-20", name: "THOR-20", slug: "thor-20" },
      { id: "thor-20-plus", name: "THOR-20 PLUS", slug: "thor-20-plus" },
      { id: "trastero", name: "Trastero", slug: "trastero" },
    ],
  },
  {
    id: "armarios",
    name: "Armarios",
    slug: "armarios",
    description: "Armarios y sistemas de almacenamiento",
    image: "",
    subcategories: [
      { id: "abatibles", name: "Abatibles", slug: "abatibles" },
      { id: "accesorios-armarios", name: "Accesorios", slug: "accesorios-armarios" },
      { id: "correderos-armarios", name: "Correderos", slug: "correderos-armarios" },
      { id: "cristales", name: "Cristales", slug: "cristales" },
      { id: "division-de-espacios", name: "División de espacios", slug: "division-de-espacios" },
      { id: "interiores", name: "Interiores", slug: "interiores" },
      { id: "perfiles-armarios", name: "Perfiles", slug: "perfiles-armarios" },
      { id: "vestidores", name: "Vestidores", slug: "vestidores" },
    ],
  },
  {
    id: "herraje",
    name: "Herraje",
    slug: "herraje",
    description: "Herrajes y accesorios para carpintería",
    image: "",
    subcategories: [
      { id: "accesorios-herraje", name: "Accesorios", slug: "accesorios-herraje" },
      { id: "bisagras", name: "Bisagras", slug: "bisagras" },
      { id: "bocallaves", name: "Bocallaves", slug: "bocallaves" },
      { id: "cerraduras", name: "Cerraduras", slug: "cerraduras" },
      { id: "condenas", name: "Condenas", slug: "condenas" },
      { id: "correderos-herraje", name: "Correderos", slug: "correderos-herraje" },
      { id: "guias-exteriores", name: "Guías exteriores", slug: "guias-exteriores" },
      { id: "herrajes-de-cabina", name: "Herrajes de cabina", slug: "herrajes-de-cabina" },
      { id: "manillones", name: "Manillones", slug: "manillones" },
      { id: "mirillas", name: "Mirillas", slug: "mirillas" },
      { id: "muelles-cierrapuertas", name: "Muelles cierrapuertas", slug: "muelles-cierrapuertas" },
      { id: "perfiles-herraje", name: "Perfiles", slug: "perfiles-herraje" },
      { id: "picaportes", name: "Picaportes", slug: "picaportes" },
      { id: "placas-de-acero", name: "Placas de acero", slug: "placas-de-acero" },
      { id: "placas-de-aluminio", name: "Placas de aluminio", slug: "placas-de-aluminio" },
      { id: "placas-de-laton", name: "Placas de latón", slug: "placas-de-laton" },
      { id: "placas-de-zamak", name: "Placas de zamak", slug: "placas-de-zamak" },
      { id: "pomos", name: "Pomos", slug: "pomos" },
      { id: "rosetas-de-acero", name: "Rosetas de acero", slug: "rosetas-de-acero" },
      { id: "rosetas-de-aluminio", name: "Rosetas de aluminio", slug: "rosetas-de-aluminio" },
      { id: "rosetas-de-zamak", name: "Rosetas de zamak", slug: "rosetas-de-zamak" },
      { id: "rosetas-premium", name: "Rosetas Premium", slug: "rosetas-premium" },
      { id: "tiradores-y-picos-de-loro", name: "Tiradores y picos de loro", slug: "tiradores-y-picos-de-loro" },
    ],
  },
  {
    id: "marcos-y-molduras",
    name: "Marcos y molduras",
    slug: "marcos-y-molduras",
    description: "Cercos, kits de revestimiento y molduras",
    image: "",
    subcategories: [
      { id: "cercos", name: "Cercos", slug: "cercos" },
      { id: "kits-de-revestimiento", name: "Kits de revestimiento", slug: "kits-de-revestimiento" },
      { id: "molduras", name: "Molduras", slug: "molduras" },
    ],
  },
  {
    id: "puertas",
    name: "Puertas",
    slug: "puertas",
    description: "Puertas de interior de alta calidad",
    image: "",
    subcategories: [
      { id: "lacadas", name: "Lacadas", slug: "lacadas" },
      { id: "laminadas", name: "Laminadas", slug: "laminadas" },
      { id: "madera", name: "Madera", slug: "madera" },
    ],
  },
  {
    id: "soluciones-fenolicas",
    name: "Soluciones fenólicas",
    slug: "soluciones-fenolicas",
    description: "Soluciones en tablero fenólico para cabinas, fachadas y panelados",
    image: "",
    subcategories: [
      { id: "cabinas", name: "Cabinas", slug: "cabinas" },
      { id: "fachadas-ventiladas", name: "Fachadas ventiladas", slug: "fachadas-ventiladas" },
      { id: "panelados", name: "Panelados", slug: "panelados" },
    ],
  },
];

// Los productos se gestionan en la base de datos (backend/prisma/dev.db).
// Para añadir o modificar productos, usa el script backend/src/import-catalog.ts

// ─── HELPERS ───────────────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories?.find((s) => s.slug === subcategorySlug);
}

// Helpers de productos — los datos reales vienen de la API (/api/products).
// Estas funciones devuelven arrays vacíos para compatibilidad con código legacy.

export function getProductById(_id: string): Product | undefined {
  return undefined;
}

export function getProductsByCategory(_categoryId: string): Product[] {
  return [];
}

export function getProductsBySubcategory(
  _categoryId: string,
  _subcategoryId: string
): Product[] {
  return [];
}

export function getProductCountByCategory(_categoryId: string): number {
  return 0;
}

export function searchProducts(_query: string): Product[] {
  return [];
}

// Exportamos un array vacío para compatibilidad con imports legacy
export const products: Product[] = [];
