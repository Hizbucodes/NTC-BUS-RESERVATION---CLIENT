import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tripAPI from "../api/tripAPI";
const OperatorViewAllSchedules = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchScheduledTrips = async () => {
      try {
        const response = await tripAPI.get("/getAllScheduledTrip", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredTrips = (response.data.data || []).filter(
          (trip) =>
            trip?.Bus?.operatorName.toLowerCase().trim() ===
            `${user.firstName} ${user.lastName}`.toLowerCase().trim()
        );
        setTrips(filteredTrips);
      } catch (err) {
        setError("Failed to fetch scheduled trips");
        console.error(err);
      }
    };

    fetchScheduledTrips();
  }, [token]);

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
                    Departure Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Arrival Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trip Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trip Status
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
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {trip.departureTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {trip.arrivalTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm text-gray-900 font-medium">
                            {trip.Route?.origin}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-sm text-gray-900 font-medium">
                              {trip.Route?.destination}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(trip.tripDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`${
                            trip.tripStatus === "cancelled"
                              ? "text-red-600 bg-red-100"
                              : "text-green-600 bg-green-100"
                          } text-sm font-medium px-4 rounded-full py-1.5`}
                        >
                          {trip.tripStatus}
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
                      <span className="text-sm">No scheduled trips found</span>
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

export default OperatorViewAllSchedules;
