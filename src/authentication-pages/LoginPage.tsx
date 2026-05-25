import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

import { auth } from "../firebase-config/firebase";
// import { googleProvider } from "../firebase-config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import {signInWithPopup} from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { CircularProgress } from "@mui/material";

import BingeLogo from "../assets/registration logo.svg";
import googleIcon from "../assets/Google.svg";
import backArrow from "../assets/back.svg";
import { loading, notLoading } from "../redux/loadingState";
import { setFalse, setTrue } from "../redux/loginState";

export const errorMessageCleanUp = (text: string) => {
    return text
        .replace("Firebase: ", "")
        .replace("Error ", "")
        .replace("auth/", "")
        .replace("(", "")
        .replace(")", "")
        .replace(/-/g, " ");
};

const EyeOpen = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosed = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const LoginPage = () => {
    const [email, setEmail] = useState<string>("fake@gmail.com");
    const [password, setPassword] = useState<string>("fakepassword");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const history = useHistory();

    const dispatch = useDispatch();
    const isLoading = useSelector(
        (state: RootState) => state.loadingSetter.isLoading,
    );

    const signIn = async () => {
        setErrorMessage("");
        dispatch(loading());

        try {
            await signInWithEmailAndPassword(auth, email, password);
            dispatch(setTrue());
            history.push("/");
        } catch (err: any) {
            dispatch(setFalse());
            setErrorMessage(errorMessageCleanUp(err.message));
        } finally {
            dispatch(notLoading());
        }
    };

    // const signInWithGoogle = async () => {
    //     setErrorMessage("");
    //     dispatch(loading());

    //     try {
    //         await signInWithPopup(auth, googleProvider);
    //         dispatch(setTrue());
    //         history.push("/");
    //     } catch (err: any) {
    //         dispatch(setFalse());
    //         setErrorMessage(errorMessageCleanUp(err.message));
    //     } finally {
    //         dispatch(notLoading());
    //     }
    // };

    return (
        <form
            className="authenticationForm"
            onSubmit={(e) => {
                e.preventDefault();
                signIn();
            }}
        >
            <Link to={"/"}>
                <img src={backArrow} alt="back arrow" className="mt-8" />
            </Link>
            <div className="flex flex-col items-center mb-7">
                <img src={BingeLogo} alt="Binge Logo" className="h-10" />
                <p className="mt-2 text-xl font-bold text-white">
                    Welcome back to Binge
                </p>
                <p className="mt-1 text-xs text-white/40">
                    Sign in to your account
                </p>
            </div>

            <div className="flex flex-col items-center gap-3 text-sm">
                <div className="inputGrp">
                    <label htmlFor="emailAddressLogin">email address</label>
                    <input
                        type="email"
                        inputMode="email"
                        name="emailAddressLogin"
                        id="emailAddressLogin"
                        placeholder="ImeldaLeo@gmail.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:outline-purple-500"
                    />
                </div>

                <div className="inputGrp">
                    <label htmlFor="passwordLogin">password</label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="passwordLogin"
                            id="passwordLogin"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pr-10 focus:outline-purple-500"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? <EyeClosed /> : <EyeOpen />}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="w-full px-3 py-2 border rounded-xl bg-red-500/10 border-red-500/20">
                        <p className="text-sm font-medium text-red-400 capitalize">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <Link
                    to={"/ResetPassword"}
                    className="text-[#9B51E0] hover:text-purple-400 transition-colors text-sm mr-auto"
                >
                    Forgot password?
                </Link>

                <div className="flex flex-row items-center justify-center w-full gap-4 py-2 md:w-10/12">
                    <div className="flex-1 h-px bg-white/8"></div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-white/25">
                        or
                    </span>
                    <div className="flex-1 h-px bg-white/8"></div>
                </div>

                <div className="flex flex-col items-center w-full gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center w-full gap-3 py-3 text-sm transition-all duration-200 border md:w-10/12 border-white/10 text-white/50 rounded-xl hover:border-white/20 hover:text-white/80 bg-white/3 hover:bg-white/5"
                        // onClick={signInWithGoogle}
                        disabled={isLoading}
                    >
                        <img
                            src={googleIcon}
                            alt="Google Icon"
                            className="h-4"
                        />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        type="submit"
                        className="block w-full py-3 mx-auto text-sm font-semibold text-white transition-all duration-200 md:w-10/12 rounded-xl disabled:opacity-50"
                        style={{
                            background:
                                "linear-gradient(135deg, #9B51E0 0%, #7B3FC0 100%)",
                        }}
                        id="signInButton"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress color="inherit" size={"1.1rem"} />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>

                <p className="mt-4 mb-2 text-sm text-white/35">
                    Don't have an account?{" "}
                    <Link to={"/RegistrationPage"}>
                        <span className="text-[#9B51E0] hover:text-purple-400 transition-colors cursor-pointer">
                            Sign up free
                        </span>
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default LoginPage;
