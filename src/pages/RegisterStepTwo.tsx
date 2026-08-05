import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { saveUser } from "../utils/authHelpers";
import { isValidEmail, isValidPassword } from "../utils/validators";

import "../styles/Auth.css";

const PENDING_EMAIL_KEY =
  "taskpilot-register-email";

/* =========================================================================
   REGISTER STEP TWO
   ========================================================================= */

const RegisterStepTwo = () => {

  const {
    loginUser,
  } = useAuth();

  const navigate =
    useNavigate();

  /* =========================================================================
     STATE
     ========================================================================= */

  const [
    email,
  ]=useState(
    () =>
      localStorage.getItem(
        PENDING_EMAIL_KEY,
      )?.trim() ?? "",
  );

  const [
    fullName,
    setFullName,
  ]=useState("");

  const [
    password,
    setPassword,
  ]=useState("");

  const [
    workspaceName,
    setWorkspaceName,
  ]=useState("");

  const [
    error,
    setError,
  ]=useState("");

  /* =========================================================================
     VALIDATE REGISTRATION SESSION
     ========================================================================= */

  useEffect(()=>{

    const pendingEmail =
      localStorage.getItem(
        PENDING_EMAIL_KEY,
      )?.trim();

    if(!pendingEmail){

      navigate(
        "/register",
        {
          replace:true,
        },
      );

    }

  },[
    navigate,
  ]);

  /* =========================================================================
     HANDLERS
     ========================================================================= */

  const handleSubmit=(
    event:FormEvent<HTMLFormElement>,
  )=>{

    event.preventDefault();

    setError("");

    const normalizedName =
      fullName.trim();

    const normalizedWorkspace =
      workspaceName.trim();

    if(!email||!isValidEmail(email)){

      setError(
        "Your registration email is missing or invalid.",
      );

      navigate(
        "/register",
        {
          replace:true,
        },
      );

      return;
    }

    if(!normalizedName){

      setError(
        "Please enter your full name.",
      );

      return;
    }

    if(!isValidPassword(password)){

      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    const newUser=
      saveUser({
        fullName:normalizedName,
        email,
        password,
        workspaceName:
          normalizedWorkspace ||
          "Personal Workspace",
      });

    loginUser(
      newUser,
    );

    localStorage.removeItem(
      PENDING_EMAIL_KEY,
    );

    navigate(
      "/dashboard",
      {
        replace:true,
      },
    );
  };
  return(
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
            Almost Ready
          </span>
          <h1>
            Finish setting
            <br />
            up your account.
          </h1>
          <p>
            Complete your profile to create your workspace and start managing projects, deadlines and tasks.
          </p>
          <div className="authHero__stats">
            <div className="authStat">
              <strong>
                Secure
              </strong>
              <span>
                Authentication
              </span>
            </div>
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
              PROFILE SETUP
            </span>
            <h2>
              Create your account
            </h2>
            <p>
              Complete a few details before entering your workspace.
            </p>
          </header>
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
                value={email}
                readOnly
              />
            </label>
            <label className="authField">
              <span>
                Full Name
              </span>
              <input
                type="text"
                autoComplete="name"
                placeholder="John Smith"
                value={fullName}
                onChange={(event)=>
                  setFullName(
                    event.target.value,
                  )
                }
                required
              />
            </label>
            <label className="authField">
              <span>
                Password
              </span>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event)=>
                  setPassword(
                    event.target.value,
                  )
                }
                minLength={8}
                required
              />
            </label>
            <label className="authField">
              <span>
                Workspace Name
                <small>
                  Optional
                </small>
              </span>
              <input
                type="text"
                placeholder="Marketing Team"
                value={workspaceName}
                onChange={(event)=>
                  setWorkspaceName(
                    event.target.value,
                  )
                }
              />

            </label>
            {error&&(
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
              Create Workspace
            </button>
          </form>
          <div className="authLinks">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterStepTwo;