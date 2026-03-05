export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CYDMA",
    "url": "https://cydma.es",
    "logo": "https://cydma.es/logo-cydma-0006-corporativo.png",
    "description": "Referentes en el servicio integral de carpintería industrial desde 1989. Puertas, herrajes, armarios y soluciones para profesionales.",
    "foundingDate": "1989",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Polígono Industrial",
      "addressLocality": "Íscar",
      "addressRegion": "Valladolid",
      "postalCode": "47420",
      "addressCountry": "ES"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "sales",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": []
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CYDMA",
    "url": "https://cydma.es",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cydma.es/catalogo?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CYDMA",
    "image": "https://cydma.es/og-base.png",
    "url": "https://cydma.es",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Polígono Industrial",
      "addressLocality": "Íscar",
      "addressRegion": "Valladolid",
      "postalCode": "47420",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.3614,
      "longitude": -4.5469
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "CYDMA"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CYDMA"
      }
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://cydma.es" },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": item.url
      }))
    ]
  };
}
