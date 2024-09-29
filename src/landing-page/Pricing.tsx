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
          <div
            className={`pricingCard ${
              index === 0
                ? "outline-[#F2994A] text-[#F2994A]"
                : index === 1
                ? "outline-[#9B51E0] text-[#9B51E0]"
                : "outline-[#B42318] text-[#B42318]"
            }`}
            key={index}
          >
            <div className=" flex flex-col items-start gap-5">
              <h1 className="pricingName" key={index}>
                {element.heading}
              </h1>

              <h3 className=" text-white">
                ₦{" "}
                <span className=" text-4xl font-bold">
                  {element.price.toLocaleString()}
                </span>
                /month
              </h3>

              <p className=" text-white">
                Lorem ipsum dolor sit amet consectetur. Iaculis quam rhoncus
                scelerisque .
              </p>
            </div>

            <button
              className={`pricingBtn ${
                index === 0
                  ? " outline outline-[#F2994A] text-[#F2994A]"
                  : index === 1
                  ? "bg-[#9B51E0] text-white"
                  : "bg-[#B42318] text-white"
              }`}
            >
              Free 7-days Trial
            </button>

            <div>
              <h3 className=" mb-3">Core Features</h3>

              <div className="checkBoxGrp">
                <img
                  src={
                    index === 0
                      ? proCheckbox
                      : index === 1
                      ? premiumCheckbox
                      : orgCheckbox
                  }
                  alt="checkbox"
                />
                <p>Rich Member Profile</p>
              </div>

              <div className="checkBoxGrp">
                <img
                  src={
                    index === 0
                      ? proCheckbox
                      : index === 1
                      ? premiumCheckbox
                      : orgCheckbox
                  }
                  alt="checkbox"
                />
                <p>Rich Member Profile</p>
              </div>

              <div className="checkBoxGrp">
                <img
                  src={
                    index === 0
                      ? proCheckbox
                      : index === 1
                      ? premiumCheckbox
                      : orgCheckbox
                  }
                  alt="checkbox"
                />
                <p>Rich Member Profile</p>
              </div>

              <div className="checkBoxGrp">
                <img
                  src={
                    index === 0
                      ? proCheckbox
                      : index === 1
                      ? premiumCheckbox
                      : orgCheckbox
                  }
                  alt="checkbox"
                />
                <p>Rich Member Profile</p>
              </div>

              <div className="checkBoxGrp">
                <img
                  src={
                    index === 0
                      ? proCheckbox
                      : index === 1
                      ? premiumCheckbox
                      : orgCheckbox
                  }
                  alt="checkbox"
                />
                <p>Rich Member Profile</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
