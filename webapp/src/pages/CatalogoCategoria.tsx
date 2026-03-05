import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/catalog";
import { ArrowRight, ChevronRight, Filter, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  }, [categoria, subcategoria]);

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

      {/* Filter Bar */}
      <ScrollReveal variant="fade-up" threshold={0.1}>
        <div className="sticky top-16 z-30 bg-background border-b border-border/50">
          <div className="container py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="inline-block w-24 h-4 bg-secondary animate-pulse rounded" />
              ) : (
                `${allProducts.length} producto${allProducts.length !== 1 ? "s" : ""}`
              )}
            </p>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>

            {/* Desktop: show subcategory tabs */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to={`/catalogo/${category.slug}`}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-colors",
                  !subcategoria
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                Todas
              </Link>
              {category.subcategories?.slice(0, 6).map((sub) => (
                <Link
                  key={sub.id}
                  to={`/catalogo/${category.slug}/${sub.slug}`}
                  className={cn(
                    "px-4 py-2 text-sm rounded-full transition-colors",
                    subcategoria === sub.slug
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {sub.name}
                </Link>
              ))}
              {category.subcategories && category.subcategories.length > 6 && (
                <span className="text-xs text-muted-foreground ml-2">
                  +{category.subcategories.length - 6} mas
                </span>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Mobile Filter Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          filterOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setFilterOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-xl transform transition-transform duration-300",
            filterOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Filtros</h3>
            <button onClick={() => setFilterOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-auto h-[calc(100%-80px)]">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Subcategorias
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  to={`/catalogo/${category.slug}`}
                  onClick={() => setFilterOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm transition-colors",
                    !subcategoria
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  Todas ({getProductsByCategory(category.id).length})
                </Link>
              </li>
              {category.subcategories?.map((sub) => (
                <li key={sub.id}>
                  <Link
                    to={`/catalogo/${category.slug}/${sub.slug}`}
                    onClick={() => setFilterOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm transition-colors",
                      subcategoria === sub.slug
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Other categories */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Otras categorias
              </h4>
              <ul className="space-y-2">
                {categories
                  .filter((c) => c.id !== category.id)
                  .map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/catalogo/${c.slug}`}
                        onClick={() => setFilterOpen(false)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
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
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                stagger={0.06}
                delay={0.1}
              >
                {products.map((product) => (
                  <StaggerItem key={product.id} variant="scale">
                    <Link
                      to={`/producto/${product.slug}`}
                      className="group block overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image container with hover swap */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                        {product.images.length > 0 ? (
                          <>
                            {/* Main image */}
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className={cn(
                                "w-full h-full object-contain transition-all duration-500",
                                product.images[1]
                                  ? "group-hover:opacity-0"
                                  : "group-hover:scale-105"
                              )}
                            />
                            {/* Second image on hover (if exists) */}
                            {product.images[1] ? (
                              <img
                                src={product.images[1]}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              />
                            ) : null}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sin imagen
                          </div>
                        )}

                        {/* Hover overlay with button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4">
                          <span className="bg-white text-foreground px-4 py-2 text-xs font-medium rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                            Ver detalle
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Category tag */}
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
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
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
                No hay productos en esta categoria.
              </p>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:scale-[1.02] transition-transform"
              >
                Ver todo el catalogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
