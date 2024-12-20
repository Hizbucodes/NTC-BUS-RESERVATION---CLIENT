import React, { useEffect } from "react";
import register_image from "../assets/register-page-image.jpg";
import ntc_logo from "../assets/NTC_LOGO.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/feature/auth/authSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <section className=" w-full min-h-full flex pt-6 justify-center pb-6">
      <div className="bg-white shadow-2xl rounded-md flex sm:justify-between justify-center w-[1024px] min-h-[850px] ">
        <div className="h-[100%] w-1/2 rounded-md hidden sm:flex">
          <img
            className="object-cover h-full w-full rounded-l-md brightness-75"
            src={register_image}
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
              <label htmlFor="firstName">First Name</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="Enter Your First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 font-semibold">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className=" flex flex-col gap-y-1">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Enter Your Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 font-semibold">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="role">Select a Role</label>
              <select
                {...register("role", { required: "Role is required" })}
                id="role"
                className="border-2 rounded-md py-1 px-2"
              >
                <option value="" disabled>
                  Role...
                </option>
                <option value="admin">ADMIN</option>
                <option value="operator">OPERATOR</option>
                <option value="commuter">COMMUTER</option>
              </select>
              {errors.role && (
                <p className="text-red-500 font-semibold">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="email">Email Address</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 7,
                    message: "Password must be at least 7 characters",
                  },
                })}
                placeholder="Enter Your Valid Password"
              />
              {errors.password && (
                <p className="text-red-500 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className=" flex flex-col gap-y-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="border-2 rounded-md py-1 px-2"
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === getValues("password") || "Password must match",
                })}
                placeholder="Enter Your Valid Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 font-semibold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-center">
              Already have an acccount?{" "}
              <Link
                className="font-semibold underline underline-offset-4"
                to={"/login"}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
