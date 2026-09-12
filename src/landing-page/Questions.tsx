import { useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

import downArrow from "../assets/down-arrow.svg";

const faqs = [
  {
    q: "How does Binge work?",
    a: "Binge is a media discovery platform that lets you search, explore, and track thousands of movies and TV series. Find what to watch next, browse trailers, ratings, and cast info — all in one place.",
  },
  {
    q: "Can I try Binge for free?",
    a: "Yes! We offer a 7-day free trial on all plans. You won't be charged until your trial ends, and you can cancel at any time before then — no questions asked.",
  },
  {
    q: "Can I save movies and shows I want to watch?",
    a: "Absolutely. You can add any title to your personal list with a single tap. Your list is saved to your account so you can access it from any device — never lose track of something you wanted to watch.",
  },
  {
    q: "What information does Binge show for each title?",
    a: "Each title page includes the synopsis, cast and crew, genre tags, ratings, release info, and an official trailer so you can get a real feel for a movie or show before committing to it.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel your Binge subscription anytime from your account settings — no phone calls, no hassle. If you cancel, you'll still have access until the end of your current billing period.",
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
