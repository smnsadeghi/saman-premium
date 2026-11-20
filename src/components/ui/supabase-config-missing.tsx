"use client";

import React from "react";
import { AlertTriangle, Database, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";

export function SupabaseConfigMissing() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E11] text-[#EDE8E1] flex items-center justify-center p-4 dir-rtl">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md bg-[#18171C]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>پیکربندی دیتابیس انجام نشده است</span>
          </h1>
          <p className="text-xs text-[#9B948A] leading-relaxed max-w-xs">
            متغیرهای اتصال به Supabase در تنظیمات محیطی کلودفلر (Environment Variables) یافت نشدند.
          </p>
        </div>

        {/* Required Variables List */}
        <div className="space-y-3 bg-black/40 border border-white/[0.05] rounded-2xl p-4 text-xs">
          <p className="font-medium text-amber-300/90 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            متغیرهای ضروری زیر باید در Cloudflare Pages اضافه شوند:
          </p>
          <ul className="space-y-2 text-[#C4BDB3] font-mono text-[11px] dir-ltr text-left">
            <li className="bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              <span className="text-amber-400/80 font-sans text-[10px]">الزامی</span>
            </li>
            <li className="bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className="text-amber-400/80 font-sans text-[10px]">الزامی</span>
            </li>
            <li className="bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
              <span>ALLOWED_EMAIL_HER</span>
              <span className="text-[#888] font-sans text-[10px]">اختیاری</span>
            </li>
            <li className="bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
              <span>ALLOWED_EMAIL_HIM</span>
              <span className="text-[#888] font-sans text-[10px]">اختیاری</span>
            </li>
          </ul>
        </div>

        {/* Steps to solve */}
        <div className="space-y-2 text-[11px] text-[#9B948A] leading-5 pr-2">
          <p className="font-semibold text-[#EDE8E1]">راهنمای رفع مشکل در Cloudflare Pages:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>به داشبورد Cloudflare بروید و پروژه را باز کنید.</li>
            <li>وارد مسیر <strong className="text-white">Settings &gt; Environment variables</strong> شوید.</li>
            <li>متغیرهای بالا را اضافه کرده و پروژه را مجدداً <strong className="text-white">Deploy</strong> نمایید.</li>
          </ol>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-white font-medium text-xs shadow-lg shadow-amber-600/20 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>بررسی مجدد اتصال (Reload)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
