import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import routeApi from "../api/routeApi";

const BusRouteFormUpdate = () => {
  const { loading, token } = useSelector((state) => state.auth);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      origin: "",
      destination: "",
      distance: "",
      duration: "",
    },
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      try {
        const response = await routeApi.get("/getAllRoutes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoutes(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching routes:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchRoutes();
  }, [token]);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!selectedRouteId || !token) return;

      try {
        const response = await routeApi.get(`/${selectedRouteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { origin, destination, distance, duration } = response.data.data;
        reset({ origin, destination, distance, duration });
      } catch (error) {
        console.error(
          "Error fetching route details:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchRouteDetails();
  }, [selectedRouteId, reset, token]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      distance: parseInt(data.distance, 10),
      duration: parseInt(data.duration, 10),
    };

    if (!token) {
      throw new Error("Authentication token not found");
    }

    try {
      await routeApi.patch(`/${selectedRouteId}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Route updated successfully");
    } catch (error) {
      console.error(
        "Error updating route:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="w-full">
      <div className="mb-5">
        <label htmlFor="routeSelect" className="block font-bold mb-2">
          Select Route
        </label>
        <select
          id="routeSelect"
          className="border-2 rounded-md py-2 px-3 w-full"
          value={selectedRouteId}
          onChange={(e) => setSelectedRouteId(e.target.value)}
        >
          <option value="">Select a route</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {`${route.origin} → ${route.destination}`}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col"
      >
        <div className="flex flex-col gap-y-1">
          <label htmlFor="origin">Origin</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="text"
            id="origin"
            {...register("origin", { required: "Origin is required" })}
            placeholder="Insert Origin"
          />
          {errors.origin && (
            <p className="text-red-500 font-semibold">
              {errors.origin.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="destination">Destination</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="text"
            id="destination"
            {...register("destination", {
              required: "Destination is required",
            })}
            placeholder="Insert Destination"
          />
          {errors.destination && (
            <p className="text-red-500 font-semibold">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="distance">Distance (Km)</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="number"
            id="distance"
            {...register("distance", {
              required: "Distance is required",
              min: { value: 1, message: "Distance must be at least 1 km" },
            })}
            placeholder="Insert Distance in Kilometres"
          />
          {errors.distance && (
            <p className="text-red-500 font-semibold">
              {errors.distance.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="duration">Duration (Hrs)</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="number"
            id="duration"
            {...register("duration", {
              required: "Duration is required",
              min: {
                value: 0.5,
                message: "Duration must be at least 0.5 hours",
              },
            })}
            placeholder="Insert Duration in Hours"
          />
          {errors.duration && (
            <p className="text-red-500 font-semibold">
              {errors.duration.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
          disabled={!selectedRouteId}
        >
          {loading ? "Updating..." : "Update Route"}
        </button>
      </form>
    </div>
  );
};

export default BusRouteFormUpdate;
