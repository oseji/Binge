import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Icon from "./components/Icon";
import { useDocumentTitle } from "./hooks/useMotion";

type Props = { what?: "page" | "title" | "person" };

const COPY = {
  page: { heading: "This reel is missing", body: "There's no page at this address. It may have moved, or the link was mistyped." },
  title: { heading: "No such title", body: "TMDB doesn't have a film or series with this ID. It may have been removed or merged." },
  person: { heading: "No such person", body: "TMDB doesn't have anyone with this ID. They may have been merged with another entry." },
};

export default function NotFound({ what = "page" }: Props) {
  const copy = COPY[what];
  useDocumentTitle(copy.heading);
  return (
    <>
      <Header />
      <main id="main" className="wrap min-h-[78svh] flex flex-col justify-end pt-32 pb-10">
        <h1 className="t-display max-w-[12ch]">{copy.heading}</h1>
        <p className="t-lede mt-6 max-w-[48ch]">{copy.body}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/Search" className="btn btn-signal">
            <Icon name="search" size={18} /> Search Binge
          </Link>
          <Link to="/" className="btn btn-ghost">
            Back to the programme
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
