"use client";

import React, { useState, useRef, useEffect } from "react";
import { AlertOctagon, Check } from "lucide-react";
import { sosPulse, tapLight } from "@/lib/haptics";
import { sendCareRequest } from "@/lib/services/care-service";
import { createClient } from "@/lib/supabase/client";

interface SosHoldButtonProps {
  onSent: () => void;
  onLockedWindow?: () => void;
}

export function SosHoldButton({ onSent, onLockedWindow }: SosHoldButtonProps) {
  const supabase = createClient();
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_DURATION = 1200; // 1.2 seconds

  const startHold = () => {
    if (loading || isSuccess) return;
    tapLight();
    setIsHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.floor((elapsed / HOLD_DURATION) * 100));
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerSos();
      }
    }, 20);
  };

  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isSuccess) {
      setIsHolding(false);
      setProgress(0);
    }
  };

  const triggerSos = async () => {
    sosPulse();
    setLoading(true);
    setIsHolding(false);

    const { isWindowLocked, error } = await sendCareRequest(
      supabase,
      "sos",
      "نیاز فوری به حمایت (ارسال شده با دکمه اضطراری)"
    );
    setLoading(false);

    if (isWindowLocked) {
      if (onLockedWindow) onLockedWindow();
      return;
    }

    if (!error) {
      setIsSuccess(true);
      onSent();
      setTimeout(() => {
        setIsSuccess(false);
        setProgress(0);
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // SVG circular ring properties
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className={`relative w-full p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
          isSuccess
            ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
            : isHolding
            ? "bg-red-950/60 border-red-600 shadow-xl shadow-red-950/50 scale-[0.99]"
            : "bg-[#18171C]/90 backdrop-blur-xl border-red-900/30 hover:border-red-700/50"
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* Circular progress with icon inside */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-red-950/60"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-red-500 transition-all duration-75"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div
              className={`absolute inset-0 flex items-center justify-center ${
                isSuccess
                  ? "text-emerald-400"
                  : isHolding
                  ? "text-red-400 animate-pulse"
                  : "text-red-400"
              }`}
            >
              {isSuccess ? <Check className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#F6F3F8] block">
              {isSuccess
                ? "درخواست فوری SOS ارسال شد 🤍"
                : "دکمه امن SOS (نیاز فوری به همراهی)"}
            </span>
            <span className="text-[10px] text-[#A59CB0] block mt-0.5">
              {isHolding
                ? "انگشت را نگه دارید تا ارسال شود..."
                : "نگه داشتن به مدت ۱.۲ ثانیه برای جلوگیری از لمس اتفاقی"}
            </span>
          </div>
        </div>

        <div className="text-left text-xs text-red-400 font-medium px-2 shrink-0">
          {isHolding ? `${progress}%` : "SOS"}
        </div>
      </div>
    </div>
  );
}
