"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import AuthBottom from "./AuthBottom";

export const RouteProgress = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);

  const pathname = usePathname();
  const paths = [
    "/onboarding/username",
    "/onboarding/email",
    "/onboarding/password",
  ];

  React.useEffect(() => {
    const index = paths.indexOf(pathname);
    setStep(index + 1);
  }, [pathname]);

  return (
    <div className="flex flex-col w-full items-center justify-center gap-8">
      <div className="flex items-center gap-6 relative">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-2 h-2 rounded-full relative z-10",
              dot <= step ? "bg-white" : "bg-neutral-300"
            )}
          />
        ))}
        <motion.div
          initial={{ width: "12px", height: "24px", x: 0 }}
          animate={{
            width: step === 1 ? "24px" : step === 2 ? "60px" : "96px",
            x: 0,
          }}
          className="absolute -left-[8px] -top-[8px] -translate-y-1/2 h-3 bg-blue-500 rounded-full"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.8,
            bounce: 0.25,
            duration: 0.6,
          }}
        />
      </div>

      <div className="w-full">{children}</div>
      <AuthBottom/>
    </div>
  );
};
