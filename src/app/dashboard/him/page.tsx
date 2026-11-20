"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { PartnerWindowView } from "@/types/ritual";
import { fetchHimWindow } from "@/lib/services/window-service";
import { createClient } from "@/lib/supabase/client";
import { AtmosphericBackground } from "@/components/theme/atmospheric-background";
import { DashboardSkeleton } from "@/components/ui/skeleton-loader";
import { DormantViewNative } from "@/components/dormant/dormant-view-native";
import { PartnerHeroCard } from "@/components/active/partner-hero-card";
import { PartnerCareFeedNative } from "@/components/active/partner-care-feed-native";
import { Check } from "lucide-react";

export default function HimDashboardPage() {
  const supabase = createClient();
  const [windowData, setWindowData] = useState<PartnerWindowView | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadWindow = async () => {
    // Reads exclusively from `partner_window_view` security view.
    // Never queries `plausibility` or `deviation_reason`.
    const w = await fetchHimWindow(supabase);
    setWindowData(w);
    setLoading(false);
  };

  useEffect(() => {
    loadWindow();

    // 15-second polling interval
    const interval = setInterval(() => {
      loadWindow();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading) {
    return (
      <AtmosphericBackground status="dormant">
        <DashboardSkeleton />
      </AtmosphericBackground>
    );
  }

  const isActive = windowData?.status === "active";

  return (
    <AtmosphericBackground status={windowData?.status} kind={windowData?.kind}>
      <div className="flex-1 flex flex-col justify-between px-5 py-5 select-none">
        {/* Soft Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-3.5 rounded-2xl bg-[#1D1B22]/95 border border-white/[0.1] text-xs text-[#F6F3F8] shadow-2xl flex items-center gap-2.5 backdrop-blur-xl animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-relaxed">{toastMessage}</span>
          </div>
        )}

        {!isActive ? (
          /* Native Dormant View for Him */
          <DormantViewNative
            role="him"
            windowData={windowData}
            onNotice={showToast}
          />
        ) : (
          /* Active LDR Dashboard for Him */
          <div className="flex-1 flex flex-col gap-5 pb-20 animate-fade-in">
            {/* Hero Guidance Card */}
            <PartnerHeroCard
              kind={windowData?.kind || "period"}
              cycleDay={windowData?.cycle_day}
            />

            {/* Live Realtime Care Requests Feed */}
            <div className="p-1">
              <PartnerCareFeedNative
                onLockedWindow={() => {
                  showToast("پنجره در وضعیت استراحت قرار گرفت.");
                  loadWindow();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AtmosphericBackground>
  );
}
