import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "fsw_admin";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Permitir siempre el login
  if (pathname === "/admin/login") return NextResponse.next();

  const isAuthed = req.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";
  if (isAuthed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
