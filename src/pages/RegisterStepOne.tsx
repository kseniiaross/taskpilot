import {
  FormEvent,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { isValidEmail } from "../utils/validators";

import "../styles/Auth.css";

const PENDING_EMAIL_KEY = "taskpilot-register-email";

const RegisterStepOne = () => {
  const navigate = useNavigate();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem(
      PENDING_EMAIL_KEY,
      normalizedEmail,
    );

    navigate("/register/details");
  };

  const handleGoogleRegister = () => {
    alert("Google Sign Up will be available soon.");
  };

  return (
    <main className="authPage">
      <section className="authHero">
        <Link
          to="/"
          className="authLogo"
        >
          <div className="authLogo__icon">
            TP
          </div>

          <div className="authLogo__content">
            <h2>
              TaskPilot
            </h2>

            <span>
              Project Management Platform
            </span>
          </div>
        </Link>

        <div className="authHero__content">
          <span className="authHero__badge">
            Start Free
          </span>

          <h1>
            Organize work.
            <br />
            Stay productive.
          </h1>

          <p>
            Create your TaskPilot workspace and organize
            projects, tasks, deadlines and collaboration
            from one modern dashboard.
          </p>

          <div className="authHero__stats">
            <div className="authStat">
              <strong>
                Unlimited
              </strong>
              <span>
                Projects
              </span>
            </div>

            <div className="authStat">
              <strong>
                Real-Time
              </strong>
              <span>
                Collaboration
              </span>
            </div>

            <div className="authStat">
              <strong>
                Cloud
              </strong>
              <span>
                Synchronization
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="authSection">
        <div className="authCard">
          <header className="authCard__header">
            <span className="authCard__eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>
              Welcome to TaskPilot
            </h2>

            <p>
              Create your account to start managing
              projects, collaborate with your team and
              stay productive.
            </p>
          </header>

          <button
            type="button"
            className="authGoogleButton"
            onClick={handleGoogleRegister}
          >
            <img
              src="/images/google.png"
              alt="Google"
            />

            Continue with Google
          </button>

          <div className="authDivider">
            <span>
              or continue with email
            </span>
          </div>

          <form
            className="authForm"
            onSubmit={handleSubmit}
          >
            <label className="authField">
              <span>
                Email Address
              </span>

              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                required
              />
            </label>

            {error && (
              <p
                className="authError"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="authPrimaryButton"
            >
              Continue
            </button>
          </form>

          <p className="authTerms">
            By creating an account you agree to our{" "}
            <Link to="/terms">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy">
              Privacy Policy
            </Link>.
          </p>

          <div className="authLinks">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign In
              </Link>
            </p>

            <p>
              Need help?{" "}
              <Link to="/support">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterStepOne;