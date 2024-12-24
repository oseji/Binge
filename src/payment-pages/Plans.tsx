import proCheckbox from "../assets/pro-checkbox.png";
import premiumCheckbox from "../assets/premium-checkbox.png";
import orgCheckbox from "../assets/org-checkbox.png";
import backArrow from "../assets/back.svg";
import { Link } from "react-router-dom";

type pricingType = {
  heading: string;
  price: number;
  color: string;
}[];

const Plans = () => {
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
    <div className="paymentModal h-fit max-h-[90dvh]">
      <div className=" flex flex-row items-center w-full">
        <Link to={"/"}>
          <img src={backArrow} alt="back arrow" />
        </Link>

        <h1 className=" text-center font-bold text-3xl w-full capitalize">
          Choose your plan
        </h1>
      </div>

      <div className="paymentPricingGrp">
        {pricingObject.map((element, index) => (
          <div
            className={` text-sm outline text-black ${
              index === 0
                ? "outline-[#F2994A] text-[#F2994A]"
                : index === 1
                ? "outline-[#9B51E0] text-[#9B51E0]"
                : "outline-[#B42318] text-[#B42318]"
            }`}
            key={index}
          >
            {index === 0 ? (
              <div className=" p-2 mb-6"></div>
            ) : index === 1 ? (
              <div className=" text-center font-semibold p-2 bg-[#9B51E0] text-black">
                Most Popular
              </div>
            ) : index === 2 ? (
              <div className=" text-center font-semibold p-2 bg-[#B42318]">
                Best Deals
              </div>
            ) : null}

            <div className=" flex flex-col justify-between gap-3 p-8">
              <div className=" flex flex-col items-start gap-5">
                <h1 className=" font-bold text-2xl" key={index}>
                  {element.heading}
                </h1>

                <h3>
                  ₦{" "}
                  <span className=" text-2xl font-bold">
                    {element.price.toLocaleString()}
                  </span>
                  /month
                </h3>

                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur. Iaculis quam rhoncus
                  scelerisque .
                </p>
              </div>

              <Link to={"/PaymentOption"}>
                <button
                  className={` w-full rounded py-5 ${
                    index === 0
                      ? " outline outline-[#F2994A] text-[#F2994A]"
                      : index === 1
                      ? "bg-[#9B51E0] text-white"
                      : "bg-[#B42318] text-white"
                  }`}
                >
                  Free 7-days Trial
                </button>
              </Link>

              <div>
                <h3
                  className={` mb-1.5 font-semibold ${
                    index === 0
                      ? " text-[#F2994A]"
                      : index === 1
                      ? "text-[#9B51E0]"
                      : "text-[#B42318]"
                  }`}
                >
                  Core Features
                </h3>

                <div className="checkBoxGrpPayment">
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

                <div className="checkBoxGrpPayment">
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

                <div className="checkBoxGrpPayment">
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

                <div className="checkBoxGrpPayment">
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

                <div className="checkBoxGrpPayment">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
