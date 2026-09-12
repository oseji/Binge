import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import Header from "../landing-page/Header";
import MediaCategories from "./MediaCategories";

const Movies = () => {
  const mainScreenRef = useRef<HTMLElement>(null);
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSetter.isLoggedIn
  );

  const information = {
    type: "movie",
    url: "https://api.themoviedb.org/3/movie/",
    categories: ["now_playing", "popular", "top_rated", "upcoming"],
    titles: ["now playing", "popular", "top rated", "upcoming"],
  };

  return (
    <div>
      {!isLoggedIn && <Header mainScreenRef={mainScreenRef} />}

      <main
        id="main"
        ref={mainScreenRef}
        className={`${isLoggedIn ? "" : "pt-10 md:pt-20"}`}
      >
        {!isLoggedIn && (
          <h1 className="px-5 md:px-10 pt-8 text-3xl font-bold">Movies</h1>
        )}
        <MediaCategories information={information} />
      </main>
    </div>
  );
};

export default Movies;
