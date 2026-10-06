import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

/**
 * Pages, relative to where the app is served: the site root normally, and a sub-path for
 * the demo build (see build:demo), so links go through these rather than naming "/..."
 * directly.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

export type Route =
  | { page: "stocks" }
  | { page: "new" }
  | { page: "edit"; id: string }
  | { page: "not-found" };

/** The address of an app page: "/stocks/new" becomes "/demos/nottingham/stocks/new". */
export function pageUrl(path: string): string {
  return BASE + path;
}

function currentPath(): string {
  const path = window.location.pathname;
  const inApp = path.startsWith(BASE) ? path.slice(BASE.length) : path;
  return inApp.replace(/\/+$/, "") || "/";
}

export function parseRoute(path: string): Route {
  if (path === "/" || path === "/stocks") return { page: "stocks" };
  if (path === "/stocks/new") return { page: "new" };
  const edit = path.match(/^\/stocks\/([^/]+)\/edit$/);
  if (edit) return { page: "edit", id: decodeURIComponent(edit[1]) };
  return { page: "not-found" };
}

const listeners = new Set<() => void>();
window.addEventListener("popstate", () => listeners.forEach((listener) => listener()));

/** Goes to an app page without reloading. */
export function navigate(path: string): void {
  window.history.pushState(null, "", pageUrl(path));
  listeners.forEach((listener) => listener());
  window.scrollTo(0, 0);
}

/** The current page's path, re-rendering on navigation. */
export function usePath(): string {
  return useSyncExternalStore((onChange) => {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  }, currentPath);
}

/** A link to an app page that navigates in place; a modified click (new tab) is the browser's. */
export function Link({
  to,
  ...props
}: { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }
  return <a {...props} href={pageUrl(to)} onClick={onClick} />;
}
