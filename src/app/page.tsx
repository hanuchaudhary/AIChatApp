import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white w-full flex items-center justify-center">
      <Link href={"/onboarding/username"}>
        <Button>Register</Button>
      </Link>
    <Link href={"/signin"}>
        <Button>Signin</Button>
      </Link>
    </div>
  );
}
