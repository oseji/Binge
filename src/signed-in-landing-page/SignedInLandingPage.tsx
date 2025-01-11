import { useRef, useState } from "react";

import Header from "./SignedInHeader";
import HeroSection from "./HeroSection";
import Movies from "../movies-series/Movies";
import Series from "../movies-series/Series";
import Footer from "../landing-page/Footer";

const SignedInLandingPage = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const [currentType, setCurrentType] = useState<"Movies" | "Series">("Movies");

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <div ref={mainScreenRef}>
        <HeroSection />

        <div className="typeSwitcherGrp">
          <span
            className={` border-b-2 ${
              currentType === "Movies"
                ? " border-purple-600 scale-125"
                : " border-transparent"
            }`}
            onClick={() => setCurrentType("Movies")}
          >
            Movies
          </span>
          <span
            className={` border-b-2 ${
              currentType === "Series"
                ? " border-purple-600 scale-125"
                : " border-transparent"
            }`}
            onClick={() => setCurrentType("Series")}
          >
            Series
          </span>
        </div>

        {currentType === "Movies" ? <Movies /> : <Series />}

        <Footer />
      </div>
    </div>
  );
};

export default SignedInLandingPage;
