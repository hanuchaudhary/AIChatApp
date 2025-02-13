import React from "react";
import { motion } from "motion/react";
export default function BackButton({
  handleBack,
}: {
  handleBack: VoidFunction;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, width: 0, scale: 0.8 }}
      animate={{ opacity: 1, width: "64px", scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.8,
        bounce: 0.25,
        duration: 0.6,
        opacity: { duration: 0.2 },
      }}
      onClick={handleBack}
      className="px-4 py-3 text-black flex items-center justify-center  bg-neutral-100  font-semibold rounded-full hover:bg-neutral-50 transition-colors flex-1 w-16 text-sm"
    >
      Back
    </motion.button>
  );
}
