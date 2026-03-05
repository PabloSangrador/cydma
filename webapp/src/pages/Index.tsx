import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ValuesSection from "@/components/home/ValuesSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import BusinessLinesSection from "@/components/home/BusinessLinesSection";
import CTASection from "@/components/home/CTASection";
import {
  ValuesToCategoriesTransition,
  CategoriesToBusinessTransition,
} from "@/components/motion/SectionTransitions";
import SEOHead from "@/components/seo/SEOHead";
import { getOrganizationSchema, getWebSiteSchema } from "@/components/seo/schemas";

export default function Index() {
  return (
    <Layout>
      <SEOHead
        title="Carpintería Industrial | Puertas, Herrajes y Armarios para Profesionales"
        description="CYDMA, referentes en carpintería industrial desde 1989. Puertas lacadas, acorazadas, herrajes, armarios a medida y soluciones para profesionales en Valladolid y toda España."
        canonical="https://cydma.es/"
        schema={[getOrganizationSchema(), getWebSiteSchema()]}
      />
      <HeroSection />
      <ValuesSection />
      <ValuesToCategoriesTransition />
      <CategoriesSection />
      <CategoriesToBusinessTransition />
      <BusinessLinesSection />
      <CTASection />
    </Layout>
  );
}
