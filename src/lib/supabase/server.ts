import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";

const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

export function createClient() {
  const isConfigured = isSupabaseConfigured();
  const url = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL!.trim() : FALLBACK_URL;
  const key = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim() : FALLBACK_KEY;

  let cookieStore: ReturnType<typeof cookies>;
  try {
    cookieStore = cookies();
  } catch {
    cookieStore = {
      getAll: () => [],
      set: () => {},
    } as unknown as ReturnType<typeof cookies>;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        try {
          return cookieStore.getAll();
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
