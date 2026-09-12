import { useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { RootState } from "./redux/store";
import { setFalse, setTrue } from "./redux/loginState";
import { auth } from "./firebase-config/firebase";
import { ToastContainer } from "react-toastify";

import RegistrationPage from "./authentication-pages/RegistrationPage";
import LoginPage from "./authentication-pages/LoginPage";
import ResetPassword from "./authentication-pages/ResetPassword";

import Movies from "./movies-series/Movies";
import Series from "./movies-series/Series";
import Search from "./movies-series/Search";
import Details from "./movies-series/Details";

import Header from "./components/Header";
import HeroSection from "./landing-page/HeroSection";
import Favorites from "./landing-page/Favorites";
import Features from "./landing-page/Features";
import Pricing from "./landing-page/Pricing";
import Questions from "./landing-page/Questions";
import Footer from "./landing-page/Footer";

import SignedInLandingPage from "./signed-in-landing-page/SignedInLandingPage";
import MyList from "./signed-in-landing-page/MyList";

function App() {
	const isloggedIn = useSelector(
		(state: RootState) => state.loginSetter.isLoggedIn
	);

	const mainScreenRef = useRef<HTMLElement>(null);
	const dispatch = useDispatch();
	const [authReady, setAuthReady] = useState(false);

	// Firebase persists the session across reloads; mirror it into Redux so a
	// refresh doesn't drop the user back to the marketing page.
	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			dispatch(user ? setTrue() : setFalse());
			setAuthReady(true);
		});
	}, [dispatch]);

	// Hold rendering until the session is known to avoid flashing the wrong page
	if (!authReady) return <div className="App" />;

	return (
		<div className="App">
			<a href="#main" className="skipLink">Skip to content</a>
			<Switch>
				{/* LANDING PAGE */}
				<Route exact path={"/"}>
					{!isloggedIn ? (
						<div className="landingPage">
							<Header mainScreenRef={mainScreenRef} />

							<main id="main" ref={mainScreenRef}>
								<HeroSection></HeroSection>

								<Favorites></Favorites>

								<Features></Features>

								<Pricing></Pricing>

								<Questions></Questions>

								<Footer></Footer>
							</main>
						</div>
					) : (
						<SignedInLandingPage />
					)}
				</Route>

				{/* SEARCH PAGE */}
				<Route path={"/Search"} component={Search} />

				{/* MY LIST */}
				<Route path={"/MyList"} component={MyList} />

				{/* MOVIES AND SERIES PAGES */}
				<Route path={["/Movies", "/Series"]}>
					<Switch>
						<Route path={"/Movies"} component={Movies} />
						<Route path={"/Series"} component={Series} />
					</Switch>
				</Route>

				{/* DETAILS PAGE */}
				<Route path={"/Details/:type/:id"} component={Details} />

				{/* AUTHENTICATION PAGES */}
				<Route path={["/RegistrationPage", "/LoginPage", "/ResetPassword"]}>
					<main id="main" className="authenticationPages">
						<div
							className="absolute inset-0 top-0 left-0 z-0 w-full h-full bg-cover "
							style={{
								backgroundImage: 'url("/heroSection-bg.jpg")',
								backgroundSize: "cover",
							}}
						></div>
						<Switch>
							<Route path={"/RegistrationPage"}>
								<RegistrationPage />
							</Route>
							<Route path={"/LoginPage"} component={LoginPage} />
							<Route path={"/ResetPassword"} component={ResetPassword} />
						</Switch>
					</main>
				</Route>
			</Switch>

			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				newestOnTop={true}
				theme="dark"
			/>
		</div>
	);
}

export default App;
