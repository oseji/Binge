import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDocumentTitle } from "../hooks/useMotion";
import HeroSection from "./HeroSection";
import NoteTeaser from "./NoteTeaser";
import Pricing from "./Pricing";
import Programme from "./Programme";
import Questions from "./Questions";

export default function Landing() {
  useDocumentTitle();
  return (
    <>
      <Header overlay />
      <main id="main">
        <HeroSection />
        <Programme />
        <NoteTeaser />
        <Pricing />
        <Questions />
      </main>
      <Footer />
    </>
  );
}
