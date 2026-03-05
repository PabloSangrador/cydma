/**
 * @module utils
 * @description General utility functions for the CYDMA webapp.
 * Currently provides the `cn` helper for merging Tailwind CSS class names.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts using tailwind-merge.
 * Accepts any combination of strings, arrays, and conditional objects supported
 * by `clsx`, then passes the result through `twMerge` so that conflicting
 * Tailwind utilities (e.g. `p-2` vs `p-4`) are correctly deduplicated.
 *
 * @param {...ClassValue} inputs - One or more class name values: strings,
 *   arrays, or objects mapping class names to boolean conditions.
 * @returns {string} A single merged, conflict-resolved class string ready for
 *   use in a `className` prop.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-amber-600", "hover:opacity-90")
 * // => "px-4 py-2 bg-amber-600 hover:opacity-90"  (when isActive is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
