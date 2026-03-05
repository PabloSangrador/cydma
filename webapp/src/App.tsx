import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTopOnNavigate } from "@/components/ui/scroll-to-top";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

// Pages
import Index from "./pages/Index";
import QuienesSomos from "./pages/QuienesSomos";
import Catalogo from "./pages/Catalogo";
import CatalogoCategoria from "./pages/CatalogoCategoria";
import ProductoDetalle from "./pages/ProductoDetalle";
import Almacen from "./pages/Almacen";
import Contract from "./pages/Contract";
import Export from "./pages/Export";
import Contacto from "./pages/Contacto";
import ArmariosMedida from "./pages/ArmariosMedida";
import PuertasMedida from "./pages/PuertasMedida";
import Proyectos from "./pages/Proyectos";
import Calculadora from "./pages/Calculadora";
import Garantia from "./pages/Garantia";
import Configurador from "./pages/Configurador";
import Privacidad from "./pages/Privacidad";
import AvisoLegal from "./pages/AvisoLegal";
import Cookies from "./pages/Cookies";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Loading Screen */}
        <LoadingScreen />

        <BrowserRouter>
          {/* Auto scroll to top on navigation */}
          <ScrollToTopOnNavigate />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:categoria" element={<CatalogoCategoria />} />
            <Route path="/catalogo/:categoria/:subcategoria" element={<CatalogoCategoria />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/almacen" element={<Almacen />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/export" element={<Export />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/armarios-medida" element={<ArmariosMedida />} />
            <Route path="/puertas-medida" element={<PuertasMedida />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/garantia" element={<Garantia />} />
            <Route path="/configurador" element={<Configurador />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/legal" element={<AvisoLegal />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartDrawer />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
