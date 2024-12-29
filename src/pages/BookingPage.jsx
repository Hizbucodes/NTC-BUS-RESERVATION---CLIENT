import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  clearSelection,
  completeBooking,
  resetSeatStatus,
} from "../app/feature/booking/bookingSlice";
import trip_not_found_image from "../assets/trip-not-found.jpg";
import { useForm } from "react-hook-form";

const BOOKING_TIMEOUT = 10 * 60 * 1000;

const BookingPage = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(BOOKING_TIMEOUT / 1000);
  const { busId, tripId, seatIds, totalFare, expiresAt } = state || {};
  const { loading, error, success } = useSelector((state) => state.booking);

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      commuterName: "",
      commuterAddress: "",
      commuterNIC: "",
      commuterPhoneNumber: "",
      commuterEmail: "",
    },
  });

  const onSubmit = async (data) => {
    const bookingDetails = {
      tripId: tripId,
      seatIds: seatIds,
      ...data,
    };

    const result = await dispatch(completeBooking(bookingDetails)).unwrap();

    if (result.status === "success") {
      navigate("/booking-success", {
        state: {
          ...result.data,
          bookingId: result.data.bookingId,
          seatNumbers: result.data.seatNumbers,
          commuterAddress: data.commuterAddress,
          commuterNIC: data.commuterNIC,
        },
      });
    }
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    const handlePopState = () => {
      setIsNavigatingBack(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isNavigatingBack) {
      dispatch(resetSeatStatus(seatIds));
      setIsNavigatingBack(false);
    }

    if (!expiresAt) return;

    const remainingTime = new Date(expiresAt).getTime() - Date.now();

    if (remainingTime === 0) {
      dispatch(clearSelection());
      navigate(`/seat-layout/${busId}`);
      setIsButtonDisabled(true);
      return;
    }

    setTimeLeft(Math.floor(remainingTime / 1000));

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsButtonDisabled(true);
          dispatch(clearSelection());
          navigate(`/seat-layout/${busId}`);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, navigate, expiresAt, busId, isNavigatingBack]);

  let content;

  content = (
    <img
      className="w-[20rem] mt-10"
      src={trip_not_found_image}
      alt="not_found"
      title="Trips Not Found - NTC"
    />
  );

  if (!state) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-y-8">
        {content}
        <p className="text-xl md:text-4xl text-center font-semibold pt-8">
          Oops, Select a seat to make booking &#128533;
        </p>

        <span>
          Redirect to{" "}
          <Link
            to={"/"}
            className="font-semibold text-sky-500 underline underline-offset-2"
          >
            Home Page
          </Link>
        </span>
      </div>
    );
  }

  return (
    <section className="w-full h-full flex items-start justify-center mt-12 ">
      <div className="bg-white shadow-2xl shadow-sky-200/50 border border-sky-200 rounded-md py-5 p-2 w-[950px] flex items-start justify-between gap-x-12">
        <div className="w-1/2 bg-white shadow-xl rounded-md p-5">
          <h1 className="font-bold text-2xl underline underline-offset-2">
            Booking Details
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full  text-start gap-y-3 flex flex-col mt-8"
          >
            <div className=" flex flex-col gap-y-1">
              <label htmlFor="commuterName">Full Name</label>
              <input
                type="text"
                {...register("commuterName", {
                  required: "Full Name is required",
                })}
                id="commuterName"
                className="border-2 rounded-md py-1 px-2"
                placeholder="Your Full Name"
              />
              {errors.commuterName && (
                <p className="text-red-500 font-semibold">
                  {errors.commuterName.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="commuterAddress">Address</label>
              <input
                type="text"
                {...register("commuterAddress", {
                  required: "Address is required",
                })}
                id="commuterAddress"
                className="border-2 rounded-md py-1 px-2"
                placeholder="Your Address"
              />
              {errors.commuterAddress && (
                <p className="text-red-500 font-semibold">
                  {errors.commuterAddress.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="commuterNIC">NIC</label>
              <input
                type="text"
                {...register("commuterNIC", { required: "NIC is required" })}
                id="commuterNIC"
                className="border-2 rounded-md py-1 px-2"
                placeholder="Your National Identity Card Number"
              />
              {errors.commuterNIC && (
                <p className="text-red-500 font-semibold">
                  {errors.commuterNIC.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="commuterPhoneNumber">Phone Number</label>
              <input
                type="text"
                {...register("commuterPhoneNumber", {
                  required: "Phone Number is required",
                })}
                id="commuterPhoneNumber"
                className="border-2 rounded-md py-1 px-2"
                placeholder="Your Mobile Number"
              />
              {errors.commuterPhoneNumber && (
                <p className="text-red-500 font-semibold">
                  {errors.commuterPhoneNumber.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-y-1">
              <label htmlFor="commuterEmail">Email</label>
              <input
                type="email"
                {...register("commuterEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                id="commuterEmail"
                className="border-2 rounded-md py-1 px-2"
                placeholder="Your Email Address"
              />
              {errors.commuterEmail && (
                <p className="text-red-500 font-semibold">
                  {errors.commuterEmail.message}
                </p>
              )}
            </div>

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
            >
              {loading
                ? "Processing..."
                : isButtonDisabled
                ? "Time Expired"
                : "Book Now"}
            </button>
          </form>
        </div>

        <div className="w-1/2 bg-white  shadow-xl rounded-md p-5 flex flex-col h-full gap-y-8">
          <p className="font-semibold text-lg bg-red-500/20 shadow-md rounded-md p-2">
            Complete your booking within 10 minutes. You will be redirected back
            if no action is taken.
          </p>
          <div className="flex flex-col gap-y-6">
            <p className="flex items-center justify-between">
              Reservation Expires At:{" "}
              <p className="font-bold border-2 border-red-300 px-2 rounded-full">
                {new Date(expiresAt).toLocaleTimeString()}
              </p>
            </p>
            <span className="flex items-center justify-between">
              <p>Time Left </p>
              <p className="font-bold border-2 border-red-300 px-2 rounded-full">
                {Math.floor(timeLeft / 60)}:
                {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}{" "}
              </p>
            </span>
            <p className="flex items-center justify-between">
              Trip ID:{" "}
              <p className="font-bold border-2 border-sky-300 px-2 rounded-full">
                {tripId}
              </p>
            </p>
            <p className="flex items-center justify-between">
              Selected Seat ID's:{" "}
              <p className="font-bold border-2 border-sky-300 px-2 rounded-full">
                {seatIds.join(", ")}
              </p>
            </p>
            <p className="flex items-center justify-between">
              Total Fare:{" "}
              <p className="font-bold border-2 border-sky-300 px-2 rounded-full">
                Rs {totalFare}
              </p>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
