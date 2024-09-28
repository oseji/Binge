import proCheckbox from "../assets/pro-checkbox.png";
import premiumCheckbox from "../assets/premium-checkbox.png";
import orgCheckbox from "../assets/org-checkbox.png";

const Pricing = () => {
  return (
    <section className="pricingSection">
      <h1>Affordable Plans For You</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="pricingGrp">
        <div className="pricingCard">
          <h1 className="pricingName">Professional</h1>

          <h3 className="price">3,000</h3>

          <p>
            Lorem ipsum dolor sit amet consectetur. Iaculis quam rhoncus
            scelerisque .
          </p>

          <button className="pricingBtn">Free 7-days Trial</button>

          <h3>Core Features</h3>
          <div className="checkBoxGrp">
            <img src={proCheckbox} alt="checkbox" />
            <p>Rich Member Profile</p>
            <p>Rich Member Profile</p>
            <p>Rich Member Profile</p>
            <p>Rich Member Profile</p>
            <p>Rich Member Profile</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
