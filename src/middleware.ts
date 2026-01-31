import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Permitimos siempre el login del admin (la página muestra <SignIn />).
  if (isAdminLoginRoute(req)) return;

  // Protegemos todo /admin (y subrutas).
  if (isAdminRoute(req)) {
    const unauthenticatedUrl = new URL("/admin/login", req.url).toString();
    await auth.protect({
      unauthenticatedUrl,
    });
  }
});

export const config = {
  // Recomendación Clerk: correr en todas las rutas (excepto assets) para que
  // la autenticación funcione correctamente con App Router.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

