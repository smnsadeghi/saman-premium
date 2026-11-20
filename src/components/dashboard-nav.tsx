"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  CalendarHeart,
  HeartHandshake,
  BookOpenText,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { tapLight } from "@/lib/haptics";

interface DashboardNavProps {
  role: "her" | "him";
  userEmail: string;
  userName: string;
}

export function DashboardNav({ role, userEmail, userName }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    tapLight();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const basePath = `/dashboard/${role}`;

  const navItems = [
    {
      label: "پنجره",
      href: basePath,
      icon: Home,
      exact: true,
    },
    {
      label: "تقویم",
      href: `${basePath}/cycle`,
      icon: CalendarHeart,
      exact: false,
    },
    {
      label: "مراقبت",
      href: `${basePath}/care`,
      icon: HeartHandshake,
      exact: false,
    },
    {
      label: "نامه‌ها",
      href: `${basePath}/logs`,
      icon: BookOpenText,
      exact: false,
    },
    {
      label: "تنظیمات",
      href: `${basePath}/settings`,
      icon: Settings,
      exact: false,
    },
  ];

  const isHer = role === "her";

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl border-b border-white/[0.05] pt-[max(env(safe-area-inset-top,0px),12px)] px-5 pb-3 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-sm ${
                isHer
                  ? "bg-[#C85A53]/15 border-[#C85A53]/30 text-[#E68A84]"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-300"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-[#F6F3F8]">
                  سامان پرمیوم
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                    isHer
                      ? "bg-[#C85A53]/15 text-[#E68A84] border-[#C85A53]/30"
                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {isHer ? "فضای بانو" : "فضای آقا"}
                </span>
              </div>
              <p className="text-[10px] text-[#A59CB0]">
                {userName || (isHer ? "بانو" : "آقا")} ({userEmail})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="خروج از حساب"
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A59CB0] hover:text-red-400 active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Bottom Floating Nav Bar (iOS/Android Native Shell) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-[max(calc(env(safe-area-inset-bottom,0px)+12px),20px)] pt-2 pointer-events-none select-none">
        <div className="pointer-events-auto bg-[#18171C]/95 backdrop-blur-2xl border border-white/[0.08] rounded-full px-4 py-2 shadow-2xl flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => tapLight()}
                className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-all active:scale-95 ${
                  isActive
                    ? isHer
                      ? "text-[#E68A84] font-medium"
                      : "text-amber-300 font-medium"
                    : "text-[#A59CB0] hover:text-[#F6F3F8]"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? "scale-110" : ""}`} />
                <span className="text-[9px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span
                    className={`absolute -bottom-1 w-3 h-0.5 rounded-full ${
                      isHer ? "bg-[#C85A53]" : "bg-amber-400"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
