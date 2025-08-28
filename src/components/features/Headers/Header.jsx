// src/components/ui/Header/Header.jsx
import React from "react";
import { Link,NavLink } from "react-router-dom";
import styles from "./styles/Header.module.css";

export default function Header() {
  // helper to keep the className logic tidy
  const cx = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;
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
          <NavLink to="/work" className={cx}>WORK</NavLink>
          <NavLink to="/about" className={cx}>ABOUT</NavLink>
          <NavLink to="/careers" className={cx}>CAREER</NavLink>
          <NavLink to="/contact" className={cx}>CONTACT</NavLink>
        </nav>
      </div>
    </header>
  );
}
