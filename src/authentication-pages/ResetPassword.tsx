import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase-config/firebase";
import { useDocumentTitle } from "../hooks/useMotion";
import AuthLayout, { Field, FormError } from "./AuthLayout";
import { errorMessageCleanUp } from "./LoginPage";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useDocumentTitle("Reset your password");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: unknown) {
      setErrorMessage(errorMessageCleanUp((err as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox">
        <p className="text-paper-muted" role="status">
          If there's an account for <span className="text-paper">{email.trim()}</span>, a reset link is on its way. It can take a minute or two, and it sometimes lands in spam.
        </p>
        <Link to="/LoginPage" className="btn btn-signal w-full min-h-[3.25rem] mt-8">
          Back to log in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" intro="Enter the email you signed up with and we'll send you a link to set a new one.">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <Field id="resetEmailAddress" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <FormError message={errorMessage} />
        <button type="submit" className="btn btn-signal w-full min-h-[3.25rem]" disabled={isLoading}>
          {isLoading ? <span className="spinner" aria-label="Sending" /> : "Send reset link"}
        </button>
      </form>
      <Link to="/LoginPage" className="inline-block mt-8 text-sm text-paper-muted hover:text-signal transition-colors py-1">
        Remembered it? Log in
      </Link>
    </AuthLayout>
  );
}
