import { useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

import downArrow from "../assets/down-arrow.svg";

const faqs = [
  {
    q: "How does Binge work?",
    a: "Binge is a media discovery platform that lets you search, explore, and track thousands of movies and TV series. Find what to watch next, browse trailers and details, and keep a watchlist, all in one place.",
  },
  {
    q: "Is Binge free?",
    a: "Yes, all of it. Browsing, search and trailers work without an account, and a free account adds your watchlist. The pricing section is a design concept only; there is nothing to pay.",
  },
  {
    q: "Can I save movies and shows I want to watch?",
    a: "Absolutely. You can add any title to your personal list with a single tap. Your list is saved to your account so you can access it from any device, so you never lose track of something you wanted to watch.",
  },
  {
    q: "What information does Binge show for each title?",
    a: "Each title page includes the synopsis, genres, runtime or season count, country and language, plus the official trailer. People pages show a biography and where they were born.",
  },
  {
    q: "Where does the data come from?",
    a: "Titles, artwork and details come from The Movie Database (TMDB) and trailers are played from YouTube. Binge uses the TMDB API but is not endorsed or certified by TMDB.",
  },
];

const Questions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useReveal({ heading: headingRef, sub: subRef, items: faqItemsRef, from: { x: -40, opacity: 0 } });

  return (
    <section id="faq" className="questionsSection">
      <h2 className="sectionHeading" ref={headingRef}>
        Common{" "}
        <span className="text-gradient">Questions</span>
      </h2>
      <p className="sectionSubHeading mb-8" ref={subRef}>Everything you need to know about Binge.</p>

      <div>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const questionId = `faq-question-${index}`;
          const answerId = `faq-answer-${index}`;
          return (
            <div className="questionGrp" key={index} ref={(el) => (faqItemsRef.current[index] = el)}>
              <h3>
                <button
                  type="button"
                  id={questionId}
                  className="questionBox"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.q}</span>
                  <img
                    src={downArrow}
                    alt=""
                    className={isOpen ? "rotate-180" : ""}
                  />
                </button>
              </h3>
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={`answer ${isOpen ? "" : "hideFaq"}`}
              >
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Questions;
