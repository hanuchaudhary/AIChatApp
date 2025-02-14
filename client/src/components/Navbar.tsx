"use client";

import React from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold">Chat.io</h2>
      <ul className="flex items-center space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <ThemeToggle />

        <Button
          onClick={async () => {
            await signOut();
            router.push("/signin");
          }}
        >
          Logout
        </Button>
      </ul>
    </nav>
  );
};

export default Navbar;
