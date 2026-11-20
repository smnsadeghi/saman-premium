"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AppWindow, PartnerWindowView, CycleRecord, TimeCapsule } from "@/types/ritual";
import { fetchCycles } from "@/lib/services/cycle-service";
import { fetchTimeCapsules } from "@/lib/services/capsule-service";
import { createClient } from "@/lib/supabase/client";
import { BreathingOrb } from "@/components/dormant/breathing-orb";
import { TimeCapsuleCard } from "@/components/dormant/time-capsule-card";
import { CyclesDrawer } from "@/components/dormant/cycles-drawer";
import { WriteCapsuleSheet } from "@/components/dormant/write-capsule-sheet";
import { tapLight } from "@/lib/haptics";

interface DormantViewNativeProps {
  role: "her" | "him";
  windowData: AppWindow | PartnerWindowView | null;
  onOpenWindowClick?: () => void;
  onNotice?: (msg: string) => void;
}

export function DormantViewNative({
  role,
  windowData,
  onOpenWindowClick,
  onNotice,
}: DormantViewNativeProps) {
  const supabase = createClient();
  const [cycles, setCycles] = useState<CycleRecord[]>([]);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [writeCapsuleOpen, setWriteCapsuleOpen] = useState(false);

  const isHer = role === "her";

  const loadData = async () => {
    const [cData, capData] = await Promise.all([
      fetchCycles(supabase),
      fetchTimeCapsules(supabase),
    ]);
    setCycles(cData);
    setCapsules(capData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-5 select-none pb-20 animate-fade-in">
      {/* 1. Breathing Centerpiece Orb */}
      <BreathingOrb status={windowData?.status} summary={windowData?.summary} />

      {/* Floating Ritual Open Button (Her only) */}
      {isHer && onOpenWindowClick && (
        <div className="px-1">
          <button
            type="button"
            onClick={() => {
              tapLight();
              onOpenWindowClick();
            }}
            className="w-full py-3.5 px-6 rounded-3xl text-xs font-semibold text-white bg-gradient-to-r from-[#C85A53] via-[#BA4F48] to-[#A8443E] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C85A53]/20"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>گشودن پنجره آیینی (پریود یا حمایت عاطفی)</span>
          </button>
        </div>
      )}

      {/* 2. Wax-sealed Time Capsule Envelopes */}
      <TimeCapsuleCard
        capsules={capsules}
        onOpenWriteModal={() => setWriteCapsuleOpen(true)}
        onRefresh={loadData}
      />

      {/* 3. Collapsible Cycles Calendar & History */}
      <CyclesDrawer cycles={cycles} onRefresh={loadData} />

      {/* Write Capsule Native Sheet */}
      <WriteCapsuleSheet
        isOpen={writeCapsuleOpen}
        onClose={() => setWriteCapsuleOpen(false)}
        onCreated={() => {
          if (onNotice) onNotice("کپسول عاشقانه مهروموم شد 💌");
          loadData();
        }}
      />
    </div>
  );
}
