import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { categories, getProductCountByCategory } from "@/data/catalog";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { useCatalogSEO } from "@/hooks/useSEO";
import { getBreadcrumbSchema } from "@/components/seo/schemas";

export default function Catalogo() {
  const seo = useCatalogSEO();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Catálogo", url: "https://cydma.es/catalogo" }
  ]);
  return (
    <Layout>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        schema={breadcrumbSchema}
      />
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
            alt="Catálogo CYDMA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Catálogo</span>
          </motion.nav>

          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Nuestro Catálogo
          </motion.h1>
          <motion.p
            className="text-white/70 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Más de 5.000 referencias en stock permanente. Calidad y diseño para
            profesionales exigentes.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 lg:py-28">
        <div className="container">
          {/* Section header */}
          <ScrollReveal variant="fade-up" threshold={0.1}>
            <div className="text-center mb-14">
              <span className="text-accent text-xs font-sans font-medium tracking-[0.2em] uppercase mb-4 block">
                Explora nuestras categorías
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Productos de Calidad
              </h2>
            </div>
          </ScrollReveal>

          {/* Grid - asymmetric like home CategoriesSection */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" stagger={0.06} delay={0.1}>
            {categories.map((category) => {
              const productCount = getProductCountByCategory(category.id);

              return (
                <StaggerItem key={category.id} variant="scale">
                  <Link
                    to={`/catalogo/${category.slug}`}
                    className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
                  >
                    {/* Background image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-500" />

                    {/* Top accent line */}
                    <div className="absolute top-5 left-5 w-6 h-px bg-white/30 group-hover:w-10 group-hover:bg-accent transition-all duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white/50 text-xs font-sans tracking-wider uppercase mb-2 block">
                        {productCount} productos
                      </span>
                      <h3 className="font-serif text-2xl text-white font-normal mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2 mb-4">
                        {category.description}
                      </p>

                      {/* Hover CTA */}
                      <div className="flex items-center gap-2 text-accent text-sm font-sans font-medium tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                        Ver productos
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Quick Links by Category */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <ScrollReveal variant="blur">
            <h2 className="font-serif text-2xl text-foreground mb-10 text-center">
              Navegación Rápida
            </h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.06} delay={0.1}>
            {categories
              .filter((c) => c.subcategories && c.subcategories.length > 0)
              .map((category) => (
                <StaggerItem key={category.id} variant="scale">
                  <div className="bg-card rounded-xl p-6 border border-border/50">
                    <Link
                      to={`/catalogo/${category.slug}`}
                      className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors mb-4 block"
                    >
                      {category.name}
                    </Link>
                    <div className="w-6 h-px bg-accent/30 mb-4" />
                    <ul className="space-y-2">
                      {category.subcategories?.slice(0, 5).map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/catalogo/${category.slug}/${sub.slug}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                          >
                            <ChevronRight className="h-3 w-3 text-accent/50" />
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                      {category.subcategories &&
                        category.subcategories.length > 5 && (
                          <li>
                            <Link
                              to={`/catalogo/${category.slug}`}
                              className="text-sm text-accent font-medium hover:underline flex items-center gap-1 mt-2"
                            >
                              Ver todas ({category.subcategories.length})
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </li>
                        )}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
}
