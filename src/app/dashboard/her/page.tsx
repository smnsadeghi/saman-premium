"use client";

export const runtime = "edge";

import React, { useState, useEffect } from "react";
import { AppWindow, WindowKind } from "@/types/ritual";
import { fetchHerWindow } from "@/lib/services/window-service";
import { createClient } from "@/lib/supabase/client";
import { AtmosphericBackground } from "@/components/theme/atmospheric-background";
import { DashboardSkeleton } from "@/components/ui/skeleton-loader";
import { DormantViewNative } from "@/components/dormant/dormant-view-native";
import { HerActiveHeader } from "@/components/active/her-active-header";
import { CareGridNative } from "@/components/active/care-grid-native";
import { SosHoldButton } from "@/components/active/sos-hold-button";
import { OpenWindowSheet } from "@/components/ritual/open-window-sheet";
import { RitualTransitionOverlay } from "@/components/ritual/ritual-transition-overlay";
import { Check, AlertCircle } from "lucide-react";
import { tapLight } from "@/lib/haptics";

export default function HerDashboardPage() {
  const supabase = createClient();
  const [windowData, setWindowData] = useState<AppWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSheet, setOpenSheet] = useState(false);
  const [transitionOverlay, setTransitionOverlay] = useState(false);
  const [transitionKind, setTransitionKind] = useState<WindowKind>("period");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadWindow = async () => {
    const w = await fetchHerWindow(supabase);
    setWindowData(w);
    setLoading(false);
  };

  useEffect(() => {
    loadWindow();
  }, []);

  const handleOpenWindowSuccess = (kind: WindowKind) => {
    setTransitionKind(kind);
    setTransitionOverlay(true);
    loadWindow();
  };

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
          /* Native Dormant View */
          <DormantViewNative
            role="her"
            windowData={windowData}
            onOpenWindowClick={() => {
              tapLight();
              setOpenSheet(true);
            }}
            onNotice={showToast}
          />
        ) : (
          /* Active LDR Dashboard */
          <div className="flex-1 flex flex-col gap-5 pb-20 animate-fade-in">
            {/* Status Header */}
            <HerActiveHeader
              windowData={windowData}
              onRefresh={loadWindow}
              onNotice={showToast}
            />

            {/* 2x3 Care Request Grid */}
            <div className="p-1">
              <CareGridNative
                onSent={() => showToast("درخواست مراقبت با موفقیت برای او فرستاده شد 🤍")}
                onLockedWindow={() => {
                  showToast("پنجره در وضعیت استراحت قرار گرفت.");
                  loadWindow();
                }}
              />
            </div>

            {/* Secure Hold-to-Send SOS Button */}
            <div className="mt-1">
              <SosHoldButton
                onSent={() => showToast("درخواست اضطراری SOS با موفقیت ارسال شد 🆘")}
                onLockedWindow={() => loadWindow()}
              />
            </div>
          </div>
        )}

        {/* Native Open Window Bottom Sheet */}
        <OpenWindowSheet
          isOpen={openSheet}
          onClose={() => setOpenSheet(false)}
          onSuccess={handleOpenWindowSuccess}
        />

        {/* Ritual Transition Full-screen Bloom */}
        <RitualTransitionOverlay
          isOpen={transitionOverlay}
          role="her"
          kind={transitionKind}
          onDismiss={() => setTransitionOverlay(false)}
        />
      </div>
    </AtmosphericBackground>
  );
}
