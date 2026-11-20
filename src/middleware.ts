import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isEmailAllowed, resolveUserRole, getDashboardPathForRole } from "@/lib/auth-guard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user } = await updateSession(request);

  const isAuthRoute = pathname.startsWith("/login");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isRootRoute = pathname === "/";

  // Case 1: Unauthenticated user trying to access protected dashboard routes
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Case 2: User is logged in
  if (user && user.email) {
    const allowed = isEmailAllowed(user.email);

    // Closed System Gate: If email is NOT whitelisted, block immediately
    if (!allowed) {
      if (!isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    const role = resolveUserRole(user.email);
    const targetDashboard = role ? getDashboardPathForRole(role) : "/login";

    // If visiting root "/" or "/login", redirect to user's assigned dashboard
    if (isRootRoute || isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = targetDashboard;
      return NextResponse.redirect(url);
    }

    // Role-based routing: if on generic "/dashboard", route to role dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const url = request.nextUrl.clone();
      url.pathname = targetDashboard;
      return NextResponse.redirect(url);
    }

    // Strict role partition: keep 'her' in her dashboard and 'him' in his dashboard
    if (role === "her" && pathname.startsWith("/dashboard/him")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/her";
      return NextResponse.redirect(url);
    }

    if (role === "him" && pathname.startsWith("/dashboard/her")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/him";
      return NextResponse.redirect(url);
    }
  }

  // If root "/" and not logged in, redirect to login
  if (isRootRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json / web manifest
     * - icons / public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
