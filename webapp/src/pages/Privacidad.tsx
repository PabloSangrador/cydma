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
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/seo/SEOHead";

export default function Privacidad() {
  return (
    <Layout>
      <SEOHead
        title="Política de Privacidad | CYDMA"
        description="Consulta la política de privacidad de CYDMA. Información sobre el tratamiento de datos personales, derechos del usuario y contacto del responsable."
        canonical="https://cydma.es/privacidad"
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
                <BreadcrumbPage>Política de Privacidad</BreadcrumbPage>
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
              <Shield className="h-4 w-4" />
              Protección de datos
            </motion.div>
            <motion.h1
              className="font-serif text-display-sm md:text-display text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Política de Privacidad
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Última actualización: enero de 2025. En CYDMA nos comprometemos a proteger
              su privacidad y a tratar sus datos personales con plena transparencia y
              conforme a la normativa vigente.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">1. Responsable del Tratamiento</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y
                la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD),
                le informamos de que el responsable del tratamiento de sus datos es:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li><span className="font-medium text-foreground">Razón social:</span> CYDMA, S.L.</li>
                <li><span className="font-medium text-foreground">Domicilio:</span> Polígono Industrial, Íscar, Valladolid, España</li>
                <li><span className="font-medium text-foreground">Email de contacto:</span> cydma@cydma.es</li>
                <li><span className="font-medium text-foreground">Teléfono:</span> 983 625 022</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">2. Datos que Recopilamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Recopilamos únicamente los datos que usted nos proporciona voluntariamente a través de
                nuestros formularios de contacto y solicitud de presupuesto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono (opcional)</li>
                <li>Nombre de la empresa (cuando corresponda)</li>
                <li>Mensaje o consulta dirigida a CYDMA</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">3. Finalidad del Tratamiento</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Sus datos personales son tratados con las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Gestionar y responder a sus solicitudes de información y presupuesto</li>
                <li>Envío de comunicaciones comerciales sobre nuestros productos y servicios, previa solicitud o autorización expresa</li>
                <li>Gestión de la relación comercial con clientes y proveedores</li>
                <li>Cumplimiento de obligaciones legales aplicables</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">4. Base Jurídica del Tratamiento</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                El tratamiento de sus datos se basa en:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Consentimiento:</span> para el envío de comunicaciones comerciales.</li>
                <li><span className="font-medium text-foreground">Interés legítimo:</span> para responder a consultas y gestionar la relación precontractual.</li>
                <li><span className="font-medium text-foreground">Ejecución contractual:</span> para la gestión de pedidos y servicios contratados.</li>
                <li><span className="font-medium text-foreground">Obligación legal:</span> para el cumplimiento de la normativa fiscal y mercantil.</li>
              </ul>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">5. Conservación de los Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sus datos serán conservados durante el tiempo necesario para la finalidad para la que
                fueron recabados y mientras exista una relación comercial o contractual activa. Una vez
                finalizada dicha relación, los datos se conservarán bloqueados durante los plazos
                establecidos por la legislación vigente (generalmente 5 años para obligaciones mercantiles
                y 4 años para obligaciones fiscales), transcurridos los cuales serán suprimidos de forma segura.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">6. Destinatarios de los Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                CYDMA no cede ni vende sus datos personales a terceros, salvo obligación legal o cuando
                sea estrictamente necesario para la prestación del servicio (por ejemplo, empresas de
                transporte o plataformas de pago). En estos casos, se exige contractualmente a los
                destinatarios que mantengan los datos con las mismas garantías de confidencialidad
                y seguridad que aplicamos nosotros.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">7. Sus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Conforme al RGPD, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Acceso:</span> conocer qué datos suyos tratamos.</li>
                <li><span className="font-medium text-foreground">Rectificación:</span> corregir datos inexactos o incompletos.</li>
                <li><span className="font-medium text-foreground">Supresión:</span> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
                <li><span className="font-medium text-foreground">Limitación:</span> solicitar la restricción del tratamiento en determinadas circunstancias.</li>
                <li><span className="font-medium text-foreground">Portabilidad:</span> recibir sus datos en un formato estructurado y legible por máquina.</li>
                <li><span className="font-medium text-foreground">Oposición:</span> oponerse al tratamiento basado en interés legítimo.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Para ejercer cualquiera de estos derechos, puede contactarnos en{" "}
                <a href="mailto:cydma@cydma.es" className="text-accent hover:underline">cydma@cydma.es</a>.
                También tiene derecho a presentar una reclamación ante la Agencia Española de
                Protección de Datos (www.aepd.es).
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold mb-4">8. Seguridad de los Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                CYDMA aplica las medidas técnicas y organizativas adecuadas para garantizar
                un nivel de seguridad apropiado al riesgo, incluyendo el cifrado de las
                comunicaciones mediante protocolo HTTPS, el control de acceso a los sistemas
                y la formación del personal en materia de protección de datos.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
