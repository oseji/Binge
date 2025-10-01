import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

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

export const errorMessageCleanUp = (text: string) => {
	return text
		.replace("Firebase: ", "")
		.replace("Error ", "")
		.replace("auth/", "")
		.replace("(", "")
		.replace(")", "")
		.replace(/-/g, " ");
};

const LoginPage = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
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
			if (err) {
				dispatch(setFalse());
				setError(err.message);
				setErrorMessage(errorMessageCleanUp(err.message));
			}
		} finally {
			dispatch(notLoading());
		}
	};

	useEffect(() => {
		console.log(error);

		console.log(errorMessage);
	}, [error]);

	return (
		<form
			className="authenticationForm"
			onSubmit={(e) => {
				e.preventDefault();
				signIn();
			}}
		>
			<Link to={"/"}>
				<img src={backArrow} alt="back arrow" className="mt-8 " />
			</Link>
			<div className="flex flex-col items-center mb-4 ">
				<img src={BingeLogo} alt="Binge Logo" className="h-10 " />
				<p className="text-xl font-bold ">Welcome back to Binge</p>
			</div>

			<div className="flex flex-col items-center gap-3 text-sm ">
				<div className="inputGrp">
					<label htmlFor="emailAddressLogin">email address</label>
					<input
						type="email"
						inputMode="email"
						name="emailAddressLogin"
						id="emailAddressLogin"
						placeholder="ImeldaLeo@gmail.com"
						required={true}
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
						required={true}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<p className="block mr-auto italic font-semibold text-red-500 capitalize ">
					{errorMessage}
				</p>

				<Link
					to={"/ResetPassword"}
					className=" text-[#9B51E0] underline mr-auto"
				>
					Forgot Password?
				</Link>

				<div className="flex flex-row items-center justify-center w-full gap-5 p-5 md:w-10/12">
					<div className=" w-10/12 p-[0.5px] bg-[#98A2B3]"></div>
					<span className=" text-[#98A2B3] font-bold">OR</span>
					<div className=" w-10/12 p-[0.5px] bg-[#98A2B3]"></div>
				</div>

				{/* BUTTONS */}
				<div className="flex flex-col items-center w-full gap-3 ">
					<button
						className=" py-3.5 w-full md:w-10/12 flex flex-row justify-center items-center gap-3 border-2 border-[#98A2B3] text-[#98A2B3] rounded hover:scale-105 transition ease-in-out duration-200"
						onClick={(e) => e.preventDefault()}
					>
						<img src={googleIcon} alt="Google Icon" />
						<span> Sign in with Google</span>
					</button>

					<button
						className=" py-3.5 w-full md:w-10/12 mx-auto block bg-[#9B51E0] text-white font-semibold rounded hover:scale-105 transition ease-in-out duration-200"
						id="signInButton"
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
