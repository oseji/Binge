import { FormEvent, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { auth, googleProvider } from "../firebase-config/firebase";
import { RootState } from "../redux/store";
import { loading, notLoading } from "../redux/loadingState";
import { setFalse, setTrue } from "../redux/loginState";
import Icon from "../components/Icon";
import { useDocumentTitle } from "../hooks/useMotion";
import AuthLayout, { Field, FormError, safeNext } from "./AuthLayout";

export const errorMessageCleanUp = (text: string) =>
  text.replace("Firebase: ", "").replace("Error ", "").replace("auth/", "").replace("(", "").replace(")", "").replace(/-/g, " ");

// Shared demo account so visitors can explore the app without registering
const DEMO_EMAIL = "fake@gmail.com";
const DEMO_PASSWORD = "fakepassword";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loadingSetter.isLoading);
  const next = safeNext(search);
  useDocumentTitle("Log in");

  const run = async (attempt: () => Promise<unknown>) => {
    setErrorMessage("");
    dispatch(loading());
    try {
      await attempt();
      dispatch(setTrue());
      history.replace(next);
    } catch (err: unknown) {
      dispatch(setFalse());
      setErrorMessage(errorMessageCleanUp((err as Error).message));
    } finally {
      dispatch(notLoading());
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() => signInWithEmailAndPassword(auth, email, password));
  };

  return (
    <AuthLayout title="Welcome back" intro="Log in to see your list and save new titles.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 mb-7 border border-rule-strong rounded bg-ink-1">
        <p className="text-sm text-paper-muted">Just looking around? Skip the sign-up.</p>
        <button
          type="button"
          onClick={() => run(() => signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD))}
          disabled={isLoading}
          className="btn btn-ghost min-h-[2.5rem] px-4 flex-shrink-0"
        >
          Continue as guest
        </button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <Field id="emailAddressLogin" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <div>
          <Field id="passwordLogin" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          <Link to="/ResetPassword" className="inline-block mt-2 py-1 text-sm text-paper-muted hover:text-signal transition-colors">
            Forgot your password?
          </Link>
        </div>

        <FormError message={errorMessage} />

        <button type="submit" id="signInButton" className="btn btn-signal w-full min-h-[3.25rem]" disabled={isLoading}>
          {isLoading ? <span className="spinner" aria-label="Signing in" /> : "Log in"}
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
        New here?{" "}
        <Link to={`/RegistrationPage${search}`} className="text-paper underline decoration-rule-strong underline-offset-4 hover:text-signal hover:decoration-signal">
          Create a free account
        </Link>
      </p>
    </AuthLayout>
  );
}
