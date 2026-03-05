import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center px-4">
          <p className="text-accent font-medium tracking-wider uppercase text-sm mb-4">
            Error 404
          </p>
          <h1 className="font-serif text-display-sm md:text-display text-foreground mb-4">
            Página no encontrada
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Lo sentimos, la página que busca no existe o ha sido movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/catalogo">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ver catálogo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
