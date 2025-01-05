import { useRef } from "react";

import Header from "../landing-page/Header";
import SignedInHeader from "../signed-in-landing-page/SignedInHeader";
import MovieCategories from "../signed-in-landing-page/MovieCategories";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Movies = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSetter.isLoggedIn
  );

  return (
    <div>
      {isLoggedIn ? (
        <SignedInHeader mainScreenRef={mainScreenRef} />
      ) : (
        <Header mainScreenRef={mainScreenRef} />
      )}

      <div ref={mainScreenRef} className=" pt-10 md:pt-20">
        <MovieCategories />
      </div>
    </div>
  );
};

export default Movies;
