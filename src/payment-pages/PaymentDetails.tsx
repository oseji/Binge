import { Link } from "react-router-dom";

import paystackImg from "../assets/paystackImg.svg";
import cardIcon from "../assets/Featured card icon.svg";
import masterCardIcon from "../assets/Mastercard.svg";

import backArrow from "../assets/back.svg";

const PaymentDetails = () => {
  return (
    <div className=" h-fit max-h-[90dvh] absolute py-14 px-9 text-black bg-white w-11/12 md:w-3/4 xl:w-1/2 rounded-md overflow-y-auto">
      <div className=" flex flex-row items-center gap-5">
        <Link to={"/PaymentOption"}>
          <img src={backArrow} alt="back arrow" />
        </Link>

        <h1 className=" flex flex-row items-center capitalize font-bold  text-xl md:text-3xl">
          Pay with Paystack
          <span>
            <img src={paystackImg} alt="Paystack logo" />
          </span>
        </h1>
      </div>

      <div className=" flex flex-col gap-2 w-full mt-6">
        <label htmlFor="coutntries" className=" font-semibold">
          Country
        </label>

        <select
          name="countries"
          id="countries"
          className=" outline outline-gray-300 p-2 rounded-md bg-transparent text-black"
        >
          <option value="Seelct">Select</option>
        </select>
      </div>

      <img src={cardIcon} alt="card icon" className=" mt-10 mb-5" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h1 className=" text-xl font-semibold">Add payment method</h1>
        <p className=" text-gray-400">Add your card details</p>

        <div className=" mt-6 w-full">
          <div className=" w-full flex flex-row items-center gap-5">
            <div className=" paymentOptionInputGrp w-[70%]">
              <label htmlFor="cardName">Name on card</label>
              <input
                type="text"
                placeholder="Jane Doe"
                name="cardName"
                className=" w-full outline outline-gray-300 rounded-md mt-2 p-2"
              />
            </div>

            <div className=" paymentOptionInputGrp w-[30%]">
              <label htmlFor="expiryDate">Expiry</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="06/2024"
                name="expiryDate"
                className=" outline outline-gray-300 rounded-md mt-2 p-2"
              />
            </div>
          </div>

          <div className=" w-full flex flex-row items-center gap-5 mt-5">
            <div className=" paymentOptionInputGrp w-[70%]">
              <label htmlFor="cardNumber">Card number</label>
              <div className=" w-full flex flex-row items-center  outline outline-gray-300 rounded-md mt-2 p-2">
                <img src={masterCardIcon} alt="Mastercard logo" />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="1222 3342 6656 3359"
                  name="cardNumber"
                  className=" outline-none"
                />
              </div>
            </div>

            <div className=" paymentOptionInputGrp w-[30%]">
              <label htmlFor="cardName">CVV</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="***"
                className="outline outline-gray-300 rounded-md mt-2 p-2"
              />
            </div>
          </div>
        </div>

        <button className=" rounded-md w-full py-2 bg-[#9B51E0] text-white mt-12">
          Save and continue
        </button>

        <p className=" text-gray-400 text-sm mt-2">
          We’ll save your payment information for future purchases
        </p>
      </form>
    </div>
  );
};

export default PaymentDetails;
