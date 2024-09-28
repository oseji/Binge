import feature1 from "../assets/feature1.png";
import feature2 from "../assets/feature2.png";
import feature3 from "../assets/feature3.png";

const Features = () => {
  return (
    <section className="featuresSection">
      <h1>Our Prominent Features</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="featuresGrp">
        <div className="featuresBox">
          <img src={feature1} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Access your Favourites Movies</h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>

        <div className="featuresBox">
          <img src={feature2} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Explore Watch Party </h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>

        <div className="featuresBox">
          <img src={feature3} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Convenient Payment Options</h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
