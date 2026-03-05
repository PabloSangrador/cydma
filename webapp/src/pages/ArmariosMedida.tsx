import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ConfiguradorArmarios from "@/components/configurador/ConfiguradorArmarios";
import { Phone, Box, Factory, Clock, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";
import { getBreadcrumbSchema } from "@/components/seo/schemas";

export default function ArmariosMedida() {
  // Ventajas con iconos
  const ventajas = [
    { icon: Box, titulo: "Visualización 3D", descripcion: "Configura y visualiza en tiempo real" },
    { icon: Factory, titulo: "Fabricación Propia", descripcion: "Producción en nuestras instalaciones" },
    { icon: Clock, titulo: "15-20 Días", descripcion: "Plazo de fabricación" },
    { icon: Wrench, titulo: "Instalación", descripcion: "Servicio de montaje disponible" },
  ];

  // FAQs para SEO
  const faqs = [
    {
      pregunta: "¿Cuáles son las medidas mínimas y máximas?",
      respuesta: "Fabricamos armarios desde 40cm hasta 360cm de ancho, con alturas entre 200cm y 240cm y fondos de 45cm a 70cm."
    },
    {
      pregunta: "¿Puertas batientes o correderas?",
      respuesta: "Las puertas batientes son ideales para armarios de hasta 240cm y ofrecen acceso total al interior. Las correderas ahorran espacio y son perfectas para pasillos y habitaciones pequeñas."
    },
    {
      pregunta: "¿Puedo personalizar el interior?",
      respuesta: "Sí, nuestro configurador permite añadir cajoneras, barras de colgar, baldas, zapateros y pantaloneros, posicionándolos a la altura que prefieras."
    },
    {
      pregunta: "¿El precio incluye la instalación?",
      respuesta: "El precio del configurador no incluye instalación. Ofrecemos servicio de montaje profesional como opción adicional."
    },
    {
      pregunta: "¿Qué acabados están disponibles?",
      respuesta: "Disponemos de más de 10 acabados exteriores (blancos, grises, maderas naturales) y 5 acabados interiores incluyendo textiles y lisos."
    },
  ];

  // Schema.org FAQPage JSON-LD para SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.pregunta,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.respuesta
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    script.id = "faq-schema-armarios";

    // Eliminar si ya existe
    const existing = document.getElementById("faq-schema-armarios");
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("faq-schema-armarios");
      if (el) el.remove();
    };
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Armarios a Medida | Fabricación Industrial Personalizada"
        description="Armarios a medida fabricados con precisión industrial. CYDMA diseña y suministra armarios personalizados para proyectos de interiorismo y construcción en toda España."
        canonical="https://cydma.es/armarios-medida"
        schema={getBreadcrumbSchema([{ name: "Armarios a Medida", url: "https://cydma.es/armarios-medida" }])}
      />
      {/* Hero compacto */}
      <section className="relative min-h-[40vh] max-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80">
        {/* Overlay con patrón sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)]" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 container text-center text-primary-foreground py-12">
          {/* Breadcrumb integrado */}
          <nav className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground transition-colors">Inicio</Link>
              </li>
              <li className="text-primary-foreground/40">/</li>
              <li>
                <Link to="/catalogo" className="hover:text-primary-foreground transition-colors">Catálogo</Link>
              </li>
              <li className="text-primary-foreground/40">/</li>
              <li className="text-primary-foreground font-medium">Armarios a Medida</li>
            </ol>
          </nav>

          {/* Badge */}
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-accent/90 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
              Visualización 3D en tiempo real
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Armarios a Medida
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Diseña tu armario perfecto con nuestro configurador 3D. Elige dimensiones, puertas, acabados e interior.
          </motion.p>
        </div>
      </section>

      {/* Sección de Valor */}
      <section className="py-12 bg-card border-b">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" stagger={0.07} threshold={0.1}>
            {ventajas.map((ventaja) => (
              <StaggerItem key={ventaja.titulo} variant="scale">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                    <ventaja.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{ventaja.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{ventaja.descripcion}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Texto SEO */}
      <section className="py-10 bg-secondary/30">
        <div className="container max-w-4xl">
          <ScrollReveal variant="fade-up" threshold={0.2}>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Configurador 3D de Armarios a Medida
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Diseña tu armario empotrado o vestidor a medida con nuestro configurador 3D profesional.
              Elige entre puertas batientes o correderas, más de 10 acabados exteriores y 5 interiores,
              y personaliza el interior con cajoneras, barras, baldas y más.
              Fabricación propia en Íscar (Valladolid) con materiales de primera calidad.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Configurador 3D */}
      <ConfiguradorArmarios />

      {/* Sección FAQ */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-muted-foreground">
              Resolvemos tus dudas sobre nuestros armarios a medida
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-background rounded-xl border shadow-soft px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-serif text-base md:text-lg font-medium py-5 hover:no-underline [&[data-state=open]]:text-accent">
                  {faq.pregunta}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.respuesta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container text-center">
          <ScrollReveal variant="fade-up" delay={0.1}>
            <h2 className="font-serif text-xl md:text-2xl font-semibold mb-4">
              ¿Necesitas ayuda con tu configuración?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Nuestro equipo te asesorará para diseñar el armario perfecto para tu espacio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contacto">Contactar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="tel:983625022">
                  <Phone className="h-4 w-4 mr-2" />
                  983 625 022
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
