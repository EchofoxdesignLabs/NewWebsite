import React from "react";
import { Link } from "react-router-dom";
import Connect3DVanilla from "./Connect3D";
import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        {/* --- TOP ROW / MAIN CONTENT --- */}
        <div className={styles.mainContent}>
          <div>
            <p className={styles.kicker}>
              <span className={styles.dot} /> contact
            </p>
            <div className={styles.connectWrap}>
              <Connect3DVanilla />
            </div>
            <div className={styles.contactInfo}>
              <a className={styles.email} href="mailto:connect@echofoxdesign.com">
                connect@echofoxdesign.com
              </a>
              <a className={styles.phone} href="tel:+919887675564">
                +91 9887675564
              </a>
            </div>
          </div>
        </div>

        {/* --- SEPARATOR LINE --- */}
        <div className={styles.separator} />

        {/* --- BOTTOM ROW / SUB-FOOTER --- */}
        <div className={styles.subFooter}>
          <div className={styles.social}>
                <a aria-label="Instagram" href="#" className={styles.icon}>
                    <img src="/images/icons/instagram.png" alt="Instagram" />
                </a>
                <a aria-label="X" href="#" className={styles.icon}>
                    <img src="/images/icons/dribbble.png" alt="X" />
                </a>
                <a aria-label="YouTube" href="#" className={styles.icon}>
                    <img src="/images/icons/youtube.png" alt="YouTube" />
                </a>
                <a aria-label="Facebook" href="#" className={styles.icon}>
                    <img src="/images/icons/facebook.png" alt="Facebook" />
                </a>
            </div>
          <div className={styles.copy}>
            © Copyright 2024 | Echofox Design Labs Pvt. Ltd
          </div>
          <nav className={styles.nav}>
            <Link to="/about">About</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}