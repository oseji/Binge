import { SyntheticEvent, useRef } from "react";

import downArrow from "../assets/down-arrow.svg";

const Questions = () => {
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const toggleAnswer = (e: SyntheticEvent<HTMLImageElement>) => {
    const clicked = Number(e.currentTarget.getAttribute("data-value"));

    answerRefs.current.forEach((element, index) => {
      if (element) {
        if (clicked === index) {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      }
    });

    console.log(clicked);
  };

  return (
    <div className="questionsSection">
      <h1 className="sectionHeading">Questions?</h1>
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
