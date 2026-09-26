import Browse, { BrowseConfig } from "./Browse";

const config: BrowseConfig = {
  type: "movie",
  label: "Movies",
  heroFrom: "popular",
  strands: [
    { key: "now_playing", title: "In cinemas now", blurb: "On big screens this week." },
    { key: "popular", title: "Popular right now", blurb: "What people are looking up on TMDB today." },
    { key: "top_rated", title: "Top rated", blurb: "The highest-scoring films with enough votes to mean it." },
    { key: "upcoming", title: "Coming soon", blurb: "Dated releases on their way to cinemas." },
  ],
};

export default function Movies() {
  return <Browse config={config} />;
}
