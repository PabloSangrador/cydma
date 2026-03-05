import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import ConfiguradorArmarios from "@/components/configurador/ConfiguradorArmarios";
import SEOHead from "@/components/seo/SEOHead";

export default function Configurador() {
  return (
    <Layout>
      <SEOHead
        title="Configurador de Armarios | CYDMA"
        description="Diseña tu armario a medida con nuestro configurador 3D interactivo. Elige dimensiones, módulos, puertas y acabados. Carpintería industrial CYDMA."
        canonical="https://cydma.es/configurador"
        noIndex={false}
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
                <BreadcrumbPage>Configurador de Armarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Settings2 className="h-4 w-4" />
              Herramienta interactiva
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Configurador de Armarios
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Diseña tu armario a medida con nuestra herramienta interactiva 3D.
              Personaliza dimensiones, módulos, tipo de puertas y acabados para obtener
              exactamente lo que necesitas.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Configurador Component */}
      <section className="py-8">
        <div className="container">
          <ConfiguradorArmarios />
        </div>
      </section>
    </Layout>
  );
}
