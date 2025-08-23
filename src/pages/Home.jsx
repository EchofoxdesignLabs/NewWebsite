// src/pages/Home.jsx
import React, { Suspense } from "react";
import Hero from "../components/features/Hero/Hero"; // heavy 3D hero kept eager
import Footer from "../components/features/Footer/Footer";  // if using Layout instead, remove Footer here
import styles from "./styles/Home.module.css";
import Header from "../components/features/Headers/Header";

/**
 * Lazy-load the other sections to improve initial bundle size.
 * These components will be fetched only when Home renders.
 */
const Showreel = React.lazy(() => import("../components/features/showreel/Showreel"));
const WorkSection = React.lazy(() => import("../components/features/work/WorkSection"));
const MarqueeSection = React.lazy(() => import("../components/features/Marquee/MarqueeSection"));
const ServicesSection = React.lazy(() => import("../components/features/sevices/ServicesSection"));
const SocialSection = React.lazy(() => import("../components/features/Social/SocialSection"));
const TestimonialsSection = React.lazy(() => import("../components/features/Testimonials/TestimonialsSection"));
const BlogCardList = React.lazy(() => import("../components/features/Blogs/BlogCardList"));

/* tiny fallback used for each suspended chunk - swap for your skeletons if available */
function SectionFallback({ label = "Loading…" }) {
  return (
    <div className={styles.sectionFallback} aria-hidden>
      {label}
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      {/* HERO (3D canvas + above-fold content) */}
      <Hero />

      {/* the rest of the page — lazy loaded with inexpensive fallbacks */}
      <main className={styles.main}>

        <Suspense fallback={<SectionFallback label="Loading showreel…" />}>
          <Showreel />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading work…" />}>
          <WorkSection />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading marquee…" />}>
          <MarqueeSection />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading services…" />}>
          <ServicesSection />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading social…" />}>
          <SocialSection />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading testimonials…" />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback label="Loading blogs…" />}>
          <BlogCardList />
        </Suspense>
      </main>
    </div>
  );
}
