"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { tapLight } from "@/lib/haptics";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: BottomSheetProps) {
  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 400) {
      tapLight();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              tapLight();
              onClose();
            }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Native Sheet Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-md bg-[#18171C]/95 backdrop-blur-2xl border-t border-white/[0.08] rounded-t-[32px] p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-2xl z-10 max-h-[90dvh] overflow-y-auto no-scrollbar"
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing" />

            {/* Header if title exists */}
            {(title || description) && (
              <div className="flex items-start justify-between mb-5">
                <div>
                  {title && (
                    <h3 className="text-base font-semibold text-[#F6F3F8] tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-[#A59CB0] mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    tapLight();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#A59CB0] hover:text-[#F6F3F8] active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
