import React, { useEffect } from "react";
import login_image from "../assets/login-side-image.jpg";
import ntc_logo from "../assets/NTC_LOGO.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../app/feature/auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

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
          {error && <p className="text-red-500">{error}</p>}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full rounded-r-md px-5 text-start gap-y-3 flex flex-col mt-8"
          >
            <div className=" flex flex-col gap-y-1">
              <label htmlFor="email">Email Address</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter Your Email Address"
              />
              {errors.email && (
                <p className="text-red-500 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="password">Password</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter Your Valid Password"
              />
              {errors.password && (
                <p className="text-red-500 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
            >
              {loading ? "Signing in..." : "Sign In"}
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
