import { format } from "date-fns";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const TripForm = () => {
  const { loading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = (data) => {
    console.log(console.log(data));
  };
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col mt-8"
    >
      <div className=" flex flex-col gap-y-1">
        <label htmlFor="operatorName">
          <span className="text-red-500 font-bold mr-1">*</span>Select a Bus
        </label>
        <select
          {...register("busId", { required: "Bus is required" })}
          id="operatorName"
          className="border-2 rounded-md py-1 px-2"
        >
          <option value="" disabled>
            Bus...
          </option>
          <option value="Normal">Normal</option>
          <option value="Semi-Luxury">Semi - Luxury</option>
          <option value="Luxury">Luxury</option>
        </select>
        {errors.busId && (
          <p className="text-red-500 font-semibold">{errors.busId.message}</p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
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
          <option value="Colombo">Colomo</option>
          <option value="Kandy">Kandy</option>
          <option value="Matale">Matale</option>
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
