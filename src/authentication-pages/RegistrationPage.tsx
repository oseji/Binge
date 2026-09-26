import { FormEvent, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { auth, googleProvider } from "../firebase-config/firebase";
import { RootState } from "../redux/store";
import { loading, notLoading } from "../redux/loadingState";
import { setFalse, setTrue } from "../redux/loginState";
import Icon from "../components/Icon";
import { useDocumentTitle } from "../hooks/useMotion";
import AuthLayout, { Field, FormError, safeNext } from "./AuthLayout";
import { errorMessageCleanUp } from "./LoginPage";

export default function RegistrationPage() {
  const history = useHistory();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loadingSetter.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const confirmMismatch = confirmPassword !== "" && confirmPassword !== password;
  useDocumentTitle("Create an account");

  const run = async (attempt: () => Promise<unknown>) => {
    setErrorMessage("");
    dispatch(loading());
    try {
      await attempt();
      dispatch(setTrue());
      history.replace(safeNext(search));
    } catch (err: unknown) {
      dispatch(setFalse());
      setErrorMessage(errorMessageCleanUp((err as Error).message));
    } finally {
      dispatch(notLoading());
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setErrorMessage("Passwords need at least 6 characters.");
    if (password !== confirmPassword) return setErrorMessage("The two passwords don't match.");
    run(() => createUserWithEmailAndPassword(auth, email, password));
  };

  return (
    <AuthLayout title="Create an account" intro="Free, and only needed for My List. Browsing works without one.">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Field id="emailAddress" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 6 characters" />
        <div>
          <Field
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            invalid={confirmMismatch}
            describedBy={confirmMismatch ? "confirmPasswordError" : undefined}
          />
          {confirmMismatch && (
            <p id="confirmPasswordError" className="text-sm text-[#ff8a80] mt-2">
              Doesn't match the password above.
            </p>
          )}
        </div>

        <FormError message={errorMessage} />

        <button type="submit" id="completeRegistrationBtn" className="btn btn-signal w-full min-h-[3.25rem]" disabled={isLoading}>
          {isLoading ? <span className="spinner" aria-label="Creating account" /> : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-4 my-6" aria-hidden="true">
        <span className="flex-1 h-px bg-rule" />
        <span className="t-micro text-paper-subtle">or</span>
        <span className="flex-1 h-px bg-rule" />
      </div>

      <button type="button" className="btn btn-ghost w-full min-h-[3.25rem]" disabled={isLoading} onClick={() => run(() => signInWithPopup(auth, googleProvider))}>
        <Icon name="google" size={18} /> Continue with Google
      </button>

      <p className="mt-8 text-sm text-paper-muted">
        Already have an account?{" "}
        <Link to={`/LoginPage${search}`} className="text-paper underline decoration-rule-strong underline-offset-4 hover:text-signal hover:decoration-signal">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
