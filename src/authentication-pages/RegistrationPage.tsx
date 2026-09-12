import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setTrue, setFalse } from "../redux/loginState";
import { loading, notLoading } from "../redux/loadingState";
import { RootState } from "../redux/store";

import { auth, googleProvider } from "../firebase-config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { errorMessageCleanUp } from "./LoginPage";

import { CircularProgress } from "@mui/material";

import BingeLogo from "../assets/registration logo.svg";
import googleIcon from "../assets/Google.svg";
import backArrow from "../assets/back.svg";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const RegistrationPage = () => {
  const history = useHistory();
  const isLoading = useSelector(
    (state: RootState) => state.loadingSetter.isLoading
  );

  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const confirmMismatch = confirmPassword !== "" && confirmPassword !== password;

  const createAccount = async () => {
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("passwords do not match");
      return;
    }

    dispatch(loading());

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setTrue());
      history.push("/");
    } catch (err: any) {
      dispatch(setFalse());
      setErrorMessage(errorMessageCleanUp(err.message));
    } finally {
      dispatch(notLoading());
    }
  };

  const signUpWithGoogle = async () => {
    setErrorMessage("");
    dispatch(loading());

    try {
      await signInWithPopup(auth, googleProvider);
      dispatch(setTrue());
      history.push("/");
    } catch (err: any) {
      dispatch(setFalse());
      setErrorMessage(errorMessageCleanUp(err.message));
    } finally {
      dispatch(notLoading());
    }
  };

  return (
    <form
      className="authenticationForm"
      onSubmit={(e) => {
        e.preventDefault();
        createAccount();
      }}
    >
      <Link to={"/"} aria-label="Back to home" className="inline-flex items-center justify-center w-11 h-11 mt-4 -ml-3 rounded-full hover:bg-white/5">
        <img src={backArrow} alt="" />
      </Link>

      <div className="flex flex-col items-center mb-7">
        <img src={BingeLogo} alt="Binge Logo" className="h-10" />
        <h1 className="text-xl font-bold mt-2 text-white">Create an Account</h1>
        <p className="text-xs text-fg-muted mt-1">Join Binge today — it's free</p>
      </div>

      <div className="flex flex-col gap-3 items-center text-sm">
        <div className="inputGrp">
          <label htmlFor="emailAddress">email address</label>
          <input
            type="email"
            inputMode="email"
            name="emailAddress"
            id="emailAddress"
            placeholder="SandyB@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=""
          />
        </div>

        <div className="inputGrp">
          <label htmlFor="password">password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-12 w-full"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-fg-subtle hover:text-fg"
            >
              {showPassword ? <EyeClosed /> : <EyeOpen />}
            </button>
          </div>
        </div>

        <div className="inputGrp">
          <label htmlFor="confirmPassword">confirm password</label>
          <div className="relative w-full">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Repeat your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={confirmMismatch}
              aria-describedby={confirmMismatch ? "confirmPasswordError" : undefined}
              className={`pr-12 w-full ${confirmMismatch ? "!border-red-400" : ""}`}
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-fg-subtle hover:text-fg"
            >
              {showConfirm ? <EyeClosed /> : <EyeOpen />}
            </button>
          </div>
          {confirmMismatch && (
            <p id="confirmPasswordError" className="text-red-400 text-xs">Passwords do not match</p>
          )}
        </div>

        {errorMessage && (
          <div role="alert" className="w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 font-medium capitalize text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-row items-center justify-center gap-4 py-2 w-full md:w-10/12">
          <div className="flex-1 h-px bg-line"></div>
          <span className="text-fg-subtle text-xs font-semibold uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-line"></div>
        </div>

        <div className="flex flex-col gap-3 items-center w-full">
          <button
            type="button"
            className="py-3 w-full md:w-10/12 flex justify-center items-center gap-3 border border-line text-fg-muted rounded-xl hover:border-line-strong hover:text-fg transition-all duration-200 text-sm bg-white/5 hover:bg-white/5"
            onClick={signUpWithGoogle}
            disabled={isLoading}
          >
            <img src={googleIcon} alt="" className="h-4" />
            <span>Continue with Google</span>
          </button>

          <button
            type="submit"
            className="py-3 w-full md:w-10/12 mx-auto block text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 text-sm"
            style={{ background: "linear-gradient(135deg, #9B51E0 0%, #7B3FC0 100%)" }}
            id="completeRegistrationBtn"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress aria-label="Loading" color="inherit" size={"1.1rem"} />
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <p className="text-fg-muted text-sm mt-4 mb-2">
          Already have an account?{" "}
          <Link to={"/LoginPage"}>
            <span className="text-accent-text hover:text-purple-300 transition-colors cursor-pointer">
              Sign in
            </span>
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationPage;
