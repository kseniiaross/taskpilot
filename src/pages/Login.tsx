import {
  type FormEvent,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getStoredUser,
} from "../utils/authStorage";

import "../styles/Auth.css";

const Login=()=>{

  const navigate=
    useNavigate();

  const{
    loginUser,
  }=useAuth();

  const[
    email,
    setEmail,
  ]=useState("");

  const[
    password,
    setPassword,
  ]=useState("");

  const handleSubmit=(
    event:FormEvent<HTMLFormElement>,
  )=>{

    event.preventDefault();

    const savedUser=
      getStoredUser();

    if(!savedUser){
      return;
    }

    const normalizedEmail=
      email
        .trim()
        .toLowerCase();

    if(
      savedUser.email!==
      normalizedEmail
    ){
      return;
    }

    loginUser(
      savedUser,
    );

    navigate(
      "/dashboard",
      {
        replace:true,
      },
    );
  };

  const handleGoogleLogin=()=>{
    alert(
      "Google Sign In will be available soon.",
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
            Welcome Back
          </span>
          <h1>
            Continue where
            <br/>
            you left off.
          </h1>
          <p>
            Access your workspace, manage projects,
            collaborate with your team and stay productive
            from one modern platform.
          </p>
          <div className="authHero__stats">
            <div className="authStat">
              <strong>
                24+
              </strong>
              <span>
                Projects
              </span>
            </div>
            <div className="authStat">
              <strong>
                520+
              </strong>
              <span>
                Completed Tasks
              </span>
            </div>
            <div className="authStat">
              <strong>
                99.9%
              </strong>
              <span>
                System Uptime
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="authSection">
        <div className="authCard">
          <header className="authCard__header">
            <span className="authCard__eyebrow">
              SIGN IN
            </span>
            <h2>
              Welcome Back
            </h2>
            <p>
              Sign in to access your projects,
              tasks and workspace.
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
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(event)=>
                  setEmail(
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
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event)=>
                  setPassword(
                    event.target.value,
                  )
                }
                required
              />
            </label>
            <Link
              to="/reset-password"
              className="authForgotPassword"
            >
              Forgot password?
            </Link>
            <button
              type="submit"
              className="authPrimaryButton"
            >
              Sign In
            </button>
          </form>
          <div className="authDivider">
            <span>
              or continue with
            </span>
          </div>
          <button
            type="button"
            className="authGoogleButton"
            onClick={handleGoogleLogin}
          >
            <img
              src="/images/google.png"
              alt="Google"
            />
            Continue with Google
          </button>
          <div className="authLinks">
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
              >
                Create Account
              </Link>
            </p>
            <p>
              Need help?{" "}
              <Link
                to="/support"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );

};


export default Login;