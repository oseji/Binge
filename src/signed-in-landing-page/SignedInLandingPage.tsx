import { useRef } from "react";

import Header from "./SignedInHeader";
import HeroSection from "./HeroSection";
import MovieCategories from "./MovieCategories";
import Footer from "../landing-page/Footer";

const SignedInLandingPage = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <div ref={mainScreenRef}>
        <HeroSection />
        <MovieCategories />
        <Footer />
      </div>
    </div>
  );
};

export default SignedInLandingPage;
