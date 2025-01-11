import { useRef } from "react";

import Header from "./SignedInHeader";
import HeroSection from "./HeroSection";
import MediaCategories from "../movies-series/MediaCategories";
import Footer from "../landing-page/Footer";

const SignedInLandingPage = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);

  const information = {
    url: "https://api.themoviedb.org/3/movie/",
    categories: ["now_playing", "popular", "top_rated", "upcoming"],
    titles: ["now playing", "popular", "top rated", "upcoming"],
  };

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <div ref={mainScreenRef}>
        <HeroSection />
        <MediaCategories information={information} />

        <Footer />
      </div>
    </div>
  );
};

export default SignedInLandingPage;
