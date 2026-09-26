import Browse, { BrowseConfig } from "./Browse";

const config: BrowseConfig = {
  type: "tv",
  label: "Series",
  heroFrom: "popular",
  strands: [
    { key: "airing_today", title: "Airing today", blurb: "New episodes out today." },
    { key: "on_the_air", title: "On air this week", blurb: "Shows with an episode in the next seven days." },
    { key: "popular", title: "Popular right now", blurb: "What people are looking up on TMDB today." },
    { key: "top_rated", title: "Top rated", blurb: "The highest-scoring series with enough votes to mean it." },
  ],
};

export default function Series() {
  return <Browse config={config} />;
}
