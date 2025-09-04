// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";
import AboutSection from "../../components/features/case/AboutSection";
import TextSection from "../../components/features/case/TextSection";
import ImageSection from "../../components/features/case/ImageSection";


// local assets (public/images or import depending on your bundler)
const heroImg = "/images/case-cox/CK 01.jpg"; // replace with your actual path
const aboutImage1 = "/images/case-cox/CK 03.jpg"; 
const aboutImage2 = "/images/case-cox/CK 04.jpg"; 
const aboutImage3 = "/images/case-cox/CK 05.jpg"; 
const descriptionText = "Cox & Kings, one of the world’s oldest and most respected travel brands established in 1758, partnered with us to modernize their booking experience. With a legacy rooted in offline services, the goal was to transition their traditional travel booking process into a seamless, user-friendly digital experience tailored to the needs of their specific target audience. Our team worked closely with Cox & Kings to design and implement an intuitive online platform that aligns with modern user expectations while honoring the brand's heritage.";
const challengeItems = [
    {
      subtitle: "Maintain Brand Legacy",
      description: "Cox & Kings is one of the world’s oldest and most respected travel companies, with a legacy spanning over 250+ years. Known for its heritage, trust, and personalized service, the brand has built a strong reputation in delivering curated travel experiences across the globe."
    },
    {
      subtitle: "Premium personalized experience",
      description: "A premium personalized experience offers tailor-made services designed to match individual preferences, ensuring exceptional comfort, exclusive access, and seamless attention to every detail from planning to execution."
    },
    {
      subtitle: "Trustfulness towards the digital platform",
      description: "Providing users with secure, reliable, and transparent experiences that protect their data and build confidence in every interaction."
    }
  ];
const researchText =[
  {
    description:"Our UX research process included a comprehensive competitive analysis, user interviews, and structured questionnaires. These methods helped us understand both the needs of the target audience and the current market landscape. Through this, we identified critical pain points and uncovered gaps in the existing booking process."
  }
];
const strategyText = [
  {
    description:"To create a meaningful digital experience for Cox & Kings users, we began with a deep dive into user behavior and lifestyle patterns. Collaborating closely with the in-house team, we gathered insights from existing research, past booking and strategy, and existing customer touchpoints. Echofox conducted comprehensive research across current, past, and future user segments, exploring mental models, emotional drivers, and key pain points. A range of user personas, both direct and indirect, informed our understanding throughout the process."
  }
];
const strategyText2 = [
  {
    subtitle:"Holistic Experience",
    description:"The platform's experience goes beyond just offering features, it’s thoughtfully designed to support the entire user journey. The team focuses on the complete travel experience, covering every stage: before, during, and after a trip. This holistic approach spans the mobile app, emails, messages and even in-person interactions with hosts, ensuring a seamless, consistent, and enjoyable experience for travelers at every touchpoint."
  }
];
const processImages1 = {
    desktop: "/images/case-cox/CK 02.png", // A wider image for desktop
    mobile: "/images/case-cox/CK 02.png",   // A taller image for mobile
  };
const processImages2 = {
    desktop: "/images/case-cox/CK17.png", // A wider image for desktop
    mobile: "/images/case-cox/CK17.png",   // A taller image for mobile
  };
const processImages3 = {
    desktop: "/images/case-cox/CK 06.jpg", // A wider image for desktop
    mobile: "/images/case-cox/CK 06.jpg",   // A taller image for mobile
  };
const processImages4 = {
  desktop: "/images/case-cox/CK18.png", // A wider image for desktop
  mobile: "/images/case-cox/CK18.png",   // A taller image for mobile
};
export default function CoxNKings() {
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
            Cox And Kings – <span style={{ whiteSpace: "nowrap" }}>Connect, Share and</span>
            <br />
            Inspire
          </>
        }
        meta={meta}
        heroImage={heroImg}
        heroAlt="Cox hero mobile mock"
        heroClass="hero--airfrens"
      />
      <AboutSection
        title="About"
        description={descriptionText}
        images={[aboutImage1, aboutImage2, aboutImage3]}
        altTexts={[
        "A mockup of the Cox and kings app on a phone.",
        "The Cox and Kings app logo on a purple background.",
        "A stylized photo of two people.",
        ]}
      />
      <TextSection
        title="Challenge"
        contentItems={challengeItems}
      />
      <ImageSection
        imageSources={processImages1}
        alt="A diagram showing the research, strategy, and design process."
        height={108} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Research"
        contentItems={researchText}
      />
      <ImageSection
        imageSources={processImages2}
        alt="A diagram showing the research, strategy, and design process."
        height={80} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <ImageSection
        imageSources={processImages3}
        alt="A diagram showing the research, strategy, and design process."
        height={90} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Our Strategy"
        contentItems={strategyText}
      />
      <ImageSection
        imageSources={processImages4}
        alt="A diagram showing the research, strategy, and design process."
        height={60} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        contentItems={strategyText2}
      />
    </main>
  );
}
