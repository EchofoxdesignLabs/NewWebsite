// src/pages/case-studies/Airfrens.jsx
import React from "react";
import HeroSection from "../../components/features/case/HeroSection";
import AboutSection from "../../components/features/case/AboutSection";
import TextSection from "../../components/features/case/TextSection";
import ImageSection from "../../components/features/case/ImageSection";
import OtherWorks from "../../components/features/case/OtherWorksSection";
import { getOtherWorks } from "../../utils/getOtherWorks";


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
const designText = [
  {
    description:"A core objective of the redesign was to streamline the booking process, minimizing the time required to complete a booking and reducing the need for customer support intervention. To achieve this, we implemented a guided user flow, smart defaults, and contextual assistance throughout the journey."
  },
  {
    subtitle:"Information Architecture",
    description:"The information architecture was structured with clear, intuitive sections like Discover, Bookings, Deals, and Guides to streamline navigation and ensure a smooth, user-friendly booking experience."
  }
];
const wireframesText = [
  {
    subtitle:"Wireframes",
    description:"The wireframes were created to visualize the app’s core structure and user flow, focusing on simplicity, clarity, and ease of use. They helped map out key screens like home, search, bookings, and experience details, ensuring intuitive navigation and a smooth user journey before moving into high-fidelity design."
  }
];
const designText2 = [
  {
    subtitle:"Design System",
    description:"We introduced a modern design system that honored the legacy and premium feel of the Cox & Kings brand while creating a fresh, user-centric interface. The new design prioritized clarity, intuitiveness, and engagement, ensuring users could navigate the platform effortlessly."
  }
];
const outputText = [
  {
    description:"The digital transformation of the booking experience was executed with careful attention to preserving the brand's legacy. Through thoughtful rebranding and the development of an intuitive user experience and cohesive design system, the platform not only stood out visually but also aligned with users’ mental models and expectations across existing platforms. This ensured a smooth transition for existing users while enhancing usability for new ones. More than just a booking tool, the platform leveraged AI-driven personalization to guide users based on their individual needs and preferences elevating the overall experience from transactional to truly tailored."
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
const processImages5 = {
  desktop: "/images/case-cox/CK 07.jpg", // A wider image for desktop
  mobile: "/images/case-cox/CK 07.jpg",   // A taller image for mobile
};
const processImages6 = {
  desktop: "/images/case-cox/CK 08.jpg", // A wider image for desktop
  mobile: "/images/case-cox/CK 08.jpg",   // A taller image for mobile
};
const processImages7 = {
  desktop: "/images/case-cox/CK 09.png", // A wider image for desktop
  mobile: "/images/case-cox/CK 09.png",   // A taller image for mobile
};
const processImages8 = {
  desktop: "/images/case-cox/CK10.jpg", // A wider image for desktop
  mobile: "/images/case-cox/CK10.jpg",   // A taller image for mobile
};
const processImages9 = {
  desktop: "/images/case-cox/CK11.jpg", // A wider image for desktop
  mobile: "/images/case-cox/CK11.jpg",   // A taller image for mobile
};
const processImages10 = {
  desktop: "/images/case-cox/CK12.png", // A wider image for desktop
  mobile: "/images/case-cox/CK12.png",   // A taller image for mobile
};
const processImages11 = {
  desktop: "/images/case-cox/CK13.png", // A wider image for desktop
  mobile: "/images/case-cox/CK13.png",   // A taller image for mobile
};
const processImages12 = {
  desktop: "/images/case-cox/CK14.png", // A wider image for desktop
  mobile: "/images/case-cox/CK14.png",   // A taller image for mobile
};
const processImages13 = {
  desktop: "/images/case-cox/CK15.png", // A wider image for desktop
  mobile: "/images/case-cox/CK15.png",   // A taller image for mobile
};
const processImages14 = {
  desktop: "/images/case-cox/CK16.png", // A wider image for desktop
  mobile: "/images/case-cox/CK16.png",   // A taller image for mobile
};
export default function CoxNKings() {
  const meta = [
    { label: "Domain", value: "Web 3" },
    { label: "Platform", value: "Mobile Application" },
    { label: "Service", value: "UI/UX Design, Visual Design and Strategy" },
    { label: "Client", value: "Airfrens" },
  ];
  const otherWorksPosts = getOtherWorks('cox', 3);
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
      <ImageSection
        imageSources={processImages5}
        alt="A diagram showing the research, strategy, and design process."
        height={90} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <ImageSection
        imageSources={processImages6}
        alt="A diagram showing the research, strategy, and design process."
        height={108} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="Design Execution"
        contentItems={designText}
      />
      <ImageSection
        title="Flight Booking Flow"
        imageSources={processImages7}
        alt="A diagram showing the research, strategy, and design process."
        height={60} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        contentItems={wireframesText}
      />
      <ImageSection
        imageSources={processImages8}
        alt="A diagram showing the research, strategy, and design process."
        height={60} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        contentItems={designText2}
      />
      <ImageSection
        imageSources={processImages9}
        alt="A diagram showing the research, strategy, and design process."
        height={220} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <TextSection
        title="The Output"
        contentItems={outputText}
      />
      <ImageSection
        title="Explore"
        description="Explore the place will give suggestions according to the personal interest to avoid overwhelming Options."
        imageSources={processImages10}
        alt="A diagram showing the research, strategy, and design process."
        height={80} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#ffffffff"
      />
      <ImageSection
        title="Login Flow"
        description="App uses a quick OTP verification process, allowing users to securely sign in using their mobile number without needing a password."
        imageSources={processImages11}
        alt="A diagram showing the research, strategy, and design process."
        height={105} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#000000ff"
      />
      <ImageSection
        title="Flight Booking Flow"
        description="Allows users to search, select, and book flights quickly with a simple, step-by-step process."
        imageSources={processImages12}
        alt="A diagram showing the research, strategy, and design process."
        height={80} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#ffffffff"
      />
      <ImageSection
        title="Hotel Booking Flow"
        description="Lets users search, filter, and select accommodations, then enter guest details and complete payment in a few easy steps."
        imageSources={processImages13}
        alt="A diagram showing the research, strategy, and design process."
        height={120} // This will make it fill the entire screen height
        objectFit = "cover"
        textColor="#000000ff"
        textLayout="twoColumn"
      />
      <ImageSection
        imageSources={processImages14}
        alt="A diagram showing the research, strategy, and design process."
        height={90} // This will make it fill the entire screen height
        objectFit = "cover"
      />
      <OtherWorks
        posts={otherWorksPosts}
      />
    </main>
  );
}
