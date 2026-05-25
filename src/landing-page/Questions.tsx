import { SyntheticEvent, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import downArrow from "../assets/down-arrow.svg";

gsap.registerPlugin(ScrollTrigger);

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
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLImageElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAnswer = (e: SyntheticEvent<HTMLDivElement>) => {
    const clicked = Number(e.currentTarget.getAttribute("data-value"));

    answerRefs.current.forEach((element, index) => {
      if (element) {
        if (clicked === index) {
          element.classList.toggle("hideFaq");
        } else {
          element.classList.add("hideFaq");
        }
      }
    });

    arrowRefs.current.forEach((element, index) => {
      if (element) {
        if (clicked === index) {
          element.classList.toggle("rotate-180");
        } else {
          element.classList.remove("rotate-180");
        }
      }
    });
  };

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
    });

    tl.fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5")
      .fromTo(
        faqItemsRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power3.out" },
        "-=0.3"
      );
  }, []);

  return (
    <div className="questionsSection">
      <h1 className="sectionHeading" ref={headingRef}>
        Common{" "}
        <span className="text-gradient">Questions</span>
      </h1>
      <p className="sectionSubHeading mb-8" ref={subRef}>Everything you need to know about Binge.</p>

      <div>
        {faqs.map((faq, index) => (
          <div className="questionGrp" key={index} ref={(el) => (faqItemsRef.current[index] = el)}>
            <div className="questionBox" data-value={index} onClick={toggleAnswer}>
              <p>{faq.q}</p>
              <img
                src={downArrow}
                alt="toggle"
                ref={(el) => (arrowRefs.current[index] = el)}
              />
            </div>
            <p
              className="answer hideFaq"
              ref={(el) => (answerRefs.current[index] = el)}
            >
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
