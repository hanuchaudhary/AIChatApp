import React from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
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
      </ul>
    </nav>
  );
};

export default Navbar;
