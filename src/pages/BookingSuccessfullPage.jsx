import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsCheck2Circle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking,
  clearBookingState,
} from "../app/feature/booking/bookingSlice";

const BookingSuccessfullPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    bookingId,
    tripId,
    totalFare,
    commuterName,
    commuterEmail,
    seatNumbers,
    commuterPhoneNumber,
    commuterAddress,
    commuterNIC,
  } = state || {};

  const { loading, error, success } = useSelector((state) => state.booking);

  const dispatch = useDispatch();

  const CANCELLATION_TIMEOUT = 5 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(CANCELLATION_TIMEOUT / 1000);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const updateTimer = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(
        Math.floor((CANCELLATION_TIMEOUT - elapsedTime) / 1000),
        0
      );
      setTimeLeft(remainingTime);
      setIsButtonDisabled(remainingTime === 0);
    };

    const intervalId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(intervalId);
  }, []);

  const handleCancelBooking = async () => {
    const result = await dispatch(cancelBooking(bookingId));

    if (cancelBooking.fulfilled.match(result)) {
      alert("Bookinfg Cancelled Successfully");
      navigate("/");
    } else {
      console.error(result.payload || "Cancellation failed");
    }
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => {
        dispatch(clearBookingState());
      }, 5000);
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();

      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    window.history.replaceState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  if (!state) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-y-8">
        <p className="text-xl md:text-4xl text-center font-semibold pt-8">
          No booking details found. Please make a booking first.
        </p>
        <Link
          to="/"
          className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-start justify-center mt-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl shadow-sky-200/50">
        <div className="text-center p-6 border-b">
          <div className="flex justify-center mb-4">
            <BsCheck2Circle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-green-600">
            Booking Successful!
          </h1>
          <p className="text-gray-600 mt-2">
            Your booking has been confirmed. Click <q>Return to Home button</q>{" "}
            and Below is your booking details.
          </p>
        </div>

        <div className="text-center p-2">
          <p className=" text-md bg-red-500/30 text-center py-2">
            You can cancel your booking within 5 minutes if needed
          </p>
          <p className="font-semibold">
            Time Remaining:-{" "}
            {timeLeft > 0
              ? `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${
                  timeLeft % 60
                } minutes`
              : "Time expired"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg border-b border-gray-200 pb-2">
              Passenger Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">{commuterName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{commuterEmail}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-medium">{commuterPhoneNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">NIC</p>
                <p className="font-medium">{commuterNIC}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-medium">{commuterAddress}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg border-b border-gray-200 pb-2">
              Booking Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Trip ID</p>
                <p className="font-medium">{tripId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Fare</p>
                <p className="font-medium">Rs {totalFare}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Seat Numbers</p>
                <p className="font-medium">{seatNumbers.join(", ")}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link
              to="/"
              className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
            >
              Return to Home
            </Link>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleCancelBooking}
              disabled={isButtonDisabled || loading}
              className={`px-8 py-3 rounded-md font-semibold transition-colors duration-200 ${
                isButtonDisabled || loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {loading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
          {success && <p className="text-green-500 text-center">{success}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessfullPage;
