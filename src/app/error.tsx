"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console for debugging
    console.error("App Error Boundary caught:", error);
  }, [error]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const text = `Error: ${error.message}\nDigest: ${error.digest || "none"}\nStack: ${error.stack || "none"}`;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const isSupabaseRelated =
    error.message?.toLowerCase().includes("supabase") ||
    error.message?.toLowerCase().includes("url") ||
    error.message?.toLowerCase().includes("fetch");

  return (
    <div className="min-h-screen bg-[#0F0E11] text-[#EDE8E1] flex items-center justify-center p-4 dir-rtl select-none">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#C85A53]/15 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-md bg-[#18171C]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#C85A53]/15 border border-[#C85A53]/30 flex items-center justify-center text-[#C85A53] shadow-lg shadow-[#C85A53]/10">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            خطای غیرمنتظره در برنامه
          </h1>
          <p className="text-xs text-[#9B948A] leading-relaxed max-w-xs">
            متأسفانه هنگام اجرای برنامه مشکلی رخ داد. می‌توانید با زدن دکمه زیر مجدداً تلاش کنید.
          </p>
        </div>

        {/* Supabase Hint if applicable */}
        {isSupabaseRelated && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300">نکته راهنما: </span>
            به نظر می‌رسد این خطا ناشی از تنظیم نبودن متغیرهای اتصال به Supabase در تنظیمات محیطی کلودفلر باشد.
          </div>
        )}

        {/* Technical Error Details Accordion */}
        <div className="bg-black/50 border border-white/[0.06] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3.5 text-xs text-[#9B948A] hover:text-[#EDE8E1] transition-colors"
          >
            <span className="font-medium">مشاهده جزئیات فنی خطا</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="p-3.5 pt-0 space-y-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#7A746C] font-mono">
                  {error.digest ? `Digest: ${error.digest}` : "Client-side Exception"}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] text-luxury-rosegold hover:underline"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "کپی شد" : "کپی متن خطا"}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[#E0A8A4] bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04] overflow-x-auto whitespace-pre-wrap break-all max-h-36 dir-ltr text-left">
                {error.message || "Unknown error occurred"}
              </pre>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C85A53] to-[#A8443E] hover:from-[#B84E47] hover:to-[#963C36] active:scale-[0.98] text-white font-medium text-xs shadow-lg shadow-[#C85A53]/25 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تلاش مجدد (Retry)</span>
          </button>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] active:scale-[0.98] text-[#EDE8E1] font-medium text-xs transition-all duration-200"
          >
            <Home className="w-4 h-4 text-[#9B948A]" />
            <span>بازگشت به صفحه اصلی</span>
          </button>
        </div>
      </div>
    </div>
  );
}
