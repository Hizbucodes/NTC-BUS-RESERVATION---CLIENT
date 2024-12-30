import React, { useEffect, useState } from "react";
import bookingApi from "../api/bookingApi";
import { useSelector } from "react-redux";

const OperatorViewAllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { token, user } = useSelector((state) => state.auth);

  const operatorName = (user.firstName + user.lastName)
    .replace(/\s+/g, "")
    .toLowerCase();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.get("/getAllBookingMadeByCommuter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredBookings = (response.data.data || []).filter(
          (booking) => {
            const bookingOperatorName = booking.Trip?.Bus?.operatorName
              ?.replace(/\s+/g, "")
              .toLowerCase();

            return bookingOperatorName === operatorName;
          }
        );

        setBookings(filteredBookings);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error(err);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [token, user, operatorName]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Commuter
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Total Fare
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                          #{booking.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {booking.User?.firstName} {booking.User?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm text-gray-900 font-medium">
                            {booking.Trip?.Route?.origin}
                          </span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                          <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-sm text-gray-900 font-medium">
                              {booking.Trip?.Route?.destination}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          Rs. {booking.totalFare}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`${
                            booking.paymentStatus === "cancelled"
                              ? "text-red-600 bg-red-100"
                              : "text-green-600 bg-green-100"
                          } text-sm font-medium px-4 rounded-full py-1.5`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <span className="text-sm">No bookings found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorViewAllBooking;
