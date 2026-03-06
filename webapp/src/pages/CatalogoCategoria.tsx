import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/catalog";
import { ArrowRight, ChevronRight, Filter, X, ChevronLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { useCatalogSEO } from "@/hooks/useSEO";
import { getBreadcrumbSchema } from "@/components/seo/schemas";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  code: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  subcategoryId: string | null;
  features: string[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PRODUCTS_PER_PAGE = 12;

export default function CatalogoCategoria() {
  const { categoria, subcategoria } = useParams<{
    categoria: string;
    subcategoria?: string;
  }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [subcatSearch, setSubcatSearch] = useState("");

  const category = getCategoryBySlug(categoria || "");
  const subcategoryData = category?.subcategories?.find(
    (s) => s.slug === subcategoria
  );

  const seo = useCatalogSEO(categoria, subcategoria);
  const breadcrumbItems = subcategoria
    ? [
        { name: category?.name || "", url: `https://cydma.es/catalogo/${categoria}` },
        { name: subcategoryData?.name || "", url: `https://cydma.es/catalogo/${categoria}/${subcategoria}` }
      ]
    : [{ name: category?.name || "", url: `https://cydma.es/catalogo/${categoria}` }];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  // Reset page when category/subcategory changes
  useEffect(() => {
    setCurrentPage(1);
    setSubcatSearch("");
  }, [categoria, subcategoria]);

  const filteredSubcategories = useMemo(() => {
    if (!category?.subcategories) return [];
    if (!subcatSearch.trim()) return category.subcategories;
    return category.subcategories.filter((s) =>
      s.name.toLowerCase().includes(subcatSearch.toLowerCase())
    );
  }, [category?.subcategories, subcatSearch]);

  const hasSearch = (category?.subcategories?.length ?? 0) > 8;

  // Fetch products from API
  const { data: allProducts = [], isLoading } = useQuery<ApiProduct[]>({
    queryKey: ["products", category?.id, subcategoryData?.id],
    queryFn: async () => {
      if (!category) return [];
      const params = new URLSearchParams({ category: category.id });
      if (subcategoryData) params.set("subcategory", subcategoryData.id);
      return api.get<ApiProduct[]>(`/api/products?${params}`);
    },
    enabled: !!category,
  });

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const products = allProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Generate pagination numbers with ellipsis for large catalogs
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // 404 Handler
  if (!category) {
    return (
      <Layout>
        <SEOHead
          title="Categoría no encontrada | CYDMA"
          description="La categoría que buscas no existe."
          canonical=""
          noIndex={true}
        />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Categoria no encontrada
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Lo sentimos, la categoria que buscas no existe o ha sido movida.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform"
            >
              Volver al catalogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        schema={breadcrumbSchema}
      />
      {/* Hero Header */}
      <section className="relative h-[35vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={subcategoryData?.name || category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/catalogo" className="hover:text-white transition-colors">
              Catalogo
            </Link>
            <ChevronRight className="h-4 w-4" />
            {subcategoria ? (
              <>
                <Link
                  to={`/catalogo/${categoria}`}
                  className="hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{subcategoryData?.name}</span>
              </>
            ) : (
              <span className="text-white">{category.name}</span>
            )}
          </motion.nav>

          <motion.h1
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-normal mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {subcategoryData?.name || category.name}
          </motion.h1>
          <motion.p
            className="text-white/60 text-base max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {subcategoryData?.description || category.description}
          </motion.p>
        </div>
      </section>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-background border-b border-border/50">
        <div className="container py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground shrink-0">
            {isLoading ? (
              <span className="inline-block w-20 h-4 bg-secondary animate-pulse rounded" />
            ) : (
              `${allProducts.length} producto${allProducts.length !== 1 ? "s" : ""}`
            )}
          </p>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
          >
            <Filter className="h-4 w-4" />
            {subcategoria ? subcategoryData?.name : "Subcategorías"}
            {category.subcategories && (
              <span className="text-xs text-muted-foreground">
                ({category.subcategories.length})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />

            {/* Drawer from bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium">Subcategorías</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.subcategories?.length ?? 0} disponibles
                  </p>
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search (if many subcategories) */}
              {hasSearch && (
                <div className="px-6 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar subcategoría..."
                      value={subcatSearch}
                      onChange={(e) => setSubcatSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary/50 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* List */}
              <div className="overflow-y-auto flex-1 px-6 py-4">
                {/* "Todas" pill */}
                <Link
                  to={`/catalogo/${category.slug}`}
                  onClick={() => setFilterOpen(false)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm mb-1 transition-colors",
                    !subcategoria
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <span>Todas las subcategorías</span>
                  {!subcategoria && <ChevronRight className="h-4 w-4" />}
                </Link>

                {filteredSubcategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Sin resultados para "{subcatSearch}"
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSubcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/catalogo/${category.slug}/${sub.slug}`}
                          onClick={() => setFilterOpen(false)}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm transition-colors",
                            subcategoria === sub.slug
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-secondary text-foreground"
                          )}
                        >
                          <span>{sub.name}</span>
                          {subcategoria === sub.slug && <ChevronRight className="h-4 w-4" />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Other categories */}
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
                    Otras categorías
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter((c) => c.id !== category.id)
                      .map((c) => (
                        <Link
                          key={c.id}
                          to={`/catalogo/${c.slug}`}
                          onClick={() => setFilterOpen(false)}
                          className="text-xs px-3 py-1.5 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main layout: sidebar + grid */}
      <div className="container py-10 lg:py-14">
        <div className="flex gap-8 items-start">

          {/* ── SIDEBAR (desktop only) ── */}
          {category.subcategories && category.subcategories.length > 0 && (
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-28 self-start">
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
                {/* Sidebar header */}
                <div className="px-5 py-4 border-b border-border/60 bg-secondary/30">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subcategorías
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.subcategories.length} tipos
                  </p>
                </div>

                {/* Search (if many) */}
                {hasSearch && (
                  <div className="px-4 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        value={subcatSearch}
                        onChange={(e) => setSubcatSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Subcategory list */}
                <nav className="p-3 max-h-[65vh] overflow-y-auto">
                  {/* "Todas" */}
                  <Link
                    to={`/catalogo/${category.slug}`}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors group",
                      !subcategoria
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                        !subcategoria ? "bg-primary-foreground" : "bg-border group-hover:bg-foreground/40"
                      )}
                    />
                    Todas
                  </Link>

                  {/* Divider */}
                  <div className="my-2 border-t border-border/50" />

                  {filteredSubcategories.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 px-2">
                      Sin resultados para "{subcatSearch}"
                    </p>
                  ) : (
                    filteredSubcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/catalogo/${category.slug}/${sub.slug}`}
                        className={cn(
                          "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors group",
                          subcategoria === sub.slug
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                            subcategoria === sub.slug
                              ? "bg-primary-foreground"
                              : "bg-border group-hover:bg-foreground/40"
                          )}
                        />
                        <span className="line-clamp-2 leading-snug">{sub.name}</span>
                      </Link>
                    ))
                  )}
                </nav>

                {/* Other categories footer */}
                <div className="px-4 py-4 border-t border-border/60 bg-secondary/20">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Otras categorías
                  </p>
                  <div className="space-y-1">
                    {categories
                      .filter((c) => c.id !== category.id)
                      .map((c) => (
                        <Link
                          key={c.id}
                          to={`/catalogo/${c.slug}`}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                        >
                          <ChevronRight className="h-3 w-3 text-accent/50" />
                          {c.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* ── PRODUCTS AREA ── */}
          <div className="flex-1 min-w-0">
            {/* Desktop: breadcrumb + count bar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to={`/catalogo/${category.slug}`} className="hover:text-foreground transition-colors">
                  {category.name}
                </Link>
                {subcategoryData && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">{subcategoryData.name}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="inline-block w-24 h-4 bg-secondary animate-pulse rounded" />
                ) : (
                  `${allProducts.length} producto${allProducts.length !== 1 ? "s" : ""}`
                )}
              </p>
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-secondary/40 animate-pulse">
                    <div className="aspect-[4/5]" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-16 bg-secondary rounded" />
                      <div className="h-5 w-3/4 bg-secondary rounded" />
                      <div className="h-3 w-24 bg-secondary rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <StaggerContainer
                  key={`${categoria}-${subcategoria}-${currentPage}`}
                  className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5"
                  stagger={0.05}
                  delay={0.05}
                >
                  {products.map((product) => (
                    <StaggerItem key={product.id} variant="scale">
                      <Link
                        to={`/producto/${product.slug}`}
                        className="group block overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                          {product.images.length > 0 ? (
                            <>
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                loading="lazy"
                                className={cn(
                                  "w-full h-full object-contain transition-all duration-500",
                                  product.images[1]
                                    ? "group-hover:opacity-0"
                                    : "group-hover:scale-105"
                                )}
                              />
                              {product.images[1] ? (
                                <img
                                  src={product.images[1]}
                                  alt={product.name}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                />
                              ) : null}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              Sin imagen
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4">
                            <span className="bg-white text-foreground px-4 py-2 text-xs font-medium rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                              Ver detalle
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] text-accent font-medium tracking-wider uppercase">
                            {category.name}
                          </span>
                          <h3 className="font-serif text-base lg:text-lg text-foreground mt-1 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Ref: {product.code}
                          </p>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <ScrollReveal variant="fade-up">
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {getPaginationNumbers().map((page, idx) =>
                        typeof page === "string" ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-10 h-10 flex items-center justify-center text-muted-foreground"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-secondary"
                            )}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </ScrollReveal>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-6">
                  No hay productos en esta categoría.
                </p>
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform"
                >
                  Ver todo el catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
