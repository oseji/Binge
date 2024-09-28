import downArrow from "../assets/down-arrow.svg";

const Questions = () => {
  return (
    <div className="questionsSection">
      <h1 className="sectionHeading">Questions?</h1>
      <p className="sectionSubHeading">We've got Answers</p>

      <div>
        <div className="questionBox">
          <p>How does Binge Premium work?</p>
          <img src={downArrow} alt="arrow" />
        </div>

        <div className="questionBox">
          <p>How does Binge Premium work?</p>
          <img src={downArrow} alt="arrow" />
        </div>

        <div className="questionBox">
          <p>How does Binge Premium work?</p>
          <img src={downArrow} alt="arrow" />
        </div>

        <div className="questionBox">
          <p>How does Binge Premium work?</p>
          <img src={downArrow} alt="arrow" />
        </div>

        <div className="questionBox">
          <p>How does Binge Premium work?</p>
          <img src={downArrow} alt="arrow" />
        </div>
      </div>
    </div>
  );
};

export default Questions;
