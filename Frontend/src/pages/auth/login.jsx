import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logo-transparent-svg.svg";
import Logo from "@/assets/images/logo/logo-transparent-svg.svg";
import Illustration from "@/assets/images/auth/ils1.svg";

const Login = () => {
  const [isDark] = useDarkMode();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const handleLoginSuccess = (token) => {
    // Store the token in local storage
    localStorage.setItem("authToken", token);
    // Redirect to dashboard or home page
    navigate("/dashboard");
  };

  const handleLoginError = (error) => {
    setLoginError(error.message || "An error occurred during login");
  };

  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          <div className="max-w-[520px] pt-20  rtl:pr-20 text-left">
            <Link to="/">
              <img src={isDark ? LogoWhite : Logo} alt="" className="mb-5" />
            </Link>
            <h4 className="pl-[100px]">
              Unlock your Project
              <span className="text-slate-800 dark:text-slate-400 font-bold ml-3">
                Performance
              </span>
            </h4>
          </div>
          <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
            <img
              src={Illustration}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Sign in</h4>
                {/* <div className="text-slate-500 text-base">
                  Sign in to your account to start using Dashcode
                </div> */}
              </div>
              {loginError && (
                <div className="text-red-500 text-center mb-4">
                  {loginError}
                </div>
              )}
              <LoginForm
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
            {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  Or continue with
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div>
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            <div className="auth-footer text-center">
              Copyright 2021, Dashcode All Rights Reserved.
            </div>  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
