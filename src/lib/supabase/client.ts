import { createBrowserClient } from "@supabase/ssr";

/**
 * Checks whether Supabase environment variables are properly defined and valid.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return Boolean(
    url &&
    key &&
    url.length > 0 &&
    key.length > 0 &&
    !url.includes("your-project") &&
    (url.startsWith("https://") || url.startsWith("http://"))
  );
}

// Safe fallback URL and key to prevent createBrowserClient from throwing during SSR or missing env
const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const isConfigured = isSupabaseConfigured();
  const url = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL!.trim() : FALLBACK_URL;
  const key = isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim() : FALLBACK_KEY;

  if (typeof window !== "undefined" && browserClientInstance) {
    return browserClientInstance;
  }

  const client = createBrowserClient(url, key);

  if (typeof window !== "undefined") {
    browserClientInstance = client;
  }

  return client;
}
