import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Warehouse, Truck, Package, Users, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const features = [
  {
    icon: Package,
    title: "Stock en rotación",
    description: "Amplio catálogo de productos disponibles para entrega inmediata.",
  },
  {
    icon: Truck,
    title: "Servicio piso a piso",
    description: "Entrega en toda España con servicio puerta a puerta.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    description: "Equipo comercial dedicado a asesorarle en cada pedido.",
  },
  {
    icon: Clock,
    title: "Rapidez",
    description: "Productos listos para montaje y entrega ágil.",
  },
];

export default function Almacen() {
  return (
    <Layout>
      <SEOHead
        title="Almacén | CYDMA"
        description="Servicio de almacén CYDMA."
        canonical="https://cydma.es/almacen"
        noIndex={true}
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
                <BreadcrumbPage>Almacén</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504222490345-c075b6008014?w=1920&q=80"
            alt="Almacén CYDMA - Más de 5.000 referencias en stock"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Warehouse className="h-6 w-6 text-accent" />
              </div>
              <p className="text-accent font-medium tracking-wider uppercase text-sm">
                Servicio de Almacén
              </p>
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Stock disponible para profesionales
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Mantenemos un amplio stock en continua rotación para satisfacer las
              necesidades de nuestros clientes profesionales. Servicio piso a piso
              para toda España con productos listos para montaje.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button asChild size="lg">
                <Link to="/contacto">Solicitar información</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.08}>
            {features.map((feature) => (
              <StaggerItem key={feature.title} variant="scale">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                    <feature.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                Qué ofrecemos
              </h2>
              <p className="text-muted-foreground">
                Todo lo que necesita para su negocio de carpintería, disponible en stock.
              </p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto" stagger={0.08}>
            {[
              "Puertas de interior en diversos acabados",
              "Puertas acorazadas de seguridad",
              "Herrajes y complementos",
              "Armarios modulares",
              "Marcos y molduras",
              "Personalización de productos",
            ].map((item) => (
              <StaggerItem key={item} variant="scale">
                <div className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-soft">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container text-center">
          <ScrollReveal variant="fade-up" threshold={0.3}>
            <h2 className="font-serif text-display-sm text-foreground mb-4">
              ¿Necesita productos para su próximo proyecto?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Contacte con nuestro equipo comercial para conocer disponibilidad y precios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contacto">Contactar</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/catalogo">Ver catálogo</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
