// src/components/ui/Header/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" aria-label="Echofox home">
            <img src="/images/logo.webp" alt="Echofox" />
          </Link>
        </div>

        <div className={styles.line} />

        <nav className={styles.nav} aria-label="Main">
          <Link to="/work">WORK</Link>
          <Link to="/about">ABOUT</Link>
          <Link to="/careers">CAREER</Link>
          <Link to="/contact">CONTACT</Link>
        </nav>
      </div>
    </header>
  );
}
