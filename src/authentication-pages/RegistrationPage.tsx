import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setTrue, setFalse } from "../redux/loginState";
import { loading, notLoading } from "../redux/loadingState";

import { auth } from "../firebase-config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import BingeLogo from "../assets/registration logo.svg";
import googleIcon from "../assets/Google.svg";
import backArrow from "../assets/back.svg";

type props = {
  error: string;
  setError: (text: string) => void;
};

const RegistrationPage = (props: props) => {
  const history = useHistory();
  // const isLoading = useSelector(
  //   (state: RootState) => state.loadingSetter.isLoading
  // );

  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const createAccount = async () => {
    dispatch(loading());

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      dispatch(setTrue());
      setEmail("");
      setPassword("");

      console.log("signed up successfully");

      history.push("/");
    } catch (err: any) {
      props.setError(err);

      console.log(err);
      if (err) {
        dispatch(setFalse());
      }
    } finally {
      dispatch(notLoading());
    }
  };

  return (
    <form className="authenticationForm">
      <Link to={"/"} className=" w-fit mt-8 block">
        <img src={backArrow} alt="back arrow" />
      </Link>

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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="lastName">last name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Bloyd"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="password">password</label>
          <input
            type="text"
            name="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="confirmPassword">confirm password</label>
          <input
            type="text"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            className=" py-3.5 w-full md:w-10/12 mx-auto block bg-[#9B51E0] text-white font-semibold rounded hover:scale-105 transition ease-in-out duration-200"
            onClick={(e) => {
              e.preventDefault();

              createAccount();
            }}
          >
            SIGN UP
          </button>
        </div>

        <p className=" text-[#98A2B3] mt-5">
          Already have an account ?
          <Link to={"/LoginPage"}>
            <span className=" text-[#9B51E0] underline cursor-pointer">
              {" "}
              Log in here
            </span>
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationPage;
