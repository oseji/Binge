import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import Header from "../landing-page/Header";
import MediaCategories from "./MediaCategories";

const Series = () => {
  const mainScreenRef = useRef<HTMLElement>(null);
  const isLoggedIn = useSelector(
    (state: RootState) => state.loginSetter.isLoggedIn
  );

  const information = {
    type: "tv",
    url: "https://api.themoviedb.org/3/tv/",
    categories: ["airing_today", "on_the_air", "popular", "top_rated"],
    titles: ["airing today", "on the air", "popular", "top rated"],
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
          <h1 className="px-5 md:px-10 pt-8 text-3xl font-bold">Series</h1>
        )}
        <MediaCategories information={information} />
      </main>
    </div>
  );
};

export default Series;
