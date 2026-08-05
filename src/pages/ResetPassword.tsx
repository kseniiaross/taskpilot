import { Link } from "react-router-dom";
import { type FormEvent, useState } from "react";

import "../styles/Auth.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="authPage">
      <section className="authHero">
        <Link to="/" className="authLogo">
          <div className="authLogo__icon">
            TP
          </div>

          <div className="authLogo__content">
            <h2>TaskPilot</h2>
            <span>Smart task management</span>
          </div>
        </Link>

        <div className="authHero__content">
          <span className="authHero__badge">
            Password recovery
          </span>

          <h1>
            Reset your password.
          </h1>

          <p>
            Enter the email address associated with your account and we'll
            send you instructions to create a new password.
          </p>
        </div>
      </section>

      <section className="authSection">
        <div className="authCard">
          <header className="authCard__header">
            <span className="authCard__eyebrow">
              ACCOUNT SECURITY
            </span>

            <h2>Forgot your password?</h2>

            <p>
              {submitted
                ? "Check your inbox for a link to reset your password."
                : "Enter your email below and we'll send you a password reset link."}
            </p>
          </header>

          {submitted ? (
            <div className="authLinks">
              <p>
                Didn't get the email?{" "}
                <button
                  type="button"
                  className="authInlineButton"
                  onClick={() => setSubmitted(false)}
                >
                  Try a different address
                </button>
              </p>

              <p>
                Remember your password?{" "}
                <Link to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
              <form
                className="authForm"
                onSubmit={handleSubmit}
              >
                <label className="authField">
                  <span>Email address</span>

                  <input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="authPrimaryButton"
                >
                  Send reset link
                </button>
              </form>

              <div className="authLinks">
                <p>
                  Remember your password?{" "}
                  <Link to="/login">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}