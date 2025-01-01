import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import { auth } from "../firebase-config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { CircularProgress } from "@mui/material";

import BingeLogo from "../assets/registration logo.svg";
import googleIcon from "../assets/Google.svg";
import backArrow from "../assets/back.svg";
import { loading, notLoading } from "../redux/loadingState";
import { setFalse, setTrue } from "../redux/loginState";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const history = useHistory();

  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: RootState) => state.loadingSetter.isLoading
  );

  const signIn = async () => {
    dispatch(loading());

    try {
      await signInWithEmailAndPassword(auth, email, password);

      dispatch(setTrue());

      history.push("/");

      console.log("signed in successfully");
    } catch (err: any) {
      setError(err);
      if (err) {
        dispatch(setFalse());
        console.log(error);
      }
    } finally {
      dispatch(notLoading());
    }
  };

  return (
    <form className="authenticationForm">
      <Link to={"/"}>
        <img src={backArrow} alt="back arrow" className=" pt-8" />
      </Link>
      <div className=" flex flex-col items-center mb-4">
        <img src={BingeLogo} alt="Binge Logo" className=" h-10" />
        <p className=" text-xl font-bold">Welcome back to Binge</p>
      </div>

      <div className=" flex flex-col gap-3 items-center text-sm">
        <div className="inputGrp">
          <label htmlFor="loginName">Name</label>
          <input
            type="text"
            name="loginName"
            id="loginName"
            placeholder="Imelda Leo"
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="emailAddressLogin">email address</label>
          <input
            type="email"
            inputMode="email"
            name="emailAddressLogin"
            id="emailAddressLogin"
            placeholder="ImeldaLeo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="passwordLogin">password</label>
          <input
            type="text"
            name="passwordLogin"
            id="passwordLogin"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Link
          to={"/ResetPassword"}
          className=" text-[#9B51E0] underline mr-auto"
        >
          Forgot Password?
        </Link>

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

              signIn();
            }}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={"1.2rem"} />
            ) : (
              " SIGN IN"
            )}
          </button>
        </div>

        <p className=" text-[#98A2B3] mt-5">
          Don't have an account ?
          <Link to={"/RegistrationPage"}>
            <span className=" text-[#9B51E0] underline cursor-pointer">
              Sign up here
            </span>
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
