import { Link } from "react-router-dom";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config/firebase";
import { errorMessageCleanUp } from "./LoginPage";
import { CircularProgress } from "@mui/material";

import backArrow from "../assets/back.svg";
import BingeLogo from "../assets/registration logo.svg";

const ResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      setErrorMessage(errorMessageCleanUp(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="resetPasswordForm" onSubmit={handleReset}>
      <Link to={"/LoginPage"} className="block mt-8 w-fit">
        <img src={backArrow} alt="back arrow" />
      </Link>
      <div className="flex flex-col items-center mb-7">
        <img src={BingeLogo} alt="Binge Logo" className="h-10" />
        <p className="text-xl font-bold mt-2 text-white">Reset your password</p>
        <p className="text-white/40 text-center text-sm mt-1 leading-relaxed">
          Enter your email and we'll send you reset instructions.
        </p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="text-center font-semibold text-white">Email sent!</p>
          <p className="text-center text-sm text-white/40 leading-relaxed">
            Check{" "}
            <span className="font-medium text-white/70">{email}</span>
            {" "}for reset instructions.
          </p>
          <Link to={"/LoginPage"} className="text-[#9B51E0] hover:text-purple-400 transition-colors text-sm mt-1">
            Back to login
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center text-sm">
          <div className="inputGrp">
            <label htmlFor="resetEmailAddress">email address</label>
            <input
              type="email"
              inputMode="email"
              name="resetEmailAddress"
              id="resetEmailAddress"
              placeholder="ImeldaLeo@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-purple-500"
            />
          </div>

          {errorMessage && (
            <div className="w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 font-medium capitalize text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            className="py-3 w-full text-white font-semibold rounded-xl transition-all duration-200 mt-4 disabled:opacity-50 text-sm"
            style={{ background: "linear-gradient(135deg, #9B51E0 0%, #7B3FC0 100%)" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={"1.2rem"} />
            ) : (
              "Send reset instructions"
            )}
          </button>
        </div>
      )}
    </form>
  );
};

export default ResetPassword;
