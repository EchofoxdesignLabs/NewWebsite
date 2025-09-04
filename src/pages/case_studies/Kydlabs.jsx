// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";
import AboutSection from "../../components/features/case/AboutSection";
import TextSection from "../../components/features/case/TextSection";
import ImageSection from "../../components/features/case/ImageSection";
import StrategyCards from "../../components/features/case/StrategyCards";


// local assets (public/images or import depending on your bundler)
const heroImg = "/images/case-kydlabs/KL01.jpg"; 
const aboutImage1 = "/images/case-kydlabs/KL02.jpg"; 
const aboutImage2 = "/images/case-kydlabs/KL03.jpg"; 
const aboutImage3 = "/images/case-kydlabs/KL04.png"; 
const onboardingImg = "/images/case-airfrens/AR18.jpg";
const identityImg = "/images/case-airfrens/AR17.jpg";
const socialImg = "/images/case-airfrens/AR16.jpg";
const descriptionText = "AirFrens is a Web3-powered social networking app built around digital collectibles, privacy, and community. It enables users to discover like-minded individuals via GPS, showcase NFT holdings, send digital gift - airdrops, chat securely, and participate in voice rooms - all while preserving autonomy over personal data.";
const challengeItems = [
    {
      subtitle: "Making Blockchain Easy to Use",
      description: "Blockchain can feel confusing for regular users. The challenge was to design a clean, easy-to-understand interface that hides the technical stuff but still gives users control and confidence."
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
const researchText = [
  {
    description:"We began by exploring how users engage with event platforms, digital wallets, and on-chain assets. Through interviews, competitor analysis, and behavior mapping, we uncovered common friction points -especially among users unfamiliar with Web3 environments."
  },
  {
    description:"The research highlighted confusion around wallet setup, unclear transaction feedback, and a lack of trust signals during key user actions. These insights became the foundation for designing smoother onboarding, clearer interactions, and a more welcoming experience for both crypto-native and mainstream users."
  }
];
const strategyData = [
  {
    image: onboardingImg,
    title: "Human-Centered Onboarding",
    description: "Simplifying wallet connection and reducing cognitive load for Web2 users entering Web3 spaces."
  },
  {
    image: identityImg,
    title: "Ownership-Driven Identity",
    description: "Using NFTs and wallet assets as social signals - without compromising on user control or privacy."
  },
  {
    image: socialImg,
    title: "Seamless Social Infrastructure",
    description: "Bringing messaging, gifting, discovery, and profiles under one unified, mobile-first experience."
  }
];
const strategyText =[
  {
    description:"Product roadmap laid out the broader vision for a decentralized, privacy-first social platform. This involved eliminating Web3 onboarding friction, integrating identity with verified ownership, and offering a delightful social layer over secure blockchain infrastructure. We prioritized intuitive design, gamified engagement, and smart-wallet powered interactions to make digital ownership feel human, social, and fun."
  }
];
const strategyText2 = [
  {
    type:"highlight",
    description:"We aimed to create a frictionless web3 social platform by simplifying onboarding, prioritizing privacy, and making wallet-based identity feel intuitive."
  }
];
const strategyText3 = [
  {
    description:"TWe designed a modern, clean, nightlife-inspired interface using dark mode for eye strain comfort and use neon green & magenta as accents colour to give a vibrant & youthful vibes and good colour contrast for accessibility. To achieve the raw, rebellious, authentic feel & street-art vibes we add gritty textures, ripped paper effects and hand drawn graffiti layers. While bold yet clean typography brings urban clarity. Artist profiles and ticket visuals humanize the experience with personality and warmth."
  }
];
const processImages1 = {
  desktop: "/images/case-kydlabs/KL05.png", // A wider image for desktop
  mobile: "/images/case-kydlabs/KL05.png",   // A taller image for mobile
};
const processImages2 = {
  desktop: "/images/case-kydlabs/KL06.jpg", // A wider image for desktop
  mobile: "/images/case-kydlabs/KL06.jpg",   // A taller image for mobile
};
const processImages3 = {
  desktop: "/images/case-kydlabs/KL07.png", // A wider image for desktop
  mobile: "/images/case-kydlabs/KL07.png",   // A taller image for mobile
};
export default function Kydlabs() {
  const meta = [
    { label: "Domain", value: "Web 3" },
    { label: "Platform", value: "Mobile Application" },
    { label: "Service", value: "UI/UX Design, Visual Design and Strategy" },
    { label: "Client", value: "Kydlabs" },
  ];

  return (
    <main>
      <HeroSection
        kicker="case study"
        title={
          <>
            Kydlabs – <span style={{ whiteSpace: "nowrap" }}>Connect, Share and</span>
            <br />
            Inspire
          </>
        }
        meta={meta}
        heroImage={heroImg}
        heroAlt="Kydlabs hero mobile mock"
        heroClass="hero--airfrens"
      />
      <AboutSection
        title="About"
        description={descriptionText}
        images={[aboutImage1, aboutImage2, aboutImage3]}
        altTexts={[
        "A mockup of the kydlabs app on a phone.",
        "The kydlabs app logo on a purple background.",
        "A stylized photo of two people.",
        ]}
        imageLayout="overlap"
      />
      <TextSection
        title="Challenge"
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
        title="PainPoints Discovered"
        imageSources={processImages3}
        alt="A diagram showing the research, strategy, and design process."
        height={96} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Strategy"
        contentItems={strategyText}
      />
      <StrategyCards cardData={strategyData} />
      <TextSection
        contentItems={strategyText2}
      />
      <TextSection
        title="Final Output"
        contentItems={strategyText3}
      />
    </main>
  );
}
