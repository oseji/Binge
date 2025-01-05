import { useRef } from "react";

import Header from "../landing-page/Header";
import MovieCategories from "../signed-in-landing-page/MovieCategories";

const Series = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Header mainScreenRef={mainScreenRef} />

      <div ref={mainScreenRef} className=" pt-10 md:pt-20">
        <MovieCategories />
      </div>
    </div>
  );
};

export default Series;
