// src/pages/Work.jsx
import React from "react";
import styles from "./styles/Workpage.module.css";

// sections (eager)
import WorkHero from "../components/features/WorkPage/Hero/WorkHero";
import WorksGrid from "../components/features/WorkPage/Hero/WorksGrid";
import Showreel from "../components/features/showreel/Showreel";  

const ContactSection = React.lazy(() => import("../components/features/WorkPage/Contact/ContactSection"));

export default function Work({onShowreelReady}) {
  return (
    <div className={styles.page}>
      <main>
        <WorkHero />
        <WorksGrid />
        <Showreel onReady={onShowreelReady} />
        <ContactSection />
      </main>
    </div>
  );
}
