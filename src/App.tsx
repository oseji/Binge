import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useWatchlist } from "./hooks/useWatchlist";
import Landing from "./landing-page/Landing";
import Details from "./movies-series/Details";
import Movies from "./movies-series/Movies";
import Search from "./movies-series/Search";
import Series from "./movies-series/Series";
import NotFound from "./NotFound";
import MyList from "./signed-in-landing-page/MyList";
import SignedInLandingPage from "./signed-in-landing-page/SignedInLandingPage";

// Auth screens are rarely visited and never part of a poster transition, so they load on demand
const LoginPage = lazy(() => import("./authentication-pages/LoginPage"));
const RegistrationPage = lazy(() => import("./authentication-pages/RegistrationPage"));
const ResetPassword = lazy(() => import("./authentication-pages/ResetPassword"));

export default function App() {
  const { user, authReady } = useWatchlist();

  // Hold the first paint until Firebase knows who this is, so the wrong home never flashes
  if (!authReady) return <div className="min-h-[100svh] bg-ink-0" />;

  return (
    <>
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <Suspense fallback={<div className="min-h-[100svh] bg-ink-0" />}>
        <Switch>
          <Route exact path="/">
            {user ? <SignedInLandingPage /> : <Landing />}
          </Route>
          <Route path="/Movies" component={Movies} />
          <Route path="/Series" component={Series} />
          <Route path="/Search" component={Search} />
          <Route path="/MyList" component={MyList} />
          <Route path="/Details/:type/:id" component={Details} />
          <Route path="/LoginPage" component={LoginPage} />
          <Route path="/RegistrationPage" component={RegistrationPage} />
          <Route path="/ResetPassword" component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>

      <ToastContainer position="bottom-center" autoClose={2600} hideProgressBar closeOnClick pauseOnFocusLoss pauseOnHover newestOnTop theme="dark" />
    </>
  );
}
