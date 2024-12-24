import { SyntheticEvent, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";

import downArrow from "../assets/down-arrow.svg";

gsap.registerPlugin(ScrollTrigger);

const Questions = () => {
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLImageElement | null)[]>([]);
  const headingRef = useRef(null);

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
    if (headingRef.current) {
      const text = new SplitType(headingRef.current, { types: "chars,words" });

      const tl = gsap.timeline();

      tl.fromTo(
        text.chars,
        { y: 50 },
        {
          y: 0,
          stagger: 1,
          duration: 1,

          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 35%",
            scrub: 3,
          },
        }
      );
    }
  }, []);

  return (
    <div className="questionsSection">
      <h1 className="sectionHeading" ref={headingRef}>
        Questions?
      </h1>
      <p className="sectionSubHeading mb-3 md:mb-0">We've got Answers</p>

      <div>
        <div className="questionGrp">
          <div className="questionBox" data-value={0} onClick={toggleAnswer}>
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              ref={(el) => (arrowRefs.current[0] = el)}
            />
          </div>

          <p
            className="answer hideFaq"
            ref={(el) => (answerRefs.current[0] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox" data-value={1} onClick={toggleAnswer}>
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              ref={(el) => (arrowRefs.current[1] = el)}
            />
          </div>

          <p
            className="answer hideFaq"
            ref={(el) => (answerRefs.current[1] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox" data-value={2} onClick={toggleAnswer}>
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              ref={(el) => (arrowRefs.current[2] = el)}
            />
          </div>

          <p
            className="answer hideFaq"
            ref={(el) => (answerRefs.current[2] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox" data-value={3} onClick={toggleAnswer}>
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              ref={(el) => (arrowRefs.current[3] = el)}
            />
          </div>

          <p
            className="answer hideFaq"
            ref={(el) => (answerRefs.current[3] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox" data-value={4} onClick={toggleAnswer}>
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              ref={(el) => (arrowRefs.current[4] = el)}
            />
          </div>

          <p
            className="answer hideFaq"
            ref={(el) => (answerRefs.current[4] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Questions;
