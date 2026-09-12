import { useRef } from "react";

import Header from "../components/Header";
import MediaCategories from "./MediaCategories";

type Props = {
  /** Rendered inside another page (no header, no page title, no landmark) */
  embedded?: boolean;
};

const Series = ({ embedded = false }: Props) => {
  const mainScreenRef = useRef<HTMLElement>(null);

  const information = {
    type: "tv",
    url: "https://api.themoviedb.org/3/tv/",
    categories: ["airing_today", "on_the_air", "popular", "top_rated"],
    titles: ["airing today", "on the air", "popular", "top rated"],
  };

  if (embedded) {
    return <MediaCategories information={information} />;
  }

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <main id="main" ref={mainScreenRef} className="pt-4 md:pt-[68px]">
        <h1 className="px-5 md:px-10 pt-8 text-xl font-bold">Series</h1>
        <MediaCategories information={information} />
      </main>
    </div>
  );
};

export default Series;
