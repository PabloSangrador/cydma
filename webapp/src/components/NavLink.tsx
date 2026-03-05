/**
 * @module NavLink
 * @description A thin wrapper around React Router's `NavLink` component that
 * simplifies active and pending state styling. Instead of accepting a function
 * for `className`, this component accepts plain string props (`activeClassName`
 * and `pendingClassName`) which are merged with `cn` when the link is active
 * or pending respectively. This makes it straightforward to apply Tailwind
 * utility classes in the CYDMA navigation without inline functions.
 */

import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the {@link NavLink} component.
 * Extends React Router's `NavLinkProps`, replacing the function-form `className`
 * with separate plain-string active/pending class props.
 * @interface NavLinkCompatProps
 */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  /** Base Tailwind/CSS class names always applied to the anchor element. */
  className?: string;
  /** Additional class names merged in when the link's route is active. */
  activeClassName?: string;
  /** Additional class names merged in while the link's route is loading/pending. */
  pendingClassName?: string;
}

/**
 * A forward-ref navigation link component that supports plain-string active and
 * pending class props, powered by React Router's `NavLink` under the hood.
 *
 * @description Use this component in the CYDMA site navigation bar and mobile
 * menu instead of `<Link>` whenever you need to visually indicate the current page.
 *
 * @param {NavLinkCompatProps} props - Component configuration.
 * @param {React.Ref<HTMLAnchorElement>} ref - Forwarded ref attached to the anchor element.
 * @returns {JSX.Element} An anchor element managed by React Router.
 *
 * @example
 * <NavLink
 *   to="/catalogo"
 *   className="text-sm font-medium text-gray-600"
 *   activeClassName="text-amber-600 border-b-2 border-amber-600"
 * >
 *   Catálogo
 * </NavLink>
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
