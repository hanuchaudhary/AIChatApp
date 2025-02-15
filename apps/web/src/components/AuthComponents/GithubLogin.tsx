"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GithubLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignin = async () => {
    setLoading(true);

    const res = await signIn("github", {
      callbackUrl: `${window.location.origin}/chat`,
    });

    if (res?.error) {
      alert("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/chat");
    setLoading(false);
  };
  return (
    <Button variant="outline" className="w-full" onClick={handleSignin}>
      <Github className="mr-2 h-4 w-4" />
      {loading ? "Loading..." : "Sign in with Github"}
    </Button>
  );
}
