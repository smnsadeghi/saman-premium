import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveUserRole, getDashboardPathForRole } from "@/lib/auth-guard";

export const runtime = "edge";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const role = resolveUserRole(user.email);
  if (!role) {
    redirect("/login?error=unauthorized");
  }

  redirect(getDashboardPathForRole(role));
}
