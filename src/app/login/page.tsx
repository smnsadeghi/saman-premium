"use client";

export const runtime = "edge";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, KeyRound, Sparkles, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isEmailAllowed, resolveUserRole, getDashboardPathForRole } from "@/lib/auth-guard";
import { SupabaseConfigMissing } from "@/components/ui/supabase-config-missing";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If Supabase is not configured in production, show the guided instructions
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigMissing />;
  }

  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setErrorMessage("دسترسی غیرمجاز: این ایمیل در لیست دسترسی خصوصی سامانه تعریف نشده است.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Client-side Closed Auth Guard (Strict Whitelist Check)
    if (!isEmailAllowed(cleanEmail)) {
      setErrorMessage(
        "دسترسی مسدود است: این اپلیکیشن خصوصی است و فقط ایمیل‌های مجاز تعریف‌شده اجازه ورود یا ثبت‌نام دارند."
      );
      return;
    }

    const assignedRole = resolveUserRole(cleanEmail);
    if (!assignedRole) {
      setErrorMessage("خطا در تطبیق نقش کاربری. لطفاً با مدیر سیستم تماس بگیرید.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrorMessage("ایمیل یا رمز عبور اشتباه است.");
          } else {
            setErrorMessage(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          router.push(getDashboardPathForRole(assignedRole));
          router.refresh();
        }
      } else {
        // Sign Up (First time account activation for the whitelisted user)
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              role: assignedRole,
              name: name.trim() || (assignedRole === "her" ? "بانو" : "آقا"),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // Direct login without email confirm required
          router.push(getDashboardPathForRole(assignedRole));
          router.refresh();
        } else {
          setSuccessMessage(
            "حساب کاربری با موفقیت ایجاد شد! در صورت نیاز ایمیل فعال‌سازی را بررسی کرده و سپس وارد شوید."
          );
          setMode("signin");
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "خطای غیرمنتظره‌ای رخ داد.";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 safe-top safe-bottom">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-luxury-card border border-luxury-border shadow-lg shadow-luxury-rosegold/5 mb-4 relative">
          <Sparkles className="w-8 h-8 text-luxury-rosegold" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-rosegold rounded-full blur-[2px]" />
        </div>
        <h1 className="text-2xl font-light tracking-wide text-luxury-champagne-light">
          Saman <span className="font-semibold text-luxury-rosegold">Premium</span>
        </h1>
        <p className="text-xs text-luxury-textMuted mt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-luxury-rosegold-dark" />
          فضای خصوصی و حفاظت‌شده دونفره
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="bg-luxury-card border border-luxury-border rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-rosegold-glow rounded-full blur-3xl pointer-events-none" />

        {/* Mode Switcher */}
        <div className="flex bg-luxury-bg/80 p-1 rounded-xl mb-6 border border-luxury-border/60">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              mode === "signin"
                ? "bg-luxury-card text-luxury-rosegold shadow border border-luxury-borderLight"
                : "text-luxury-textMuted hover:text-luxury-text"
            }`}
          >
            ورود به حساب
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              mode === "signup"
                ? "bg-luxury-card text-luxury-rosegold shadow border border-luxury-borderLight"
                : "text-luxury-textMuted hover:text-luxury-text"
            }`}
          >
            فعال‌سازی اولیه
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-luxury-textMuted mb-1.5 mr-1">
                نام یا لقب
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: سامان"
                  className="w-full bg-luxury-bg border border-luxury-border rounded-xl px-4 py-2.5 text-sm text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold focus:ring-1 focus:ring-luxury-rosegold transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-luxury-textMuted mb-1.5 mr-1">
              ایمیل مجاز
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                dir="ltr"
                className="w-full bg-luxury-bg border border-luxury-border rounded-xl px-10 py-2.5 text-sm text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold focus:ring-1 focus:ring-luxury-rosegold transition-all"
              />
              <Mail className="w-4 h-4 text-luxury-textMuted absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-luxury-textMuted mb-1.5 mr-1">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-luxury-bg border border-luxury-border rounded-xl px-10 py-2.5 text-sm text-luxury-text placeholder-luxury-textMuted/50 focus:outline-none focus:border-luxury-rosegold focus:ring-1 focus:ring-luxury-rosegold transition-all"
              />
              <KeyRound className="w-4 h-4 text-luxury-textMuted absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-luxury-bg bg-gradient-to-r from-luxury-rosegold-light via-luxury-rosegold to-luxury-rosegold-dark hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-luxury-rosegold/10 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-luxury-bg border-t-transparent rounded-full animate-spin" />
            ) : mode === "signin" ? (
              <>
                <span>ورود به سامانه</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>فعال‌سازی و ایجاد حساب</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-luxury-border/60 text-center">
          <p className="text-[11px] text-luxury-textMuted/70 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-luxury-rosegold/60" />
            سیستم احراز هویت کاملاً اختصاصی (Closed Whitelist)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-luxury-rosegold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

