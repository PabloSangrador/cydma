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
import { Globe, Package, Ship, FileCheck, Building2, CheckCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const features = [
  {
    icon: Package,
    title: "Professional Packaging",
    description: "Material labeled, wrapped, and palletized following international standards.",
  },
  {
    icon: Ship,
    title: "Global Shipping",
    description: "Standardized shipping protocols for destinations worldwide.",
  },
  {
    icon: FileCheck,
    title: "Documentation",
    description: "Complete export documentation and customs support.",
  },
  {
    icon: Building2,
    title: "Project Experience",
    description: "Hotels, hospitals, residential developments across the globe.",
  },
];

const projects = [
  "Hotels and resorts",
  "Hospitals and healthcare facilities",
  "Residential developments",
  "Commercial buildings",
  "Educational institutions",
  "Government projects",
];

export default function Export() {
  return (
    <Layout>
      <SEOHead
        title="Export | CYDMA"
        description="Export services CYDMA."
        canonical="https://cydma.es/export"
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
                <BreadcrumbPage>Export</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero - English content */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1920&q=80"
            alt="CYDMA Export - Carpintería española para proyectos internacionales"
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
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <p className="text-accent font-medium tracking-wider uppercase text-sm">
                International Division
              </p>
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Export Services
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              We bring Spanish carpentry excellence to the world. With over 35 years
              of experience, we deliver quality doors, hardware, and woodwork
              solutions to international projects across the globe.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button asChild size="lg">
                <a href="mailto:export@cydma.es">Contact Export Team</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/catalogo">View Catalog</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                Why Choose CYDMA Export
              </h2>
              <p className="text-muted-foreground">
                We handle every aspect of international delivery to ensure your
                project receives the quality and service it deserves.
              </p>
            </div>
          </ScrollReveal>
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

      {/* Project Types */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fade-right">
              <div>
                <h2 className="font-serif text-display-sm mb-6">
                  International Project Experience
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  We have successfully delivered carpentry solutions to a wide range
                  of international projects. Our team understands the unique requirements
                  of large-scale developments and provides comprehensive support throughout
                  the process.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((project) => (
                    <div key={project} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-sm">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                  alt="International Projects"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal variant="fade-up">
              <h2 className="font-serif text-display-sm text-foreground text-center mb-12">
                Our Export Process
              </h2>
            </ScrollReveal>
            <StaggerContainer className="space-y-8" stagger={0.08}>
              {[
                {
                  step: "01",
                  title: "Consultation",
                  description:
                    "We analyze your project requirements and provide tailored recommendations.",
                },
                {
                  step: "02",
                  title: "Quotation",
                  description:
                    "Detailed pricing including products, packaging, and shipping to your destination.",
                },
                {
                  step: "03",
                  title: "Production",
                  description:
                    "Manufacturing with rigorous quality control at every stage.",
                },
                {
                  step: "04",
                  title: "Packaging & Shipping",
                  description:
                    "Professional packaging and coordinated delivery to your project site.",
                },
              ].map((item) => (
                <StaggerItem key={item.step} variant="scale">
                  <div className="flex gap-6 p-6 bg-secondary/30 rounded-lg">
                    <span className="font-serif text-3xl font-bold text-accent">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal variant="fade-up" threshold={0.3}>
              <h2 className="font-serif text-display-sm text-foreground mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contact our export team for a consultation and quotation.
                We're ready to bring Spanish craftsmanship to your next project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <a href="mailto:export@cydma.es">
                    <Mail className="h-4 w-4" />
                    export@cydma.es
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Phone: +34 983 625 022
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
