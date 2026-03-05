import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  once?: boolean;
  amount?: "some" | "all";
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.2, once = true, amount = "some" } = options;
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once,
    amount: amount === "some" ? threshold : 1,
  });

  return { ref, isInView };
}
