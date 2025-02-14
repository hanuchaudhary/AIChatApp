import React from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full fixed top-0 left-0" style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/about">About</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/contact">Contact</Link>
        </li>
        <ThemeToggle/>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: "1rem",
    backgroundColor: "#333",
    color: "#fff",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-around",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 1rem",
  },
};

export default Navbar;
