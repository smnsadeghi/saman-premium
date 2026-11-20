import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { resolveUserRole } from "@/lib/auth-guard";
import { DashboardNav } from "@/components/dashboard-nav";

export const runtime = "edge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

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

  // Fetch profile if exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  const userName = profile?.name || user.user_metadata?.name || (role === "her" ? "بانو" : "آقا");

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <DashboardNav
        role={role}
        userEmail={user.email}
        userName={userName}
      />
      <main className="flex-1 px-5 py-6 flex flex-col">{children}</main>
    </div>
  );
}
