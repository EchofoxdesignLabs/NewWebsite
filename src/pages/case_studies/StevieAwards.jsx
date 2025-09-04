// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";
import AboutSection from "../../components/features/case/AboutSection";
import TextSection from "../../components/features/case/TextSection";
import ImageSection from "../../components/features/case/ImageSection";


// local assets (public/images or import depending on your bundler)
const heroImg = "/images/case-stevieawards/SA 01.jpg"; 
const aboutImage1 = "/images/case-stevieawards/SA 03.jpg"; 
const aboutImage2 = "/images/case-stevieawards/SA 04.jpg"; 
const aboutImage3 = "/images/case-stevieawards/SA 05.png"; 
const descriptionText = "The Stevie Awards redesign aimed to enhance user experience by streamlining the nomination process, improving navigation, and optimizing for mobile. The result is a more accessible and user-friendly platform that supports global engagement while maintaining the awards' prestige.";
const challengeItems = [
    {
      subtitle: "Maintain Brand Legacy",
      description: "Cox & Kings is one of the world’s oldest and most respected travel companies, with a legacy spanning over 250+ years. Known for its heritage, trust, and personalized service, the brand has built a strong reputation in delivering curated travel experiences across the globe."
    },
    {
      subtitle: "Secure, But Not Complicated",
      description: "Keeping tickets and digital assets safe is important, but wallet logins and security steps can slow things down. We had to balance strong security with a smooth, simple flow that works for new users too."
    },
    {
      subtitle: "Driving Adoption and Scaling",
      description: "Kyd Labs is pioneering a new way to connect fans and creators through Web3, but getting traditional brands and audiences on board is a hurdle. The challenge was to design a platform that feels innovative but still appeals to those who are not yet familiar with blockchain or decentralized platforms, ensuring broad adoption while driving future growth."
    }
  ];
const researchText =[
  {
    description:"Research included user stakeholder interviews, and a usability audit of the existing site. Key findings showed issues with navigation, branding consistency, and the entry/judging process. Insights guided a user-focused redesign to improve clarity and engagement."
  }
];
const strategyText = [
  {
    description:"The strategy focused on simplifying navigation, unifying branding, and improving the entry and judging experience. Key user personas guided design decisions, with an emphasis on accessibility, mobile optimization, and a consistent user journey."
  }
];
const designText = [
  {
    description:"The design featured a clean, modern interface with enhanced navigation and consistent branding. Key screens, including entry forms and award descriptions, were prototyped with a strong focus on clarity, accessibility, and responsiveness. Continuous feedback ensured alignment with user and business needs, while responsive design guaranteed smooth interaction across all touchpoints."
  }
];
const processImages1 = {
  desktop: "/images/case-stevieawards/SA 06.png", // A wider image for desktop
  mobile: "/images/case-stevieawards/SA 06.png",   // A taller image for mobile
};
const processImages2 = {
  desktop: "/images/case-stevieawards/SA 07.jpg", // A wider image for desktop
  mobile: "/images/case-stevieawards/SA 07.jpg",   // A taller image for mobile
};
const processImages3 = {
  desktop: "/images/case-stevieawards/SA 02.jpg", // A wider image for desktop
  mobile: "/images/case-stevieawards/SA 02.jpg",   // A taller image for mobile
};
const processImages4 = {
  desktop: "/images/case-stevieawards/SA 08.jpg", // A wider image for desktop
  mobile: "/images/case-stevieawards/SA 08.jpg",   // A taller image for mobile
};
export default function StevieAwards() {
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
      <AboutSection
        title="About"
        description={descriptionText}
        images={[aboutImage1, aboutImage2, aboutImage3]}
        altTexts={[
        "A mockup of the stevie awards app on a phone.",
        "The stevie awards app logo on a purple background.",
        "A stylized photo of two people.",
        ]}
        imageLayout="overlap"
      />
      <TextSection
        title="Challenges Faced"
        contentItems={challengeItems}
      />
      <ImageSection
        title="Process"
        imageSources={processImages1}
        alt="A diagram showing the research, strategy, and design process."
        height={90} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <ImageSection
        imageSources={processImages2}
        alt="A diagram showing the research, strategy, and design process."
        height={92} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Research"
        contentItems={researchText}
      />
      <ImageSection
        imageSources={processImages3}
        alt="A diagram showing the research, strategy, and design process."
        height={92} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Our Strategy"
        contentItems={strategyText}
      />
      <ImageSection
        imageSources={processImages4}
        alt="A diagram showing the research, strategy, and design process."
        height={92} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Design Excecution"
        contentItems={designText}
      />
    </main>
  );
}
