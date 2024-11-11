import { useRef, useEffect, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";

import RegistrationPage from "./authentication-pages/RegistrationPage";
import LoginPage from "./authentication-pages/LoginPage";
import ResetPassword from "./authentication-pages/ResetPassword";

import Plans from "./payment-pages/Plans";
import PaymentOption from "./payment-pages/PaymentOption";
import PaymentDetails from "./payment-pages/PaymentDetails";

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
      {/* LANDING PAGE */}
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
                    <li onClick={() => setMenuToggled(false)}>Sign up</li>
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

        {/* AUTHENTICATION PAGES */}
        <Route path={["/RegistrationPage", "/LoginPage", "/ResetPassword"]}>
          <div id="authenticationPages">
            <div
              className=" absolute h-full w-full top-0 left-0 bg-cover z-0 inset-0"
              style={{
                backgroundImage: 'url("/heroSection-bg.jpg")',
                backgroundSize: "cover",
              }}
            ></div>
            <Switch>
              <Route path={"/RegistrationPage"} component={RegistrationPage} />
              <Route path={"/LoginPage"} component={LoginPage} />
              <Route path={"/ResetPassword"} component={ResetPassword} />
            </Switch>
          </div>
        </Route>

        {/* PAYMENT PAGES */}
        <Route path={["/Plans", "/PaymentOption", "/PaymentDetails"]}>
          <section id="selectTrial">
            <div
              className=" absolute h-full w-full top-0 left-0 bg-cover z-0 inset-0"
              style={{
                backgroundImage: 'url("/heroSection-bg.jpg")',
                backgroundSize: "cover",
              }}
            ></div>
            <Switch>
              <Route path={"/Plans"} component={Plans} />
              <Route path={"/PaymentOption"} component={PaymentOption} />
              <Route path={"/PaymentDetails"} component={PaymentDetails} />
            </Switch>
          </section>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
