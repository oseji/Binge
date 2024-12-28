import { useRef } from "react";
import { Route, Switch } from "react-router-dom";

import RegistrationPage from "./authentication-pages/RegistrationPage";
import LoginPage from "./authentication-pages/LoginPage";
import ResetPassword from "./authentication-pages/ResetPassword";

import Plans from "./payment-pages/Plans";
import PaymentOption from "./payment-pages/PaymentOption";
import PaymentDetails from "./payment-pages/PaymentDetails";

import Header from "./landing-page/Header";
import HeroSection from "./landing-page/HeroSection";
import Favorites from "./landing-page/Favorites";
import Features from "./landing-page/Features";
import Pricing from "./landing-page/Pricing";
import Questions from "./landing-page/Questions";
import Footer from "./landing-page/Footer";

import SignedInLandingPage from "./signed-in-landing-page/SignedInLandingPage";

function App() {
  const mainScreenRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <Switch>
        {/* LANDING PAGE */}
        <Route exact path={"/"}>
          <div className="landingPage">
            <Header mainScreenRef={mainScreenRef} />

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

        {/* SIGNED IN LANDING PAGE */}
        <Route path={"/SignedInLandingPage"} component={SignedInLandingPage} />
      </Switch>
    </div>
  );
}

export default App;
