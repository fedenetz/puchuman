import { CABINS } from "./data.js";

export const STATIC_ROUTES = [
  { path: "/", kind: "home" },
  { path: "/cabanas/", kind: "cabins" },
  ...CABINS.map((cabin) => ({
    path: cabin.futureDetailUrl,
    kind: "cabin",
    cabin,
  })),
  { path: "/politicas-de-reserva/", kind: "policies" },
  { path: "/contacto/", kind: "contact" },
  { path: "/privacidad/", kind: "privacy" },
];

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const withoutFile = pathname.endsWith("/index.html")
    ? pathname.slice(0, -"index.html".length)
    : pathname;
  return withoutFile.endsWith("/") ? withoutFile : `${withoutFile}/`;
}

export function resolveRoute(pathname) {
  const normalized = normalizePath(pathname);
  return (
    STATIC_ROUTES.find(({ path }) => path === normalized) ?? {
      path: normalized,
      kind: "not-found",
    }
  );
}
