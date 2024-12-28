import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSelection } from "../app/feature/booking/bookingSlice";
import trip_not_found_image from "../assets/trip-not-found.jpg";

const BOOKING_TIMEOUT = 10 * 60 * 1000;

const BookingPage = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(BOOKING_TIMEOUT / 1000);
  const { tripId, seatIds, totalFare, expiresAt } = state || {};

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
      dispatch(clearSelection());
      navigate(-1);
    }, BOOKING_TIMEOUT);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [dispatch, navigate]);

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
    <div className="bg-red-500">
      <p className="font-semibold text-2xl">
        Complete your booking within 10 minutes. You will be redirected back if
        no action is taken.
      </p>
      <span>
        {" "}
        {Math.floor(timeLeft / 60)}:
        {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}{" "}
      </span>
      <h1>Booking Details</h1>
      <p>Trip ID: {tripId}</p>
      <p>Selected Seats: {seatIds.join(", ")}</p>
      <p>Total Fare: Rs. {totalFare}</p>
      <p>Reservation Expires At: {new Date(expiresAt).toLocaleTimeString()}</p>
    </div>
  );
};

export default BookingPage;
