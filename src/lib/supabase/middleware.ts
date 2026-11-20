import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isEmailAllowed, resolveUserRole } from "@/lib/auth-guard";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Guard against missing or placeholder Supabase credentials in Edge runtime
  if (!isSupabaseConfigured()) {
    return { supabaseResponse, user: null, role: null };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          try {
            return request.cookies.getAll();
          } catch {
            return [];
          }
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          } catch {
            // Ignore cookie setting errors in Edge middleware
          }
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Session invalid or expired - treat gracefully as unauthenticated
      return { supabaseResponse, user: null, role: null };
    }

    let role: "her" | "him" | null = null;
    if (user?.email && isEmailAllowed(user.email)) {
      role = resolveUserRole(user.email);
    }

    return { supabaseResponse, user, role };
  } catch (err) {
    console.error("updateSession error in Edge middleware:", err);
    // Never crash the middleware with 500, return safe default
    return { supabaseResponse, user: null, role: null };
  }
}
