"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AuthBottom() {
  const pathname = usePathname();
  return (
    <div className="border border-secondary-foreground w-96 rounded-full p-6 text-sm">
      {pathname === "/signin" ? (
        <p>
          Not have an Account?{" "}
          <Link
            replace
            className="text-blue-500 hover:underline transition-all"
            href={"/onboarding/username"}
          >
            Create one!
          </Link>
        </p>
      ) : (
        <p>
          Already have an Account?{" "}
          <Link
            replace
            className="text-blue-500 hover:underline transition-all"
            href={"/signin"}
          >
            signin
          </Link>
        </p>
      )}
    </div>
  );
}
