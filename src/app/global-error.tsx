"use client";

import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#0F0E11] text-[#EDE8E1] min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#18171C] border border-white/[0.08] rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C85A53]/15 text-[#C85A53] flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">خطای سیستمی در بارگذاری اولیه</h2>
          <p className="text-xs text-[#9B948A] leading-relaxed">
            {error.message || "یک خطای پیش‌بینی‌نشده در اجرای پوسته برنامه رخ داد."}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C85A53] to-[#A8443E] text-white font-medium text-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>بارگذاری مجدد</span>
          </button>
        </div>
      </body>
    </html>
  );
}
