// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";


// local assets (public/images or import depending on your bundler)
const heroImg = "/images/case-airfrens/AF3 1.jpg"; // replace with your actual path

export default function Airfrens() {
  const meta = [
    { label: "Domain", value: "Web 3" },
    { label: "Platform", value: "Mobile Application" },
    { label: "Service", value: "UI/UX Design, Visual Design and Strategy" },
    { label: "Client", value: "Airfrens" },
  ];

  return (
    <main>
      <HeroSection
        kicker="case study"
        title={
          <>
            Airfrens – <span style={{ whiteSpace: "nowrap" }}>Connect, Share and</span>
            <br />
            Inspire
          </>
        }
        meta={meta}
        heroImage={heroImg}
        heroAlt="Airfrens hero mobile mock"
        heroClass="hero--airfrens"
      />
    </main>
  );
}
