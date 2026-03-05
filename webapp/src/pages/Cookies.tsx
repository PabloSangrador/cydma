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
import { Cookie } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/seo/SEOHead";

export default function Cookies() {
  return (
    <Layout>
      <SEOHead
        title="Política de Cookies | CYDMA"
        description="Consulta la política de cookies de CYDMA. Información sobre qué cookies utilizamos, para qué sirven y cómo puedes gestionarlas."
        canonical="https://cydma.es/cookies"
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
                <BreadcrumbPage>Política de Cookies</BreadcrumbPage>
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
              <Cookie className="h-4 w-4" />
              Gestión de cookies
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Política de Cookies
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Última actualización: enero de 2025. Este sitio web utiliza cookies y tecnologías
              similares para mejorar su experiencia de navegación. A continuación le explicamos
              qué son, para qué las usamos y cómo puede gestionarlas.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">1. ¿Qué son las Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Las cookies son pequeños archivos de texto que se descargan y almacenan en su
                dispositivo (ordenador, tablet o smartphone) cuando visita un sitio web. Permiten
                que el sitio recuerde información sobre su visita, como el idioma preferido y otras
                opciones de configuración, lo que facilita la navegación y hace que el sitio resulte
                más útil.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">2. Tipos de Cookies que Utilizamos</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cookies Estrictamente Necesarias</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                    Son imprescindibles para el funcionamiento del sitio web. Sin ellas, algunas partes
                    del sitio no funcionarían correctamente. No requieren consentimiento.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-muted-foreground">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Cookie</th>
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Proveedor</th>
                          <th className="text-left py-2 font-medium text-foreground">Finalidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 pr-4 font-mono text-xs">session_id</td>
                          <td className="py-2 pr-4">CYDMA</td>
                          <td className="py-2">Gestión de sesión de usuario</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-xs">csrf_token</td>
                          <td className="py-2 pr-4">CYDMA</td>
                          <td className="py-2">Seguridad contra ataques CSRF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cookies de Preferencias</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                    Permiten recordar las preferencias del usuario, como el idioma o la región, para
                    personalizar la experiencia de navegación.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-muted-foreground">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Cookie</th>
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Proveedor</th>
                          <th className="text-left py-2 font-medium text-foreground">Finalidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                          <td className="py-2 pr-4">CYDMA</td>
                          <td className="py-2">Almacena las preferencias de cookies del usuario</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cookies Analíticas</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                    Permiten conocer cómo interactúan los visitantes con el sitio web. Toda la
                    información recogida es anónima y se utiliza únicamente para mejorar el funcionamiento
                    del sitio. Requieren consentimiento.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-muted-foreground">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Cookie</th>
                          <th className="text-left py-2 pr-4 font-medium text-foreground">Proveedor</th>
                          <th className="text-left py-2 font-medium text-foreground">Finalidad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 pr-4 font-mono text-xs">_ga</td>
                          <td className="py-2 pr-4">Google Analytics</td>
                          <td className="py-2">Distingue usuarios únicos (2 años)</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-xs">_ga_*</td>
                          <td className="py-2 pr-4">Google Analytics</td>
                          <td className="py-2">Mantiene el estado de sesión (2 años)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">3. Cómo Gestionar las Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Puede configurar su navegador para rechazar todas las cookies, aceptar solo
                determinadas cookies o eliminar las cookies almacenadas. A continuación le indicamos
                cómo hacerlo en los navegadores más habituales:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Tenga en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento
                del sitio web.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">4. Actualizaciones de Esta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                CYDMA puede actualizar esta política de cookies en cualquier momento para adaptarse
                a novedades legislativas, jurisprudenciales o a cambios en los servicios utilizados.
                Se recomienda revisar periódicamente esta página para mantenerse informado.
                Para cualquier consulta sobre nuestra política de cookies, puede contactarnos en{" "}
                <a href="mailto:cydma@cydma.es" className="text-accent hover:underline">cydma@cydma.es</a>.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">5. Más Información</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para más información sobre cómo tratamos sus datos personales, consulte nuestra{" "}
                <Link to="/privacidad" className="text-accent hover:underline">Política de Privacidad</Link>.
                Para información general sobre el sitio web, consulte nuestro{" "}
                <Link to="/legal" className="text-accent hover:underline">Aviso Legal</Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
