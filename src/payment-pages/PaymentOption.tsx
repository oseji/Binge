import { Link } from "react-router-dom";

import backArrow from "../assets/back.svg";
import lockIcon from "../assets/lock.svg";
import paystackImg from "../assets/paystackImg.svg";
import flutterwaveImg from "../assets/flutterwave img.svg";
import downArrow from "../assets/down arrow.svg";

const PaymentOption = () => {
  return (
    <div className="paymentModal">
      <div className=" flex flex-row items-center gap-5 md:gap-0 w-full">
        <Link to={"/Plans"}>
          <img src={backArrow} alt="back arrow" />
        </Link>

        <h1 className=" text-start md:text-center font-bold text-xl md:text-3xl w-full capitalize">
          Choose how to pay
        </h1>
      </div>

      <p className=" text-start md:text-center text-gray-500 py-5 md:py-0">
        Your payment is encrypted and you can change how you pay at any time
      </p>

      <div className=" flex flex-col gap-3 mt-5">
        <div className=" flex flex-row items-center gap-3 ml-auto">
          <span className=" text-xs ">End-to-end encrypted</span>
          <img src={lockIcon} alt="lock icon" className=" h-4" />
        </div>

        <Link to={"/PaymentDetails"}>
          <div className="paymentOptionGrp">
            <div className=" flex flex-row items-center gap-2">
              <span>Paystack</span>
              <img src={paystackImg} alt="paystack icon" className=" h-5" />
            </div>

            <img src={downArrow} alt="down arror" />
          </div>
        </Link>

        <Link to={"/PaymentDetails"}>
          <div className="paymentOptionGrp mt-2">
            <div className=" flex flex-row items-center gap-2">
              <span>Flutterwave</span>
              <img
                src={flutterwaveImg}
                alt="flutterwave icon"
                className=" h-5"
              />
            </div>

            <img src={downArrow} alt="down arror" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PaymentOption;
