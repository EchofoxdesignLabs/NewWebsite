// src/pages/Home.jsx
import React from "react";
import styles from "./styles/Home.module.css";

import Hero from "../components/features/Hero/Hero";               // eager
import Showreel from "../components/features/showreel/Showreel";   // eager
import WorkSection from "../components/features/work/WorkSection"; // eager

// Keep the rest lazy if you want
const MarqueeSection = React.lazy(() => import("../components/features/Marquee/MarqueeSection"));
const ServicesSection = React.lazy(() => import("../components/features/sevices/ServicesSection"));
const SocialSection = React.lazy(() => import("../components/features/Social/SocialSection"));
const TestimonialsSection = React.lazy(() => import("../components/features/Testimonials/TestimonialsSection"));
const BlogCardList = React.lazy(() => import("../components/features/Blogs/BlogCardList"));

function SectionFallback({ label = "Loading…" }) {
  return <div className={styles.sectionFallback} aria-hidden>{label}</div>;
}

export default function Home({ onShowreelReady }) {
  return (
    <div className={styles.page}>
      <Hero />

      <main className={styles.main}>
        <Showreel onReady={onShowreelReady} />
        <WorkSection />

        <React.Suspense fallback={<SectionFallback label="Loading marquee…" />}>
          <MarqueeSection />
        </React.Suspense>

        <React.Suspense fallback={<SectionFallback label="Loading services…" />}>
          <ServicesSection />
        </React.Suspense>

        <React.Suspense fallback={<SectionFallback label="Loading social…" />}>
          <SocialSection />
        </React.Suspense>

        <React.Suspense fallback={<SectionFallback label="Loading testimonials…" />}>
          <TestimonialsSection />
        </React.Suspense>

        <React.Suspense fallback={<SectionFallback label="Loading blogs…" />}>
          <BlogCardList />
        </React.Suspense>
      </main>
    </div>
  );
}
