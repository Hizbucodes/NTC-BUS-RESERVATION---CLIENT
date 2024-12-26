import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import busApi from "../api/busApi";
import routeApi from "../api/routeApi";

const TripForm = () => {
  const { loading, token } = useSelector((state) => state.auth);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      busId: 0,
      routeId: 0,
      tripDate: new Date().toISOString().split("T")[0],
      tripStatus: "",
      departureTime: "",
      arrivalTime: "",
    },
  });

  const selectedBusId = watch("busId");

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      busId: parseInt(data.busId, 10),
      routeId: parseInt(data.routeId, 10),
    };
    console.log("Formatted Data for submission:", formattedData);
  };
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [busesResponse, routesResponse] = await Promise.all([
          busApi.get("/getAllBuses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          routeApi.get("/getAllRoutes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBuses(busesResponse.data.data);
        setRoutes(routesResponse.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedBusId) {
      const selectedBus = buses.find(
        (bus) => bus.id === parseInt(selectedBusId)
      );
      if (selectedBus) {
        const filtered = routes.filter(
          (route) => route.id === selectedBus.routeId
        );

        if (filtered.length > 0) {
          setFilteredRoutes(filtered);

          if (watch("routeId") !== filtered[0]?.id) {
            reset({ routeId: filtered[0]?.id || 0 });
          }
        }
      } else {
        setFilteredRoutes([]);
      }
    } else {
      setFilteredRoutes([]);
    }
  }, [selectedBusId, buses, routes, reset, watch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col mt-8"
    >
      <div className="flex flex-col gap-y-1">
        {isLoading && <p>Loading buses...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <label htmlFor="operatorName">
          <span className="text-red-500 font-bold mr-1">*</span>Select a Bus
        </label>
        {!isLoading && !error && (
          <select
            {...register("busId", { required: "Bus is required" })}
            id="operatorName"
            className="border-2 rounded-md py-1 px-2"
          >
            <option disabled value="">
              Bus...
            </option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.operatorName}
              </option>
            ))}
          </select>
        )}
        {errors.busId && (
          <p className="text-red-500 font-semibold">{errors.busId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="route">
          <span className="text-red-500 font-bold mr-1">*</span>Select a Route
        </label>
        <select
          {...register("routeId", { required: "Route is required" })}
          id="route"
          className="border-2 rounded-md py-1 px-2"
        >
          <option value="" disabled>
            Route...
          </option>
          {filteredRoutes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.origin} - {route.destination}
            </option>
          ))}
        </select>
        {errors.routeId && (
          <p className="text-red-500 font-semibold">{errors.routeId.message}</p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="tripDate">
          <span className="text-red-500 font-bold mr-1">*</span>Trip Date
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="date"
          id="tripDate"
          min={format(new Date(), "yyy-MM-dd")}
          {...register("tripDate", {
            required: "Trip Date is required",
          })}
          placeholder="Insert Trip Date"
        />
        {errors.tripDate && (
          <p className="text-red-500 font-semibold">
            {errors.tripDate.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-2">
        <label htmlFor="tripStatus">
          <span className="text-red-500 font-bold mr-1">*</span>Trip Status
        </label>
        <div className="flex items-center justify-start gap-x-8">
          <div className="flex items-center gap-x-2">
            <input
              className="border-2 rounded-md py-1 px-2"
              name="scheduled"
              value="scheduled"
              type="radio"
              id="scheduled"
              {...register("tripStatus", {
                required: "Trip Status is required",
              })}
            />
            <label htmlFor="scheduled">Scheduled</label>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              className="border-2 rounded-md py-1 px-2"
              name="cancelled"
              value="cancelled"
              type="radio"
              id="cancelled"
              {...register("tripStatus", {
                required: "Trip Status is required",
              })}
            />
            <label htmlFor="cancelled">Cancelled</label>
          </div>
          {errors.tripStatus && (
            <p className="text-red-500 font-semibold">
              {errors.tripStatus.message}
            </p>
          )}
        </div>
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="departureTime">
          <span className="text-red-500 font-bold mr-1">*</span>Trip Departure
          Time
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="time"
          id="departureTime"
          {...register("departureTime", {
            required: "Trip Departure Time is required",
          })}
        />
        {errors.departureTime && (
          <p className="text-red-500 font-semibold">
            {errors.departureTime.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="arrivalTime">
          <span className="text-red-500 font-bold mr-1">*</span>Trip Arrival
          Time
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="time"
          id="arrivalTime"
          {...register("arrivalTime", {
            required: "Trip Arrival Time is required",
          })}
        />
        {errors.arrivalTime && (
          <p className="text-red-500 font-semibold">
            {errors.arrivalTime.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
      >
        {loading ? "Creating..." : "Create Trip Schedule"}
      </button>
    </form>
  );
};

export default TripForm;
