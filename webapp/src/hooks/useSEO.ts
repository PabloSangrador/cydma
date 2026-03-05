export function useCatalogSEO(categoria?: string, subcategoria?: string) {
  const formatSlug = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (subcategoria) {
    return {
      title: `${formatSlug(subcategoria)} — ${formatSlug(categoria!)} | CYDMA`,
      description: `Productos de ${formatSlug(subcategoria)} de la categoría ${formatSlug(categoria!)}. Calidad industrial para profesionales del sector de la carpintería en España.`,
      canonical: `https://cydma.es/catalogo/${categoria}/${subcategoria}`,
    };
  }
  if (categoria) {
    return {
      title: `${formatSlug(categoria)} | Catálogo CYDMA`,
      description: `Descubre nuestra selección de ${formatSlug(categoria).toLowerCase()} en CYDMA. Calidad industrial para profesionales del sector de la carpintería en España.`,
      canonical: `https://cydma.es/catalogo/${categoria}`,
    };
  }
  return {
    title: "Catálogo de Productos | Puertas, Herrajes y Armarios",
    description: "Explora el catálogo completo de CYDMA: puertas lacadas, acorazadas, herrajes, armarios y soluciones fenólicas. Calidades contrastadas para el profesional.",
    canonical: "https://cydma.es/catalogo",
  };
}
