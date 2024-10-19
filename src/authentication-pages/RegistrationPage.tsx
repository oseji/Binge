import BingeLogo from "../assets/registration logo.svg";
import googleIcon from "../assets/Google.svg";

const RegistrationPage = () => {
  return (
    <section id="registrationPage">
      <div
        className=" absolute h-full w-full top-0 left-0 bg-cover z-0 inset-0"
        style={{
          backgroundImage: 'url("/heroSection-bg.jpg")',
          backgroundSize: "cover",
        }}
      ></div>

      <form className="registrationForm">
        <div className=" flex flex-col items-center mb-4">
          <img src={BingeLogo} alt="Binge Logo" className=" h-10" />
          <p className=" text-xl font-bold">Create an Account</p>
        </div>

        <div className=" flex flex-col gap-3 items-center text-sm">
          <div className="inputGrp">
            <label htmlFor="firstName">first name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Sandra"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="lastName">last name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Bloyd"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="phoneNumber">phone number</label>
            <input
              type="number"
              inputMode="tel"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="+234 7024341178"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="emailAddress">email address</label>
            <input
              type="email"
              inputMode="email"
              name="emailAddress"
              id="emailAddress"
              placeholder="SandyB@gmail.com"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="password">password</label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Sandra"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="confirmPassword">confirm password</label>
            <input
              type="text"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Sandra"
            />
          </div>

          <div className=" flex flex-row items-center justify-center gap-5 w-full md:w-10/12 p-5">
            <div className=" w-10/12 p-[0.5px] bg-[#98A2B3]"></div>
            <span className=" text-[#98A2B3] font-bold">OR</span>
            <div className=" w-10/12 p-[0.5px] bg-[#98A2B3]"></div>
          </div>

          {/* BUTTONS */}
          <div className=" flex flex-col gap-3 items-center w-full">
            <button
              className=" py-3.5 w-full md:w-10/12 flex flex-row justify-center items-center gap-3 border-2 border-[#98A2B3] text-[#98A2B3] rounded hover:scale-105 transition ease-in-out duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <img src={googleIcon} alt="Google Icon" />
              <span> Sign in with Google</span>
            </button>

            <button
              className=" py-3.5 w-full md:w-10/12 bg-[#9B51E0] text-white font-semibold rounded hover:scale-105 transition ease-in-out duration-200"
              onClick={(e) => e.preventDefault()}
            >
              SIGN UP
            </button>
          </div>

          <p className=" text-[#98A2B3] mt-5">
            Already have an account ?
            <span className=" text-[#9B51E0] underline cursor-pointer">
              {" "}
              Log in here
            </span>
          </p>
        </div>
      </form>
    </section>
  );
};

export default RegistrationPage;
