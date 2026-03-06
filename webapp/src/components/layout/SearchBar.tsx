import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { categories } from "@/data/catalog";

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  code: string;
  categoryId: string;
  images: string[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getCategoryName(categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "";
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const shouldSearch = debouncedQuery.trim().length > 2;

  const { data: results = [], isFetching } = useQuery<SearchProduct[]>({
    queryKey: ["product-search", debouncedQuery],
    queryFn: () =>
      api.get<SearchProduct[]>(
        `/api/products?search=${encodeURIComponent(debouncedQuery.trim())}`
      ),
    enabled: shouldSearch,
    staleTime: 30_000,
  });

  // Focus input when overlay opens; reset query when it closes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Escape key closes overlay
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    navigate(`/producto/${slug}`);
  };

  const showResults = shouldSearch;
  const isEmpty = showResults && !isFetching && results.length === 0;
  const limited = results.slice(0, 8);

  return (
    <>
      {/* Search trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Buscar productos"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Search panel */}
            <motion.div
              ref={containerRef}
              className="fixed left-1/2 top-16 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", damping: 28, stiffness: 380 }}
            >
              {/* Input box */}
              <div className="relative bg-card rounded-xl shadow-2xl border border-border">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos, referencias…"
                  className="w-full pl-12 pr-14 py-4 text-base bg-transparent outline-none placeholder:text-muted-foreground/60"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isFetching && (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                  )}
                  {query ? (
                    <button
                      onClick={() => setQuery("")}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="Cerrar buscador"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    className="mt-2 bg-card rounded-xl shadow-2xl border border-border overflow-hidden max-h-[60vh] overflow-y-auto"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isEmpty ? (
                      <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                        Sin resultados para &ldquo;{debouncedQuery}&rdquo;
                      </p>
                    ) : (
                      <ul>
                        {limited.map((product, idx) => (
                          <li key={product.id}>
                            {idx > 0 && (
                              <div className="mx-4 border-t border-border/40" />
                            )}
                            <button
                              onClick={() => handleResultClick(product.slug)}
                              className="group w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                            >
                              {/* Thumbnail */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary/40 flex-shrink-0">
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Search className="h-4 w-4 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {product.code}
                                  {getCategoryName(product.categoryId)
                                    ? ` · ${getCategoryName(product.categoryId)}`
                                    : ""}
                                </p>
                              </div>

                              {/* Arrow */}
                              <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Results count footer */}
                    {!isEmpty && results.length > 8 && (
                      <div className="px-5 py-3 border-t border-border/40 bg-secondary/20">
                        <p className="text-xs text-muted-foreground text-center">
                          Mostrando 8 de {results.length} resultados — refina tu búsqueda
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint */}
              {!showResults && (
                <p className="text-center text-xs text-white/50 mt-3 select-none">
                  Escribe al menos 3 caracteres · <kbd className="font-mono bg-white/10 rounded px-1">Esc</kbd> para cerrar
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
