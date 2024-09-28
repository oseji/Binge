import { useState } from "react";
import HeroSection from "./landing-page/HeroSection";
import Favorites from "./landing-page/Favorites";
import Features from "./landing-page/Features";
import Pricing from "./landing-page/Pricing";
import Footer from "./landing-page/Footer";

function App() {
  return (
    <div className="App">
      <HeroSection></HeroSection>

      <Favorites></Favorites>

      <Features></Features>

      <Pricing></Pricing>

      <Footer></Footer>
    </div>
  );
}

export default App;
