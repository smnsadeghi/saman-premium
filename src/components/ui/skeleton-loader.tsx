"use client";

import React from "react";

export function CardSkeleton({ className = "h-36" }: { className?: string }) {
  return (
    <div
      className={`w-full rounded-3xl bg-[#18171C]/70 border border-white/[0.05] p-6 relative overflow-hidden animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-24 h-4 bg-white/[0.08] rounded-full" />
        <div className="w-12 h-4 bg-white/[0.05] rounded-full" />
      </div>
      <div className="w-3/4 h-5 bg-white/[0.08] rounded-lg mb-2" />
      <div className="w-1/2 h-3 bg-white/[0.04] rounded-md" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-5 px-5 py-6">
      {/* Hero skeleton */}
      <CardSkeleton className="h-44" />
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-28" />
      </div>
      {/* Action skeleton */}
      <CardSkeleton className="h-20" />
    </div>
  );
}
