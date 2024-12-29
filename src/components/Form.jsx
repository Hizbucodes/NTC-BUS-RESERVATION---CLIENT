import React, { useEffect, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { GiBus } from "react-icons/gi";
import { HiArrowLongRight } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import routeApi from "../api/routeApi";

const Form = () => {
  const [busRoutes, setBusRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusRoutes = async () => {
      try {
        setLoading(true);
        const response = await routeApi.get("/getAllRoutes");
        const data = response.data;
        setBusRoutes(data.data);
      } catch (err) {
        console.log("Error while getting busRoutes: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusRoutes();
  }, []);

  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    const searchParams = new URLSearchParams(data).toString();
    navigate(`/trips?${searchParams}`);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex lg:flex-row flex-col items-start lg:items-center justify-between py-5 gap-y-8"
    >
      <div className="flex flex-col items-start justify-center gap-y-2 w-full lg:w-60">
        <label htmlFor="from" className="flex items-center">
          <GiBus className="mr-2 text-xl" />
          Origin
        </label>
        <select
          {...register("origin", { required: "Origin is required" })}
          id="from"
          className="bg-zinc-100 rounded-md p-2 font-semibold w-full"
        >
          {loading ? (
            <option value="" disabled>
              Loading Bus Routes...
            </option>
          ) : (
            busRoutes.map((Origin) => (
              <option value={Origin.origin} key={Origin.id}>
                {Origin.origin}
              </option>
            ))
          )}
        </select>
        {errors.origin && (
          <p className="text-red-500 font-semibold">{errors.origin.message}</p>
        )}
      </div>

      <div className="flex flex-col items-start justify-center gap-y-2 w-full lg:w-60">
        <label htmlFor="to" className="flex items-center">
          <GiBus className="mr-2 text-xl" />
          Destination
        </label>
        <select
          {...register("destination", { required: "Destination is required" })}
          id="to"
          className="bg-zinc-100 rounded-md p-2 font-semibold w-full"
        >
          {loading ? (
            <option value="" disabled>
              Loading routes...
            </option>
          ) : (
            busRoutes.map((Destination) => (
              <option value={Destination.destination} key={Destination.id}>
                {Destination.destination}
              </option>
            ))
          )}
        </select>
        {errors.destination && (
          <p className="text-red-500 font-semibold">
            {errors.destination.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start justify-center gap-y-2 w-full lg:w-60">
        <label htmlFor="tripDate" className="flex items-center">
          <CiCalendarDate className="mr-2 text-xl" />
          Departure
        </label>
        <input
          {...register("tripDate", {
            required: "Departure is required",
          })}
          className="bg-zinc-100 rounded-md p-2 font-semibold w-full"
          type="date"
          id="tripDate"
          min={format(new Date(), "yyy-MM-dd")}
        />
        {errors.tripDate && (
          <p className="text-red-500 font-semibold">
            {errors.tripDate.message}
          </p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-black hover:opacity-80 duration-200 ease-in-out transition-all group flex items-center justify-center text-white md:mt-7 rounded-md px-8 py-3 relative w-full lg:w-60"
      >
        <p className="group-hover:animate-pulse">
          {isSubmitting ? "Searching Buses" : "Search Buses"}
        </p>
        <HiArrowLongRight
          className="absolute duration-200 ease-in-out transition-all group-hover:right-3
      lg:group-hover:right-1 right-5 sm:right-20 lg:right-3 text-xl group-hover:animate-pulse"
        />
      </button>
    </form>
  );
};

export default Form;
