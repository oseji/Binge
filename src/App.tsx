import HeroSection from "./landing-page/HeroSection";
import Favorites from "./landing-page/Favorites";
import Features from "./landing-page/Features";
import Pricing from "./landing-page/Pricing";
import Questions from "./landing-page/Questions";
import Footer from "./landing-page/Footer";

function App() {
  return (
    <div className="App">
      <HeroSection></HeroSection>

      <Favorites></Favorites>

      <Features></Features>

      <Pricing></Pricing>

      <Questions></Questions>

      <Footer></Footer>
    </div>
  );
}

export default App;
