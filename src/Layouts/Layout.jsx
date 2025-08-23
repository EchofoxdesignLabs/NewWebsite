// src/layouts/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/features/Headers/Header";
import Footer from "../components/features/Footer/Footer";
import styles from "./styles/Layout.module.css";
import Cursor from "../components/UI/Cursor/Cursor";

export default function Layout() {
  return (
    <div className={styles.pageWrap}>
      <Header />
       {/* Cursor must be in DOM at top-level so it overlays everything */}
      <Cursor />
      {/* main content area — pages will render here */}
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
