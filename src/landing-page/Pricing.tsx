import proCheckbox from "../assets/pro-checkbox.png";
import premiumCheckbox from "../assets/premium-checkbox.png";
import orgCheckbox from "../assets/org-checkbox.png";

type pricingType = {
  heading: string;
  price: number;
  color: string;
}[];

const Pricing = () => {
  const pricingObject: pricingType = [
    {
      heading: "Professional",
      price: 3000,
      color: "#F2994A",
    },
    {
      heading: "Premium",
      price: 10000,
      color: "#9B51E0",
    },
    {
      heading: "Organizational",
      price: 5000,
      color: "#B42318",
    },
  ];

  return (
    <section className="pricingSection">
      <h1 className="sectionHeading">
        Affordable <span className=" text-[#9B51E0]">Plans</span> For You
      </h1>

      <p className="sectionSubHeading">
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="pricingGrp">
        {pricingObject.map((element, index) => (
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
        ))}
      </div>
    </section>
  );
};

export default Pricing;
