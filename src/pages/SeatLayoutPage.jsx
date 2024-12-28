import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  clearError,
  clearSelection,
  fetchSeats,
  reserveSeats,
  setError,
  toggleSeatSelection,
} from "../app/feature/booking/bookingSlice";

const SeatLayoutPage = () => {
  const { busId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tripId = location.state?.tripId;

  const { seats, selectedSeats, loading, error, totalFare, reservationExpiry } =
    useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchSeats(busId));

    return () => {
      dispatch(clearSelection());
    };
  }, [dispatch, busId]);

  const handleSeatClick = (seat) => {
    if (seat.seatStatus !== "Available") return;

    if (!selectedSeats.includes(seat.id) && selectedSeats.length >= 4) {
      dispatch(setError("Maximum 4 seats can be selected"));
      return;
    }

    dispatch(toggleSeatSelection(seat.id));
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      dispatch(setError("Please select at least one seat"));
      return;
    }

    try {
      const resultAction = await dispatch(
        reserveSeats({ tripId, seatIds: selectedSeats })
      );

      if (reserveSeats.fulfilled.match(resultAction)) {
        navigate("/booking/details", {
          state: {
            tripId,
            seatIds: selectedSeats,
            totalFare: resultAction.payload.totalFare,
            expiresAt: resultAction.payload.expiresAt,
          },
        });
      }
    } catch (err) {
      dispatch(setError("Failed to reserve seats"));
    }
  };

  const Seat = ({ seat }) => {
    const isSelected = selectedSeats.includes(seat.id);
    const getStatusStyle = (status, isSelected) => {
      if (isSelected) {
        return "bg-blue-500 text-white ring-2 ring-blue-600 ring-offset-2";
      }
      switch (status) {
        case "Available":
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case "Processing":
          return "bg-yellow-100 text-yellow-800 cursor-not-allowed";
        case "Booked":
          return "bg-red-100 text-red-800 cursor-not-allowed";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <button
        onClick={() => handleSeatClick(seat)}
        disabled={seat.seatStatus !== "Available"}
        className={`
          w-16 h-16 rounded-lg flex flex-col items-center justify-center
          transition-all duration-200 transform hover:scale-105
          ${getStatusStyle(seat.seatStatus, isSelected)}
        `}
      >
        <span className="text-lg font-bold">{seat.seatNumber}</span>
        <span className="text-xs">{seat.seatStatus}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="absolute top-0 right-0 mt-3 mr-4"
            onClick={() => dispatch(clearError())}
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Your Seats
          </h2>
          <p className="text-gray-600">Select 1-4 seats to proceed</p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">Driver</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-sm text-gray-600">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
          {seats.map((seat) => (
            <Seat key={seat.id} seat={seat} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">
              Selected Seats: {selectedSeats.length}
            </p>
            <p className="text-gray-600">
              Total Fare: Rs. {totalFare.toFixed(2)}
            </p>
            {reservationExpiry && (
              <p className="text-yellow-600">
                Expires at: {new Date(reservationExpiry).toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0 || loading}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg
              disabled:bg-gray-400 disabled:cursor-not-allowed
              hover:bg-blue-700 transition-colors duration-200"
          >
            {loading ? "Processing..." : "Proceed to Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutPage;
