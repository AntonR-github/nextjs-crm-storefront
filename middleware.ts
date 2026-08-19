import { NextResponse, type NextRequest } from "next/server";

// The ported CSS scopes a large amount of styling under page-specific
// <body> classes from the original static site (e.g. .product-template has
// 279 rules). App Router's <body> only exists once, in the root layout,
// which can't know the current route on its own — so this middleware tags
// each request with the right class via a forwarded request header, and the
// root layout reads it server-side (SSR-correct, no flash-of-wrong-styling).
//
// Runs on every route (not just the ones that need a class) specifically to
// strip any client-supplied x-body-class header first — otherwise a request
// to a route this middleware never touched would let an attacker inject an
// arbitrary class (or worse) straight into <body className>.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let bodyClass = "";
  if (pathname === "/compare") bodyClass = "compare-page compare-page--refined";
  else if (pathname === "/shop") bodyClass = "shop-page";
  else if (pathname.startsWith("/shop/")) bodyClass = "product-template";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-body-class");
  if (bodyClass) requestHeaders.set("x-body-class", bodyClass);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
