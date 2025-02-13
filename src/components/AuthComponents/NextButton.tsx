"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CircleCheck } from "lucide-react";

export default function NextButton({
  handleContinue,
}: {
  handleContinue: VoidFunction;
}) {
  const pathname = usePathname();
  return (
    <motion.button
      type="submit"
      onClick={handleContinue}
      className={cn(
        "px-4 py-3 rounded-full text-white bg-[#006cff]   transition-colors flex-1 w-56"
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
            <CircleCheck size={16} />
          </motion.div>
        )}
        {pathname === "/onboarding/password" ? "Finish" : "Continue"}
      </div>
    </motion.button>
  );
}
