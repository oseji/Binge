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

        {/* Pill switcher */}
        <div className="typeSwitcherGrp">
          <div
            className="flex items-center rounded-full p-1 border border-line"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <button
              className={`px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                currentType === "Movies"
                  ? "bg-accent text-white shadow-lg shadow-purple-900/40"
                  : "text-fg-muted hover:text-white/80"
              }`}
              onClick={() => setCurrentType("Movies")}
            >
              Movies
            </button>
            <button
              className={`px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                currentType === "Series"
                  ? "bg-accent text-white shadow-lg shadow-purple-900/40"
                  : "text-fg-muted hover:text-white/80"
              }`}
              onClick={() => setCurrentType("Series")}
            >
              Series
            </button>
          </div>
        </div>

        {currentType === "Movies" ? <Movies /> : <Series />}

        <Footer />
      </div>
    </div>
  );
};

export default SignedInLandingPage;
