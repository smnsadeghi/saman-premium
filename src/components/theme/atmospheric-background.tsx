"use client";

import React from "react";
import { WindowStatus, WindowKind } from "@/types/ritual";

interface AtmosphericBackgroundProps {
  status?: WindowStatus | null;
  kind?: WindowKind | null;
  children: React.ReactNode;
}

export function AtmosphericBackground({
  status,
  kind,
  children,
}: AtmosphericBackgroundProps) {
  // Determine ambient halo color based on active state & kind
  let glowColor = "rgba(217, 160, 91, 0.08)"; // dormant amber
  let glowColorSecondary = "rgba(217, 160, 91, 0.04)";

  if (status === "pre") {
    glowColor = "rgba(157, 132, 183, 0.14)"; // lavender
    glowColorSecondary = "rgba(157, 132, 183, 0.06)";
  } else if (status === "active") {
    if (kind === "period") {
      glowColor = "rgba(200, 90, 83, 0.18)"; // wine terracotta
      glowColorSecondary = "rgba(168, 68, 62, 0.08)";
    } else {
      glowColor = "rgba(79, 122, 117, 0.18)"; // sage / deep teal
      glowColorSecondary = "rgba(59, 95, 91, 0.08)";
    }
  } else if (status === "cooldown") {
    glowColor = "rgba(224, 159, 125, 0.14)"; // sunset peach
    glowColorSecondary = "rgba(224, 159, 125, 0.06)";
  }

  return (
    <div className="relative min-h-dvh w-full flex flex-col justify-between overflow-hidden transition-colors duration-700 ease-in-out">
      {/* Dynamic ambient blooms */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[110px] transition-all duration-700 ease-in-out"
        style={{ backgroundColor: glowColor }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[130px] transition-all duration-700 ease-in-out"
        style={{ backgroundColor: glowColorSecondary }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 w-[240px] h-[240px] rounded-full blur-[100px] transition-all duration-700 ease-in-out"
        style={{ backgroundColor: glowColorSecondary }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
}
