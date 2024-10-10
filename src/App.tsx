import { useRef, useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";

import RegistrationPage from "./authentication-pages/RegistrationPage";

import HeroSection from "./landing-page/HeroSection";
import Favorites from "./landing-page/Favorites";
import Features from "./landing-page/Features";
import Pricing from "./landing-page/Pricing";
import Questions from "./landing-page/Questions";
import Footer from "./landing-page/Footer";

import menu from "./assets/menu.svg";
import closeMenu from "./assets/icons8-close.svg";

import logo from "./assets/Binge.svg";

function App() {
  const menuRef = useRef<HTMLImageElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);
  const mainScreenRef = useRef<HTMLDivElement>(null);

  // menu toggle
  useEffect(() => {
    if (menuRef.current) {
      if (menuToggled) {
        menuRef.current.classList.remove("menuHidden");
        menuRef.current.classList.add("menuShow");
        mainScreenRef.current?.classList.add("hideMainScreen");
      }

      if (!menuToggled) {
        menuRef.current.classList.add("menuHidden");
        menuRef.current.classList.remove("menuShow");
        mainScreenRef.current?.classList.remove("hideMainScreen");
      }
    }
  }, [menuToggled]);

  return (
    <div className="App">
      <Switch>
        <Route exact path={"/"}>
          <div className="landingPage">
            {/* header for tablets and desktops */}
            <header className="bigScreenHeader">
              <ul className="headerList">
                <li>Movies</li>
                <li>Series</li>
                <li>Tv Shows</li>
              </ul>

              <img src={logo} alt="Binge Logo" className="headerLogo" />

              <ul className="headerList">
                <li>Choose your language</li>
                <Link to={"/RegistrationPage"}>
                  <li>Sign up</li>
                </Link>
              </ul>
            </header>

            {/* header for phones */}
            <header className="smallScreenHeader ">
              <div className=" flex flex-row justify-between items-start">
                <img src={logo} alt="Binge Logo" className=" h-8" />

                <img
                  src={menuToggled ? closeMenu : menu}
                  alt="menu image"
                  className=" h-8"
                  onClick={() => setMenuToggled((prev) => !prev)}
                />
              </div>

              <div className="menuHidden " ref={menuRef}>
                <ul className="flex flex-col items-start  gap-16 bg-black text-2xl uppercase ">
                  <li>Movies</li>
                  <li>Series</li>
                  <li>Tv Shows</li>
                  <li>Choose your language</li>
                  <Link to={"/RegistrationPage"}>
                    <li>Sign up</li>
                  </Link>
                </ul>
              </div>
            </header>

            <div ref={mainScreenRef}>
              <HeroSection></HeroSection>

              <Favorites></Favorites>

              <Features></Features>

              <Pricing></Pricing>

              <Questions></Questions>

              <Footer></Footer>
            </div>
          </div>
        </Route>

        <Route path={"/RegistrationPage"}>
          <RegistrationPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
