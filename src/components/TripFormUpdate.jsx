import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import routeApi from "../api/routeApi";
import busApi from "../api/busApi";
import tripAPI from "../api/tripAPI";
import { format } from "date-fns";

const TripFormUpdate = () => {
  const { token } = useSelector((state) => state.auth);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [busInfo, setBusInfo] = useState(null);

  const tripStatuses = [
    { value: "scheduled", label: "scheduled" },
    { value: "cancelled", label: "cancelled" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripAPI.get("/getAllTrip", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setTrips(response.data.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (!selectedTrip) return;

    const fetchTripDetails = async () => {
      try {
        const tripResponse = await tripAPI.get(`/getTripById/${selectedTrip}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const trip = tripResponse.data.data;

        const routeResponse = await routeApi.get(`/${trip.routeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRouteInfo(routeResponse.data.data);

        const busResponse = await busApi.get(`/getBusById/${trip.busId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBusInfo(busResponse.data.data);

        setValue(
          "tripDate",
          new Date(trip.tripDate).toISOString().split("T")[0]
        );
        setValue("departureTime", trip.departureTime.slice(0, 5));
        setValue("arrivalTime", trip.arrivalTime.slice(0, 5));
        setValue("tripStatus", trip.tripStatus || "scheduled");
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [selectedTrip, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedTrip = {
        busId: busInfo.id,
        routeId: routeInfo.id,
        tripStatus: data.tripStatus,
        tripDate: data.tripDate,
        departureTime: data.departureTime || undefined,
        arrivalTime: data.arrivalTime || undefined,
      };

      await tripAPI.patch(`/${selectedTrip}`, updatedTrip, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await tripAPI.get("/getAllTrip", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(response.data.data);
      if (response.status === 200) {
        alert("Successfully updated the trip schedule");
      }
    } catch (error) {
      console.error(
        "Error updating trip:",
        error.response ? error.response.data : error.message
      );
      console.error("Error updating trip:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Update Trip Schedule</h2>

      <div className="mb-6">
        <label
          htmlFor="tripSelect"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Trip
        </label>
        <select
          id="tripSelect"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedTrip}
          onChange={(e) => setSelectedTrip(e.target.value)}
        >
          <option value="">Select a trip to update</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              Trip ID: {trip.id} |{" "}
              {new Date(trip.tripDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {selectedTrip && routeInfo && busInfo && (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="mb-2">
              <span className="font-medium">Route: </span>
              {routeInfo.origin} → {routeInfo.destination}
            </div>
            <div>
              <span className="font-medium">Bus: </span>
              {busInfo.operatorName} - {busInfo.licensePlate}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="tripDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Trip Date
              </label>
              <input
                type="date"
                id="tripDate"
                min={format(new Date(), "yyy-MM-dd")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("tripDate")}
              />
              {errors.tripDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tripDate.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="departureTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Departure Time
              </label>
              <input
                type="time"
                id="departureTime"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("departureTime")}
              />
              {errors.departureTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.departureTime.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="arrivalTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Arrival Time
              </label>
              <input
                type="time"
                id="arrivalTime"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("arrivalTime")}
              />
              {errors.arrivalTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.arrivalTime.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tripStatus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Trip Status
              </label>
              <select
                id="tripStatus"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("tripStatus")}
              >
                {tripStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.tripStatus && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tripStatus.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Update Trip Schedule
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default TripFormUpdate;
