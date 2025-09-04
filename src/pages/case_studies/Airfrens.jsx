// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";
import AboutSection from "../../components/features/case/AboutSection";
import TextSection from "../../components/features/case/TextSection";
import ImageSection from "../../components/features/case/ImageSection";
import StrategyCards from "../../components/features/case/StrategyCards";
import OtherWorks from "../../components/features/case/OtherWorksSection";
import { getOtherWorks } from "../../utils/getOtherWorks";


// local assets (public/images or import depending on your bundler)
const heroImg = "/images/case-airfrens/AF3 1.jpg"; // replace with your actual path
const aboutImage1 = "/images/case-airfrens/AR02.jpg"; 
const aboutImage2 = "/images/case-airfrens/AR03.jpg"; 
const aboutImage3 = "/images/case-airfrens/AR04.png"; 
const onboardingImg = "/images/case-airfrens/AR18.jpg";
const identityImg = "/images/case-airfrens/AR17.jpg";
const socialImg = "/images/case-airfrens/AR16.jpg";
const descriptionText = "AirFrens is a Web3-powered social networking app built around digital collectibles, privacy, and community. It enables users to discover like-minded individuals via GPS, showcase NFT holdings, send digital gift - airdrops, chat securely, and participate in voice rooms - all while preserving autonomy over personal data.";
const challengeItems = [
    {
      subtitle: "Centralization & Privacy Risks",
      description: "Legacy social platforms capitalize on user data, selling it or guiding content with opaque algorithms. These practices erode trust and user well-being."
    },
    {
      subtitle: "Monetizing User Content",
      description: "In an era of creator exploitation, empowering users to retain and monetize their original content required a system that blended Web3 ownership principles with familiar social media dynamics - all while keeping the experience seamless and user-friendly."
    },
    {
      subtitle: "Building Trust in Ownership",
      description: "Users need to showcase real digital assets securely without risking impersonation or falsification - thereby demanding robust verification and transparency mechanisms."
    }
  ];
const researchText = [
  {
    description:"Extensive user discovery sessions with Web3 collectors, early crypto adopters, and curious Web2 users helped us understand how people perceive blockchain-based social tools. Alongside this, we conducted an in-depth competitor analysis of emerging Web3 social platforms to assess existing gaps and overlooked user needs."
  },
  {
    description:"Our research (both qualitative & quantitative) uncovered that digital natives craved a more human, secure, and expressive way to connect in the blockchain space - beyond just speculation and trading. These users, many of whom owned NFTs or participated in DAOs, felt the lack of a casual, community-first app where ownership, privacy, and identity were in their control."
  }
];
const strategyText =[
  {
    description:"Product roadmap laid out the broader vision for a decentralized, privacy-first social platform. This involved eliminating Web3 onboarding friction, integrating identity with verified ownership, and offering a delightful social layer over secure blockchain infrastructure. We prioritized intuitive design, gamified engagement, and smart-wallet powered interactions to make digital ownership feel human, social, and fun."
  }
];
const strategyText2 =[
  {
    type:"highlight",
    description:"We aimed to create a frictionless web3 social platform by simplifying onboarding, prioritizing privacy, and making wallet-based identity feel intuitive."
  }
];
const designText = [
  {
    description:"Our design strategy focused on creating an approachable, secure, and expressive social experience for both crypto-native and Web2-first users. We crafted modular design systems that emphasized clarity, ownership, and connection - ensuring that each interaction felt both intuitive and personal."
  },
  {
    description:"Core features such as NFT-powered user profiles, end-to-end encrypted messaging, and location-based discovery were thoughtfully designed to promote trust and engagement. We prioritized frictionless onboarding, starting with wallet-optional entry points and clean navigation paths tailored to different user familiarity levels"
  }
];
const designText2 = [
  {
    subtitle:"Design System",
    description:"We introduced a modern design system that honored the fresh & unique feel of the Airfrens brand while creating a fun, user-centric interface. The new design prioritized clarity, intuitiveness, and engagement, ensuring users could navigate the platform effortlessly."
  }
];
const informationText = [
  {
    subtitle:"Information Architecture",
    description:"The information architecture was structured with clear, intuitive sections like Discover, Bookings, Deals, and Guides to streamline navigation and ensure a smooth, user-friendly booking experience."
  }
];
const outputText = [
  {
    description:"The wireframes were created to visualize the app’s core structure and user flow, focusing on simplicity, clarity, and ease of use. They helped map out key screens like home, search, bookings, and experience details, ensuring intuitive navigation and a smooth user journey before moving into high-fidelity design."
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
  const processImages1 = {
    desktop: "/images/case-airfrens/AR05.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR05.png",   // A taller image for mobile
  };
  const processImages2 = {
    desktop: "/images/case-airfrens/AR06.jpg", // A wider image for desktop
    mobile: "/images/case-airfrens/AR06.jpg",   // A taller image for mobile
  };
  const processImages3 = {
    desktop: "/images/case-airfrens/AR07.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR07.png",   // A taller image for mobile
  };
  const processImages4 = {
    desktop: "/images/case-airfrens/AR12.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR12.png",   // A taller image for mobile
  };
  const processImages5 = {
    desktop: "/images/case-airfrens/AR08.jpg", // A wider image for desktop
    mobile: "/images/case-airfrens/AR08.jpg",   // A taller image for mobile
  };
  const processImages6 = {
    desktop: "/images/case-airfrens/AR09.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR09.png",   // A taller image for mobile
  };
  const processImages7 = {
    desktop: "/images/case-airfrens/AR10.jpg", // A wider image for desktop
    mobile: "/images/case-airfrens/AR10.jpg",   // A taller image for mobile
  };
  const processImages8 = {
    desktop: "/images/case-airfrens/AR11.jpg", // A wider image for desktop
    mobile: "/images/case-airfrens/AR11.jpg",   // A taller image for mobile
  };
  const processImages9 = {
    desktop: "/images/case-airfrens/AR20.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR20.png",   // A taller image for mobile
  };
  const processImages10 = {
    desktop: "/images/case-airfrens/AR13.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR13.png",   // A taller image for mobile
  };
  const processImages11 = {
    desktop: "/images/case-airfrens/AR14.png", // A wider image for desktop
    mobile: "/images/case-airfrens/AR14.png",   // A taller image for mobile
  };
  const processImages12 = {
    desktop: "/images/case-airfrens/AR15.jpg", // A wider image for desktop
    mobile: "/images/case-airfrens/AR15.jpg",   // A taller image for mobile
  };
export default function Airfrens() {
  const meta = [
    { label: "Domain", value: "Web 3" },
    { label: "Platform", value: "Mobile Application" },
    { label: "Service", value: "UI/UX Design, Visual Design and Strategy" },
    { label: "Client", value: "Airfrens" },
  ];
  // ✅ Use the helper function here!
  // It will get 3 other works, excluding 'airfrens', prioritizing its category first.
  const otherWorksPosts = getOtherWorks('airfrens', 3);

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
          "A mockup of the AirFrens app on a phone.",
          "The AirFrens app logo on a purple background.",
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
        height={88} // This will make it fill the entire screen height
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
      <ImageSection
        imageSources={processImages4}
        alt="A diagram showing the research, strategy, and design process."
        height={88} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Design Execution"
        contentItems={designText}
      />
      <ImageSection
        imageSources={processImages5}
        alt="A diagram showing the research, strategy, and design process."
        height={88} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        contentItems={informationText}
      />
      <ImageSection
        title="Onboarding Process"
        imageSources={processImages6}
        alt="A diagram showing the research, strategy, and design process."
        height={105} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        contentItems={designText2}
      />
      <ImageSection
        imageSources={processImages7}
        alt="A diagram showing the research, strategy, and design process."
        height={110} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Final Output"
        contentItems={outputText}
      />
      <ImageSection
        imageSources={processImages8}
        alt="A diagram showing the research, strategy, and design process."
        height={90} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <ImageSection
        title="Onboarding & login"
        description="The onboarding and login flow is designed to feel fast and intuitive. Users begin with a minimal splash experience and can sign up using a phone number, email, or Google account."
        imageSources={processImages9}
        alt="A diagram showing the research, strategy, and design process."
        height={120} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <ImageSection
        title="Fren Zone"
        description="The Fren zone is a live audio space whre you can freely share what's on your mind and connect with people from around the world in realtime."
        imageSources={processImages10}
        alt="A diagram showing the research, strategy, and design process."
        height={100} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#0a0a0a"
      />
      <ImageSection
        title="Profile"
        description="The screen is designed in a way to allow you to quickly preview how you're presenting yourself to others, edit/update your profile information, and view your gifts and other digital collectables."
        imageSources={processImages11}
        alt="A diagram showing the research, strategy, and design process."
        height={115} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#0a0a0a"
        textLayout="twoColumn"
      />
      <ImageSection
        imageSources={processImages12}
        alt="A diagram showing the research, strategy, and design process."
        height={80} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <OtherWorks
        posts={otherWorksPosts}
      />
    </main>
  );
}
