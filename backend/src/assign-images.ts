/**
 * Script que asigna imágenes a los productos de la BD cruzando los códigos
 * con los archivos disponibles en webapp/public/.
 *
 * Estrategias de matching (en orden):
 *   1. Exacto case-insensitive: filename === code
 *   2. Variante: filename empieza por code + "_" (ej. RS-310_N.png para RS-310)
 *   3. Normalizado (sin guiones): normalize(filename) === normalize(code)
 *
 * Ejecutar con: bun run src/assign-images.ts
 */
import { prisma } from "./db";
import { readdirSync } from "fs";
import { join, extname, basename } from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);
const PUBLIC_DIR = join(__dirname, "../../webapp/public");

function normalize(s: string) {
  return s.toLowerCase().replace(/-/g, "");
}

/** Normalización ampliada: espacios→_, sin barras, sin paréntesis, lowercase */
function normalizeWide(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "_")   // espacios → _
    .replace(/\//g, "")     // elimina /
    .replace(/[()]/g, "");  // elimina paréntesis
}

async function main() {
  // 1. Leer todos los archivos de imagen disponibles
  const allFiles = readdirSync(PUBLIC_DIR);
  const imageFiles = allFiles.filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()));

  console.log(`Archivos de imagen encontrados en public/: ${imageFiles.length}`);

  // 2. Obtener todos los productos
  const products = await prisma.product.findMany({ select: { id: true, code: true, images: true } });
  console.log(`Productos en BD: ${products.length}`);

  let updated = 0;
  let skipped = 0;
  const noMatch: string[] = [];

  for (const product of products) {
    const code = product.code;
    const codeLower = code.toLowerCase();
    const codeNorm = normalize(code);

    // Recoger todas las imágenes que coinciden con este código
    const matched = imageFiles.filter((file) => {
      const nameNoExt = basename(file, extname(file));
      const nameLower = nameNoExt.toLowerCase();
      const nameNorm = normalize(nameNoExt);

      const codeWide = normalizeWide(code);
      const nameWide = normalizeWide(nameNoExt);

      // Estrategia 1: exacto case-insensitive
      if (nameLower === codeLower) return true;
      // Estrategia 2: variante con sufijo "_" (ej. RS-310_N para código RS-310)
      if (nameLower.startsWith(codeLower + "_")) return true;
      // Estrategia 3: normalizado sin guiones
      if (nameNorm === codeNorm) return true;
      // Estrategia 4: normalización amplia (espacios→_, sin /, sin paréntesis)
      if (nameWide === codeWide) return true;
      // Estrategia 5: variante amplia (ej. "RS-6 SN" → startsWith "rs-6_sn_")
      if (nameWide.startsWith(codeWide + "_")) return true;

      return false;
    });

    if (matched.length === 0) {
      noMatch.push(code);
      skipped++;
      continue;
    }

    const imageUrls = matched.map((f) => `/${f}`);
    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(imageUrls) },
    });
    updated++;
    console.log(`  [OK] ${code} → ${imageUrls.join(", ")}`);
  }

  console.log(`\nResultado:`);
  console.log(`  Actualizados: ${updated}`);
  console.log(`  Sin imagen:   ${skipped}`);
  if (noMatch.length > 0) {
    console.log(`\nProductos sin imagen encontrada:`);
    noMatch.forEach((c) => console.log(`  - ${c}`));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
