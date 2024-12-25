import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const BusRouteForm = () => {
  const { loading } = useSelector((state) => state.auth);
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

  const onSubmit = (data) => {
    console.log(console.log(data));
  };
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full rounded-r-md px-5 text-start gap-y-3 flex flex-col mt-8"
    >
      <div className=" flex flex-col gap-y-1">
        <label htmlFor="origin">Origin</label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="text"
          id="origin"
          {...register("origin", { required: "Origin is required" })}
          placeholder="Insert Origin"
        />
        {errors.origin && (
          <p className="text-red-500 font-semibold">{errors.origin.message}</p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
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

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="distance">Distance (Km)</label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="text"
          id="distance"
          {...register("distance", {
            required: "Distance is required",
          })}
          placeholder="Insert Distance in Kilometres"
        />
        {errors.distance && (
          <p className="text-red-500 font-semibold">
            {errors.distance.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="duration">Duration (Hrs)</label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="text"
          id="duration"
          {...register("duration", {
            required: "Duration is required",
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
      >
        {loading ? "Creating..." : "Create Route"}
      </button>
    </form>
  );
};

export default BusRouteForm;