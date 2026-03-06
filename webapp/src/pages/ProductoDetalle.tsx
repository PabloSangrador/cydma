import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { categories } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { ArrowRight, Check, Share2, Phone, Mail, ShoppingCart, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { getProductSchema, getBreadcrumbSchema } from "@/components/seo/schemas";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
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

export default function ProductoDetalle() {
  const { id: slug } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartQty, setCartQty] = useState(1);
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch main product from API by slug
  const { data: product, isLoading, isError } = useQuery<ApiProduct>({
    queryKey: ["product", slug],
    queryFn: () => api.get<ApiProduct>(`/api/products/${slug}`),
    enabled: !!slug,
    retry: false,
  });

  // Fetch related products from the same category
  const { data: relatedProducts = [] } = useQuery<ApiProduct[]>({
    queryKey: ["products", product?.categoryId],
    queryFn: () =>
      api.get<ApiProduct[]>(`/api/products?category=${product!.categoryId}`),
    enabled: !!product?.categoryId,
    select: (data) => data.filter((p) => p.slug !== slug).slice(0, 4),
  });

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, cartQty);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-secondary/30 border-b">
          <div className="container py-4">
            <div className="h-5 w-64 bg-secondary animate-pulse rounded" />
          </div>
        </div>
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[4/5] rounded-lg bg-secondary animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
                <div className="h-10 w-3/4 bg-secondary animate-pulse rounded" />
                <div className="h-20 w-full bg-secondary animate-pulse rounded" />
                <div className="h-32 w-full bg-secondary animate-pulse rounded" />
                <div className="h-12 w-full bg-secondary animate-pulse rounded" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // 404 state
  if (isError || !product) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-serif text-2xl mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Lo sentimos, el producto que buscas no existe o ha sido retirado del catálogo.
          </p>
          <Button asChild>
            <Link to="/catalogo">
              Volver al catálogo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const subcategory = category?.subcategories?.find(
    (s) => s.id === product.subcategoryId
  );

  const productSchema = getProductSchema({
    name: product.name,
    description: product.description || "",
    image: product.images[0] || "",
    sku: product.code,
  });
  const breadcrumbItems = [
    { name: "Catálogo", url: "https://cydma.es/catalogo" },
    ...(category
      ? [{ name: category.name, url: `https://cydma.es/catalogo/${category.slug}` }]
      : []),
    { name: product.name, url: `https://cydma.es/producto/${product.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems.slice(0, -1));
  const productDescription = (product.description || "").substring(0, 155);

  return (
    <Layout>
      <SEOHead
        title={product.name}
        description={
          productDescription ||
          `${product.name} - Carpintería industrial profesional. CYDMA, distribuidores especializados.`
        }
        canonical={`https://cydma.es/producto/${product.slug}`}
        ogType="product"
        ogImage={product.images[0]}
        schema={[productSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <div className="bg-secondary/30 border-b">
        <div className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/catalogo">Catálogo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/catalogo/${category.slug}`}>{category.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : null}
              {subcategory ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/catalogo/${category?.slug}/${subcategory.slug}`}>
                        {subcategory.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : null}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary/30"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </motion.div>
              {product.images.length > 1 ? (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Info */}
            <StaggerContainer stagger={0.1}>
              <StaggerItem variant="fade-up">
                <p className="text-accent font-medium tracking-wider uppercase text-sm mb-2">
                  {product.code}
                </p>
              </StaggerItem>
              <StaggerItem variant="fade-up">
                <h1 className="font-serif text-display-sm text-foreground mb-4">
                  {product.name}
                </h1>
              </StaggerItem>
              <StaggerItem variant="fade-up">
                <p className="text-lg text-muted-foreground mb-6">
                  {product.description}
                </p>
              </StaggerItem>

              {product.features && product.features.length > 0 ? (
                <StaggerItem variant="fade-up">
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3">Características</h3>
                    <StaggerContainer
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      stagger={0.08}
                    >
                      {product.features.map((feature) => (
                        <StaggerItem
                          key={feature}
                          variant="fade-left"
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{feature}</span>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </StaggerItem>
              ) : null}

              {/* Actions */}
              <StaggerItem variant="fade-up">
                <div className="space-y-4 mb-8">
                  {/* Price + stock */}
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-semibold text-foreground">
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        }).format(product.price)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ unidad</span>
                    </div>
                    {product.stock <= 0 ? (
                      <p className="text-sm text-destructive font-medium">Sin stock</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {product.stock} unidades disponibles
                      </p>
                    )}
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md p-1">
                          <button
                            onClick={() => setCartQty(Math.max(1, cartQty - 1))}
                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold tabular-nums">
                            {cartQty}
                          </span>
                          <button
                            onClick={() =>
                              setCartQty(Math.min(product.stock, cartQty + 1))
                            }
                            disabled={cartQty >= product.stock}
                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Button
                          size="lg"
                          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                          onClick={handleAddToCart}
                          disabled={isAddingToCart || product.stock <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isAddingToCart ? "Añadiendo..." : "Añadir al carrito"}
                        </Button>
                      </div>
                    ) : (
                      <Button size="lg" className="w-full" disabled>
                        Sin stock
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild size="lg" variant="outline" className="flex-1">
                      <Link
                        to={`/contacto?asunto=presupuesto&producto=${encodeURIComponent(product.name)}`}
                      >
                        Solicitar Presupuesto
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </StaggerItem>

              {/* Contact */}
              <StaggerItem variant="fade-up">
                <div className="bg-secondary/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">¿Tiene dudas sobre este producto?</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:983625022"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      983 625 022
                    </a>
                    <a
                      href="mailto:cydma@cydma.es"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      cydma@cydma.es
                    </a>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 ? (
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <ScrollReveal variant="fade-up">
              <h2 className="font-serif text-2xl font-semibold mb-8">
                Productos Relacionados
              </h2>
            </ScrollReveal>
            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              stagger={0.1}
            >
              {relatedProducts.map((relProduct) => (
                <StaggerItem key={relProduct.id} variant="scale">
                  <Link
                    to={`/producto/${relProduct.slug}`}
                    className="group bg-card rounded-lg overflow-hidden border shadow-soft hover:shadow-soft-lg transition-shadow block"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-secondary/30">
                      {relProduct.images.length > 0 ? (
                        <img
                          src={relProduct.images[0]}
                          alt={relProduct.name}
                          loading="lazy"
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-accent font-medium mb-1">
                        {relProduct.code}
                      </p>
                      <h3 className="font-serif text-base font-semibold group-hover:text-primary transition-colors">
                        {relProduct.name}
                      </h3>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
