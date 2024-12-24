import { Link } from "react-router-dom";
import backArrow from "../assets/back.svg";
import BingeLogo from "../assets/registration logo.svg";

const ResetPassword = () => {
  return (
    <form className="resetPasswordForm">
      <Link to={"/LoginPage"} className=" block mt-8 w-fit">
        <img src={backArrow} alt="back arrow" />
      </Link>
      <div className=" flex flex-col items-center mb-4">
        <img src={BingeLogo} alt="Binge Logo" className=" h-10" />
        <p className=" text-xl font-bold">Reset your password</p>
        <p className=" text-[#98A2B3] text-center text-sm">
          Enter your email below and we’ll send you instructions on how to reset
          your password.
        </p>
      </div>

      <div className=" flex flex-col gap-3 items-center text-sm">
        <div className="inputGrp">
          <label htmlFor="resetEmailAddress">email address</label>
          <input
            type="email"
            inputMode="email"
            name="resetEmailAddress"
            id="resetEmailAddress"
            placeholder="ImeldaLeo@gmail.com"
          />
        </div>

        <button
          className=" py-3.5 w-full bg-[#9B51E0] text-white font-semibold rounded hover:scale-105 transition ease-in-out duration-200 mt-7"
          onClick={(e) => e.preventDefault()}
        >
          Send reset instructions
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
