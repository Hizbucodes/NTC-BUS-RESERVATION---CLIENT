import React from "react";
import login_image from "../assets/login-side-image.jpg";
import ntc_logo from "../assets/NTC_LOGO.jpg";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <section className=" w-full h-full flex pt-6 justify-center">
      <div className="bg-white shadow-2xl rounded-md flex sm:justify-between justify-center w-[1024px] h-screen sm:h-[600px]">
        <div className="h-[100%] w-1/2 rounded-md hidden sm:flex">
          <img
            className="object-cover h-full w-full rounded-l-md"
            src={login_image}
            alt="login_image"
            title="NTC Sri Lanka Bus"
          />
        </div>

        <div className=" sm:w-1/2 flex flex-col items-center text-center pt-2 gap-y-5">
          <img
            className="w-[20rem] h-[6rem]"
            src={ntc_logo}
            alt="ntc_logo"
            title="NTC - National Transport Commission"
          />
          <div className="flex items-center justify-center px-5 sm:px-0">
            <h2 className="font-bold sm:text-3xl text-justify sm:text-center">
              Hi! Welcome to NTC - National Transport Commission{" "}
              <span className="sm:text-4xl">&#128075;</span>
            </h2>
          </div>

          <form className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col mt-8">
            <div className=" flex flex-col gap-y-2">
              <label htmlFor="email">Email Address</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>

            <div className=" flex flex-col gap-y-2">
              <label htmlFor="password">Password</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="password"
                id="password"
                placeholder="Enter Your Valid Password"
              />
            </div>

            <button
              type="button"
              className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
            >
              Sign in
            </button>

            <p className="text-center">
              Don't have an acccount?{" "}
              <Link
                className="font-semibold underline underline-offset-4"
                to={"/register"}
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
