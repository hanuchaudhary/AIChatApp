"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CircleCheck } from "lucide-react";

export default function NextButton({
  handleContinue,
  isLoading = false,
}: {
  handleContinue: VoidFunction;
  isLoading?: boolean;
}) {
  const pathname = usePathname();
  return (
    <motion.button
      type="submit"
      onClick={handleContinue}
      disabled={isLoading}
      className={cn(
        "px-4 py-3 rounded-full disabled:bg-blue-600/40 text-white bg-blue-600   transition-colors flex-1 w-56"
      )}
    >
      <div className="flex items-center font-[600] justify-center gap-2 text-sm">
        {pathname === "/onboarding/password" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              mass: 0.5,
              bounce: 0.4,
            }}
          >
            <CircleCheck
              className={isLoading ? "animate-spin" : ""}
              size={16}
            />
          </motion.div>
        )}
        {pathname === "/onboarding/password"
          ? "Finish"
          : isLoading
          ? "Registering..."
          : "Continue"}
      </div>
    </motion.button>
  );
}
