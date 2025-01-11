import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import Header from "../landing-page/Header";
import SignedInHeader from "../signed-in-landing-page/SignedInHeader";
import MediaCategories from "./MediaCategories";

const Movies = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSetter.isLoggedIn
  );

  const information = {
    url: "https://api.themoviedb.org/3/movie/",
    categories: ["now_playing", "popular", "top_rated", "upcoming"],
    titles: ["now playing", "popular", "top rated", "upcoming"],
  };

  return (
    <div>
      {isLoggedIn ? (
        <SignedInHeader mainScreenRef={mainScreenRef} />
      ) : (
        <Header mainScreenRef={mainScreenRef} />
      )}

      <div
        ref={mainScreenRef}
        className={`${isLoggedIn ? "" : "pt-10 md:pt-20"}`}
      >
        <MediaCategories information={information} />
      </div>
    </div>
  );
};

export default Movies;
