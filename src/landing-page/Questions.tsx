import { SyntheticEvent, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";

import downArrow from "../assets/down-arrow.svg";

gsap.registerPlugin(ScrollTrigger);

const Questions = () => {
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const headingRef = useRef(null);

  const toggleAnswer = (e: SyntheticEvent<HTMLImageElement>) => {
    const clicked = Number(e.currentTarget.getAttribute("data-value"));

    answerRefs.current.forEach((element, index) => {
      if (element) {
        if (clicked === index) {
          element.classList.toggle("hidden");
        } else {
          element.classList.add("hidden");
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
        { scale: 0.2, opacity: 0, y: -20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 1,
          duration: 1,

          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 2,
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
      <p className="sectionSubHeading">We've got Answers</p>

      <div>
        <div className="questionGrp">
          <div className="questionBox">
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              data-value={0}
              onClick={toggleAnswer}
            />
          </div>

          <p
            className="answer hidden"
            ref={(el) => (answerRefs.current[0] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox">
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              data-value={1}
              onClick={toggleAnswer}
            />
          </div>

          <p
            className="answer hidden"
            ref={(el) => (answerRefs.current[1] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox">
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              data-value={2}
              onClick={toggleAnswer}
            />
          </div>

          <p
            className="answer hidden"
            ref={(el) => (answerRefs.current[2] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox">
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              data-value={3}
              onClick={toggleAnswer}
            />
          </div>

          <p
            className="answer hidden"
            ref={(el) => (answerRefs.current[3] = el)}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe,
            laudantium consectetur obcaecati, praesentium nemo nesciunt
            provident eveniet optio suscipit, nulla alias. Ipsum, id laboriosam.
            Laboriosam eius autem dolores hic laudantium.
          </p>
        </div>

        <div className="questionGrp">
          <div className="questionBox">
            <p>How does Binge Premium work?</p>
            <img
              src={downArrow}
              alt="arrow"
              data-value={4}
              onClick={toggleAnswer}
            />
          </div>

          <p
            className="answer hidden"
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
