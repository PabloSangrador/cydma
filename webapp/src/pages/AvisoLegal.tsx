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
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/seo/SEOHead";

export default function AvisoLegal() {
  return (
    <Layout>
      <SEOHead
        title="Aviso Legal | CYDMA"
        description="Aviso legal de CYDMA. Información sobre el titular del sitio web, condiciones de uso y propiedad intelectual."
        canonical="https://cydma.es/legal"
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
                <BreadcrumbPage>Aviso Legal</BreadcrumbPage>
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
              <FileText className="h-4 w-4" />
              Información legal
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Aviso Legal
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la
              Sociedad de la Información y de Comercio Electrónico (LSSI-CE), le informamos
              de los datos identificativos del titular de este sitio web.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">1. Datos Identificativos del Titular</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                De conformidad con el artículo 10 de la LSSI-CE, a continuación se exponen los datos
                identificativos del titular del presente sitio web:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Denominación social:</span> CYDMA, S.L.</li>
                <li><span className="font-medium text-foreground">Domicilio social:</span> Polígono Industrial, Íscar, Valladolid, España</li>
                <li><span className="font-medium text-foreground">Email:</span>{" "}
                  <a href="mailto:cydma@cydma.es" className="text-accent hover:underline">cydma@cydma.es</a>
                </li>
                <li><span className="font-medium text-foreground">Teléfono:</span> 983 625 022</li>
                <li><span className="font-medium text-foreground">Sitio web:</span>{" "}
                  <a href="https://www.cydma.es" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.cydma.es</a>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">2. Objeto y Condiciones de Uso</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                El presente sitio web tiene como objeto la presentación de la empresa CYDMA, sus productos,
                servicios e información corporativa. El acceso y uso del sitio web atribuye la condición de
                usuario e implica la aceptación plena de las presentes condiciones de uso.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                CYDMA se reserva el derecho a modificar, en cualquier momento y sin previo aviso, la
                presentación y configuración del sitio web, así como los presentes términos legales.
                El usuario es responsable de consultar periódicamente las condiciones vigentes.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">3. Propiedad Intelectual e Industrial</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Todos los contenidos del sitio web de CYDMA, incluyendo, sin carácter limitativo, textos,
                fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos
                audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, son propiedad
                intelectual de CYDMA o de terceros que han autorizado su uso.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Queda expresamente prohibida la reproducción, distribución, comunicación pública,
                transformación o cualquier otra forma de explotación de los citados contenidos, sin la
                autorización escrita previa de CYDMA. El incumplimiento de esta prohibición podrá dar
                lugar al ejercicio de las acciones legales que correspondan.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">4. Responsabilidad y Garantías</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                CYDMA no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran
                ocasionarse por el acceso o uso del sitio web, incluyendo los producidos en los sistemas
                informáticos o los introducidos por virus informáticos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                La información contenida en este sitio web tiene carácter meramente informativo. CYDMA se
                esfuerza por mantener los contenidos actualizados y precisos, pero no garantiza la
                exhaustividad ni la ausencia de errores en los mismos.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">5. Enlaces a Terceros</h2>
              <p className="text-muted-foreground leading-relaxed">
                El sitio web puede contener enlaces a otras páginas web de terceros. CYDMA no controla
                ni se hace responsable de los contenidos, políticas de privacidad o prácticas de dichos
                sitios de terceros. Se recomienda al usuario que lea los avisos legales y políticas de
                privacidad de cualquier sitio web que visite.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">6. Legislación Aplicable y Jurisdicción</h2>
              <p className="text-muted-foreground leading-relaxed">
                Las presentes condiciones legales se rigen por la legislación española. Para la resolución
                de cualquier controversia derivada del acceso o uso de este sitio web, las partes se someten
                expresamente a los Juzgados y Tribunales de Valladolid, con renuncia expresa a cualquier
                otro fuero que pudiera corresponderles.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
