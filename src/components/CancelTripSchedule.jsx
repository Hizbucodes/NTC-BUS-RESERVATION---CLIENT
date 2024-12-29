import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tripAPI from "../api/tripAPI";
import { GoTrash } from "react-icons/go";
const CancelTripSchedule = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripAPI.get("/getAllTrip", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips(response.data.data);
      } catch (err) {
        setError("Failed to fetch trip schedules");
        console.error(err);
      }
    };

    fetchTrips();
  }, [token]);

  const handleCancelTrip = async (tripId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this trip schedule?"
    );
    if (isConfirmed) {
      try {
        const response = await tripAPI.delete(`/cancelTrip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(response.data.message);
      } catch (err) {
        setError("Failed to cancel trip");
        console.error(err);
      }
    }
  };
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
                    Trip ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trips.length > 0 ? (
                  trips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                          #{trip.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm text-gray-900 font-medium">
                            {trip.Route?.origin} - {trip.Route?.destination}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(trip.tripDate).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${
                            trip.tripStatus === "cancelled"
                              ? "text-red-500"
                              : "text-green-500"
                          } text-sm font-medium`}
                        >
                          {trip.tripStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {trip.tripStatus !== "cancelled" && (
                          <button
                            onClick={() => handleCancelTrip(trip.id)}
                            className="w-[6rem] px-2 flex items-center justify-between py-2 text-white bg-red-400 rounded-md hover:bg-red-500 "
                          >
                            Cancel
                            <GoTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                          />
                        </svg>
                        <span className="text-sm">No trips found</span>
                      </div>
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

export default CancelTripSchedule;
