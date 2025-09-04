// // src/App.jsx
// import React from "react";
// import Hero from "./components/features/Hero/Hero";
// import Showreel from "./components/features/showreel/Showreel";
// // import Work from "./components/features/work/Work";
// import "./styles/globals.css";

// // Preload the GLTF so the hero has less jank when first shown.
// // this uses the drei helper - ensure @react-three/drei is installed.
// import { useGLTF } from "@react-three/drei";
// import WorkSection from "./components/features/work/WorkSection";
// import MarqueeSection from "./components/features/Marquee/MarqueeSection";
// import ServicesSection from "./components/features/sevices/ServicesSection";
// import SocialSection from "./components/features/Social/SocialSection";
// import TestimonialsSection from "./components/features/Testimonials/TestimonialsSection";
// import BlogCardList from "./components/features/Blogs/BlogCardList";
// // call preload at module load time
// useGLTF.preload("/assets/models/fox24.glb");

// export default function App() {
//   return (
//     <div className="app-root">
//       {/* Hero (3D canvas + layout) */}
//       <Hero />
//       <Showreel />
//       <WorkSection />
//       <MarqueeSection />
//       <ServicesSection />
//       <SocialSection />
//       <TestimonialsSection />
//       <BlogCardList />

//       {/* Following site sections — keep normal DOM content here */}
//       <main>
//         <section style={{ padding: "120px 40px" }}>
//           <h2>Work</h2>
//           <p>
//             Placeholder for following sections. Replace with your real content.
//             Keeping the 3D canvas isolated to the Hero keeps the GPU cost contained.
//           </p>
//         </section>

//         <section style={{ padding: "120px 40px", background: "#fff" }}>
//           <h2>About</h2>
//           <p>More sections go here — each section is normal DOM and scrolls above/below the hero.</p>
//         </section>

//         {/* Add more site sections below */}
//       </main>
//     </div>
//   );
// }
// src/App.jsx
import React, { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import Layout from "./Layouts/Layout";
import BootLoader from "./components/Preloader/BootLoader";
import Home from "./pages/Home"; // EAGER import so canvases mount immediately
import Work from "./pages/Work";
import { ScrollProvider } from "./scroll/ScrollProvider";
import VideoPreloader from "./components/Preloader/VideoPreloader";
const Airfrens_CaseStudy = React.lazy(() => import("./pages/case_studies/Airfrens"));
const Kydlabs_CaseStudy = React.lazy(() => import("./pages/case_studies/Kydlabs"));
const Stevie_CaseStudy = React.lazy(() => import("./pages/case_studies/StevieAwards"));
const Cox_CaseStudy = React.lazy(() => import("./pages/case_studies/CoxNKings"));

export default function App() {
  const [showreelReady, setShowreelReady] = useState(false);

  return (
    <>
    <ScrollProvider>
      <BrowserRouter>
        {/* It's okay to keep a Suspense here for the non-critical lazy sections inside Home */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Pass the onShowreelReady callback down */}
              <Route index element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path='/work/airfrens' element ={<Airfrens_CaseStudy />} />
              <Route path='/work/kydlabs' element ={<Kydlabs_CaseStudy />} />
              <Route path='/work/stevie_awards' element ={<Stevie_CaseStudy />} />
              <Route path='/work/coxNkings' element ={<Cox_CaseStudy />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Full-screen loader with its own video + progress bar */}
      <BootLoader
        showreelReady={showreelReady}
        videoSrc="/videos/loader.mp4"          // <-- replace with your loader video
        videoPoster="/videos/portal-empty.gif"
      />
      {/*
          NEW: This invisible component will start the showreel download
          immediately and call setShowreelReady when it's done.
        */}
        <VideoPreloader
          src="/videos/showreel.webm"
          onReady={() => setShowreelReady(true)}
        />
      </ScrollProvider>
    </>
  );
}
// src/App.jsx


