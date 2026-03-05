# CYDMA — Corporate Website & E-Commerce

Corporate website and online store for **CYDMA** (Carpintería y Distribución de Materiales), an industrial carpentry B2B company with over 35 years of experience in Íscar, Valladolid, Spain. The site showcases their product catalog, business lines, custom solutions, and includes a full e-commerce system with Stripe payments.

---

## Tech Stack

### Frontend (`/webapp`)
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| React Router DOM | 6.30 | Client-side routing |
| Framer Motion | 11.15 | Animations & parallax |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui (Radix UI) | latest | Accessible component primitives |
| TanStack Query | 5.90 | Server state management |
| Embla Carousel | 8.6 | Carousel/slider |
| Lucide React | 0.462 | Icon library |
| React Hook Form | 7.66 | Form management |
| Zod | 3.25 | Schema validation |
| Three.js | 0.182 | 3D wardrobe configurator |
| react-helmet-async | 2.0 | SEO meta tag management |

### Backend (`/backend`)
| Technology | Version | Purpose |
|---|---|---|
| Bun | latest | JavaScript runtime |
| Hono | 4.6 | Web framework |
| TypeScript | 5.8 | Type safety |
| Zod | 4.1 | Schema validation |

---

## Project Structure

```
/
├── webapp/                       # React frontend (port 8000)
│   ├── src/
│   │   ├── pages/                # Route-level page components
│   │   │   ├── Index.tsx         # Home page
│   │   │   ├── QuienesSomos.tsx  # About us
│   │   │   ├── Catalogo.tsx      # Product catalog main
│   │   │   ├── CatalogoCategoria.tsx # Catalog category/subcategory
│   │   │   ├── ProductoDetalle.tsx   # Product detail
│   │   │   ├── Almacen.tsx       # Warehouse service
│   │   │   ├── Contract.tsx      # Contract service
│   │   │   ├── Export.tsx        # Export service
│   │   │   ├── Contacto.tsx      # Contact form
│   │   │   ├── ArmariosMedida.tsx # Custom wardrobes
│   │   │   ├── PuertasMedida.tsx  # Custom doors
│   │   │   ├── Proyectos.tsx     # Completed projects portfolio
│   │   │   ├── Calculadora.tsx   # Budget estimator tool
│   │   │   ├── Garantia.tsx      # Warranty information
│   │   │   ├── Configurador.tsx  # 3D wardrobe configurator
│   │   │   ├── Privacidad.tsx    # Privacy policy
│   │   │   ├── AvisoLegal.tsx    # Legal notice
│   │   │   ├── Cookies.tsx       # Cookie policy
│   │   │   └── NotFound.tsx      # 404 page
│   │   ├── components/
│   │   │   ├── layout/           # Header, Footer, MegaMenu, NavLink, Layout
│   │   │   ├── home/             # Homepage section components
│   │   │   ├── motion/           # Animation utilities (ScrollReveal, Counter, SplitText)
│   │   │   ├── configurador/     # 3D wardrobe configurator (Three.js)
│   │   │   ├── seo/              # SEO head component
│   │   │   └── ui/               # shadcn/ui component library (70+ components)
│   │   ├── data/
│   │   │   └── catalog.ts        # All product and category data
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/
│   │   │   ├── api.ts            # API client helper
│   │   │   └── utils.ts          # Tailwind merge utility
│   │   ├── App.tsx               # Router and route definitions
│   │   └── main.tsx              # React entry point
│   ├── public/                   # Static assets (logos, images)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend/                      # Hono API server (port 3000)
    ├── src/
    │   ├── index.ts              # Server entry point
    │   └── types.ts              # Shared Zod schemas (API contracts)
    ├── prisma/                   # Database schema & migrations
    └── package.json
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | Index | Homepage with hero, values, categories, business lines, CTA |
| `/quienes-somos` | QuienesSomos | Company history and team |
| `/catalogo` | Catalogo | Full product catalog listing |
| `/catalogo/:categoria` | CatalogoCategoria | Category product grid |
| `/catalogo/:categoria/:subcategoria` | CatalogoCategoria | Subcategory product grid |
| `/producto/:id` | ProductoDetalle | Individual product detail |
| `/almacen` | Almacen | Warehouse/stock service |
| `/contract` | Contract | Contract (hotel/office) service |
| `/export` | Export | International export service |
| `/contacto` | Contacto | Contact form |
| `/armarios-medida` | ArmariosMedida | Custom wardrobes |
| `/puertas-medida` | PuertasMedida | Custom doors |
| `/proyectos` | Proyectos | Projects portfolio |
| `/calculadora` | Calculadora | Budget calculator |
| `/garantia` | Garantia | Warranty information |
| `/configurador` | Configurador | 3D wardrobe configurator |
| `/privacidad` | Privacidad | Privacy policy (GDPR) |
| `/legal` | AvisoLegal | Legal notice |
| `/cookies` | Cookies | Cookie policy |

---

## Installation & Development

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.0
- Node.js ≥ 18 (for frontend tooling)

### Frontend

```bash
cd webapp
bun install
bun run dev      # Starts dev server on http://localhost:8000
bun run build    # Production build → dist/
bun run preview  # Preview production build
bun run lint     # ESLint check
```

### Backend

```bash
cd backend
bun install
bun run dev      # Hot-reload dev server on http://localhost:3000
bun run start    # Production server
bun run typecheck  # TypeScript check without emit
```

---

## Environment Variables

### Frontend (`webapp/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_URL` | Backend URL (dev only; empty in production uses relative URLs) | `http://localhost:3000` |

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `DATABASE_URL` | SQLite database path |

> In production, the webapp uses relative `/api/...` URLs and the backend auto-detects its base URL from reverse proxy headers (`X-Forwarded-Host`/`X-Forwarded-Proto`).

---

## Key Features

- **Product Catalog**: 6 categories (Puertas, Armarios, Acorazadas, Marcos y Molduras, Soluciones Fenólicas, Herrajes) with subcategories and 5,000+ references
- **MegaMenu**: Full-width dropdown with 300ms hover bridge to prevent accidental closure
- **Budget Calculator**: Interactive door price estimator with volume discounts
- **3D Wardrobe Configurator**: Three.js-powered interactive wardrobe builder
- **Parallax & Animations**: Framer Motion scroll-linked parallax throughout
- **SEO**: `react-helmet-async` with canonical URLs, Open Graph tags, and structured data
- **Responsive**: Mobile-first design, full-screen mobile menu
- **Legal Pages**: GDPR-compliant privacy policy, legal notice, and cookie policy
- **E-Commerce**: Full cart, checkout, and Stripe payments (see E-Commerce section)

---

## E-Commerce Setup

### Required Environment Variables

Add these to `backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
STRIPE_SECRET_KEY=sk_test_...        # From Stripe Dashboard → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...      # From Stripe Dashboard → Webhooks → signing secret
```

Add these to `webapp/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...   # From Stripe Dashboard → Developers → API keys
```

### Database Setup

```bash
cd backend
bun install
bunx prisma db push          # Create tables
bun run src/seed.ts          # Seed 22 sample products
```

### E-Commerce Routes

| Path | Description |
|---|---|
| `/checkout` | Multi-step checkout (contact → shipping → summary → payment) |
| `/confirmacion?orderId=xxx` | Order confirmation page |

### Order Lifecycle

```
cart (pending) → order created (pending) → PaymentIntent created (pending)
  → payment_intent.succeeded webhook → order (paid) + stock decremented
  → payment_intent.payment_failed webhook → order (failed)
```

**Status values:** `pending` → `paid` / `failed` / `cancelled` / `refunded`

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List products (`?category=`, `?subcategory=`, `?search=`) |
| GET | `/api/products/:slug` | Get single product by slug |
| GET | `/api/cart?sessionId=xxx` | Get or create cart |
| POST | `/api/cart/add` | Add item (validates stock) |
| PATCH | `/api/cart/items/:id` | Update quantity (0 = remove) |
| DELETE | `/api/cart/items/:id` | Remove item |
| DELETE | `/api/cart/:cartId` | Clear entire cart |
| POST | `/api/cart/merge` | Merge guest cart into user cart |
| POST | `/api/orders` | Create order from cart (idempotent) |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders/:id/validate-stock` | Re-check stock before payment |
| POST | `/api/payments/create-intent` | Create Stripe PaymentIntent |
| POST | `/api/payments/webhook` | Stripe webhook handler |

---

## Design System

All design tokens are defined in `webapp/src/index.css` as CSS variables and consumed via semantic Tailwind classes:

| Token | Class | Usage |
|---|---|---|
| Primary | `bg-primary` / `text-primary` | Dark brown brand color |
| Accent | `bg-accent` / `text-accent` | Bronze/gold highlight color |
| Secondary | `bg-secondary` | Light warm background |
| Muted | `text-muted-foreground` | Subdued text |
| Card | `bg-card` | Elevated surface background |

**Fonts**: Serif font for headings (brand identity), sans-serif for body text.

---

## Component Documentation

All components, hooks, and utilities include JSDoc headers. Key modules:

- **`ScrollReveal`** — Scroll-triggered reveal animations with 7 variants (fade-up, fade-left, fade-right, scale, blur, clip-up, clip-left)
- **`Counter`** — Animated number counter with locale formatting
- **`SplitText`** — Word/character text reveal with stagger animations
- **`catalog.ts`** — Central data store with helper functions for category/product lookup
- **`utils.ts`** — `cn()` Tailwind class merger using `clsx` + `tailwind-merge`
