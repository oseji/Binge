import { useRef } from "react";

import Header from "../components/Header";
import MediaCategories from "./MediaCategories";

type Props = {
  /** Rendered inside another page (no header, no page title, no landmark) */
  embedded?: boolean;
};

const Movies = ({ embedded = false }: Props) => {
  const mainScreenRef = useRef<HTMLElement>(null);

  const information = {
    type: "movie",
    url: "https://api.themoviedb.org/3/movie/",
    categories: ["now_playing", "popular", "top_rated", "upcoming"],
    titles: ["now playing", "popular", "top rated", "upcoming"],
  };

  if (embedded) {
    return <MediaCategories information={information} />;
  }

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <main id="main" ref={mainScreenRef} className="pt-4 md:pt-[68px]">
        <h1 className="px-5 md:px-10 pt-8 text-xl font-bold">Movies</h1>
        <MediaCategories information={information} />
      </main>
    </div>
  );
};

export default Movies;
