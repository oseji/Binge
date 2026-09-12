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

// Shared demo account so visitors can explore the app without registering.
const DEMO_EMAIL = "fake@gmail.com";
const DEMO_PASSWORD = "fakepassword";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const history = useHistory();

    const dispatch = useDispatch();
    const isLoading = useSelector(
        (state: RootState) => state.loadingSetter.isLoading,
    );

    const signIn = async (
        credentials: { email: string; password: string } = { email, password },
    ) => {
        setErrorMessage("");
        dispatch(loading());

        try {
            await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password,
            );
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
            <Link to={"/"} aria-label="Back to home" className="inline-flex items-center justify-center w-11 h-11 mt-4 -ml-3 rounded-full hover:bg-white/5">
                <img src={backArrow} alt="" />
            </Link>
            <div className="flex flex-col items-center mb-7">
                <img src={BingeLogo} alt="Binge Logo" className="h-10" />
                <h1 className="mt-2 text-lg font-bold text-white">
                    Welcome back to Binge
                </h1>
                <p className="mt-1 text-xs text-fg-muted">
                    Sign in to your account
                </p>
            </div>

            <div className="flex flex-col items-center gap-3 text-sm">
                <div className="flex flex-col items-center w-full gap-2 px-4 py-3 mb-1 border rounded-xl border-purple-500/25 bg-purple-500/10 sm:flex-row sm:justify-between">
                    <p className="text-xs text-center text-fg-muted sm:text-left">
                        Just browsing? Skip the sign-up.
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            signIn({
                                email: DEMO_EMAIL,
                                password: DEMO_PASSWORD,
                            })
                        }
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap transition-colors border rounded-lg border-purple-400/40 hover:bg-purple-500/20 disabled:opacity-50"
                    >
                        Sign in as guest
                    </button>
                </div>

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
                        className=""
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
                            className="w-full pr-12"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-fg-subtle hover:text-fg"
                        >
                            {showPassword ? <EyeClosed /> : <EyeOpen />}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div role="alert" className="w-full px-3 py-2 border rounded-xl bg-red-500/10 border-red-500/20">
                        <p className="text-sm font-medium text-red-400 capitalize">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <Link
                    to={"/ResetPassword"}
                    className="text-accent-text hover:text-purple-300 transition-colors text-sm mr-auto"
                >
                    Forgot password?
                </Link>

                <div className="flex flex-row items-center justify-center w-full gap-4 py-2 md:w-10/12">
                    <div className="flex-1 h-px bg-line"></div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-fg-subtle">
                        or
                    </span>
                    <div className="flex-1 h-px bg-line"></div>
                </div>

                <div className="flex flex-col items-center w-full gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center w-full gap-3 py-3 text-sm transition-all duration-200 border md:w-10/12 border-line text-fg-muted rounded-xl hover:border-line-strong hover:text-fg bg-white/5 hover:bg-white/5"
                        // onClick={signInWithGoogle}
                        disabled={isLoading}
                    >
                        <img
                            src={googleIcon}
                            alt=""
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
                            <CircularProgress aria-label="Loading" color="inherit" size={"1.1rem"} />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>

                <p className="mt-4 mb-2 text-sm text-fg-muted">
                    Don't have an account?{" "}
                    <Link to={"/RegistrationPage"}>
                        <span className="text-accent-text hover:text-purple-300 transition-colors cursor-pointer">
                            Sign up free
                        </span>
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default LoginPage;
