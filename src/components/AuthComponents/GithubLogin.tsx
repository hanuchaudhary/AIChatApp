import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

export default function GithubLogin() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => signIn("github")}
    >
      <Github className="mr-2 h-4 w-4" />
      GitHub
    </Button>
  );
}
