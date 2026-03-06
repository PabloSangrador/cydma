/**
 * @module Layout
 * @description Root page layout wrapper for the CYDMA webapp. Composes the
 * shared Header, Footer, scroll-progress bar, back-to-top button, and a
 * page-transition fade animation around every routed page's content.
 */

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ScrollProgressBar } from "@/components/ui/scroll-progress";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { FadeInOnMount } from "@/components/ui/page-transition";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

/**
 * Props for the Layout component.
 */
interface LayoutProps {
  /** The routed page content to render inside the main content area. */
  children: ReactNode;
}

/**
 * Full-page layout shell used by every CYDMA page route.
 * Wraps children with the shared Header and Footer, adds a scroll-progress
 * indicator at the top, a back-to-top floating button, and applies a
 * FadeInOnMount transition to the page content on navigation.
 * @param {LayoutProps} props
 * @param {ReactNode} props.children - The current page's content node.
 * @returns {JSX.Element} The complete page scaffold with header, main, and footer.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      <Header />

      <main className="flex-1">
        <FadeInOnMount>
          {children}
        </FadeInOnMount>
      </main>

      <Footer />

      {/* Floating buttons */}
      <BackToTopButton />
      <WhatsAppButton />
    </div>
  );
}
