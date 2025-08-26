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
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import Layout from "./Layouts/Layout";
import Loader from "./components/Preloader/Loader";

// Lazy-load the Home page. Suspense will wait for this code to be ready.
const Home = lazy(() => import("./pages/Home"));

export default function App() {
  return (
    <>
      <BrowserRouter>
        {/*
          This single Suspense boundary is the key.
          It will wait for the lazy-loaded <Home> code to download AND
          for all the useGLTF/useTexture calls inside <Home> to finish.
          The fallback={null} prevents any content from showing until it's all ready.
        */}
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* The Loader sits on top and automatically tracks all loading activity caught by Suspense */}
      <Loader />
    </>
  );
}
// src/App.jsx


