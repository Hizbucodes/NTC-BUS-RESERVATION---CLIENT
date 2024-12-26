import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import routeApi from "../api/routeApi";
import { IoMdAdd } from "react-icons/io";
import { PiTrashLight } from "react-icons/pi";

const BusForm = () => {
  const { loading, token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routes, setRoutes] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      operatorName: "",
      capacity: null,
      busType: "",
      amenities: [],
      licensePlate: "",
      routeId: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  const onSubmit = (data) => {
    data.capacity = parseInt(data.capacity, 10);
    data.routeId = parseInt(data.routeId, 10);

    console.log(data);
  };
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const response = await routeApi.get("/getAllRoutes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRoutes(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchRoutes();
    }
  }, [token]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col mt-8"
    >
      <div className=" flex flex-col gap-y-1">
        <label htmlFor="operatorName">
          <span className="text-red-500 font-bold mr-1">*</span>Operator Name
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="text"
          id="operatorName"
          {...register("operatorName", {
            required: "Operator Name is required",
          })}
          placeholder="Insert Operator Name"
        />
        {errors.operatorName && (
          <p className="text-red-500 font-semibold">
            {errors.operatorName.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="capacity">
          <span className="text-red-500 font-bold mr-1">*</span>Bus Seat
          Capacity
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="number"
          id="capacity"
          {...register("capacity", {
            required: "Capacity is required",
            min: { value: 10, message: "Minimum bus seat should be 10" },
          })}
          placeholder="Insert Bus Seat Capacity"
        />
        {errors.capacity && (
          <p className="text-red-500 font-semibold">
            {errors.capacity.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="busType">
          <span className="text-red-500 font-bold mr-1">*</span>Bus Type
        </label>
        <select
          {...register("busType", { required: "Bus Type is required" })}
          id="busType"
          className="border-2 rounded-md py-1 px-2"
        >
          <option value="" disabled>
            Bus Type...
          </option>
          <option value="Normal">Normal</option>
          <option value="Semi-Luxury">Semi - Luxury</option>
          <option value="Luxury">Luxury</option>
        </select>
        {errors.busType && (
          <p className="text-red-500 font-semibold">{errors.busType.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="busAmenities">Bus Amenities (Optional)</label>
        {fields.map((amenity, index) => (
          <div key={amenity.id} className="flex items-center">
            <input
              id={`busAmenities-${index}`}
              className="border-2 rounded-md py-1 px-2"
              {...register(`amenities.${index}.name`)}
              placeholder="Amenity Name"
            />
            {errors.amenities?.[index]?.name && (
              <p className="text-red-500 font-semibold">
                {errors.amenities[index].name.message}
              </p>
            )}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className=" ml-2 flex items-center gap-x-2"
              >
                Remove Amenity
                <PiTrashLight className="text-xl" />
              </button>
            )}
          </div>
        ))}
        <button
          className="border-2 font-semibold rounded-md py-1 px-2 bg-white flex items-center justify-center gap-x-2"
          type="button"
          onClick={() => append({ name: "" })}
        >
          Add Amenity
          <IoMdAdd className="text-xl" />
        </button>
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="licensePlate">
          <span className="text-red-500 font-bold mr-1">*</span>License Plate
        </label>
        <input
          className="border-2 rounded-md py-1 px-2"
          type="text"
          id="licensePlate"
          {...register("licensePlate", {
            required: "License Plate is required",
          })}
          placeholder="Insert Bus License Plate"
        />
        {errors.licensePlate && (
          <p className="text-red-500 font-semibold">
            {errors.licensePlate.message}
          </p>
        )}
      </div>

      <div className=" flex flex-col gap-y-1">
        {isLoading && <p>Loading routes...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <label htmlFor="busRoute">
          <span className="text-red-500 font-bold mr-1">*</span>Select Bus Route
        </label>
        {!isLoading && !error && (
          <select
            {...register("routeId", { required: "Bus Route is required" })}
            id="busRoute"
            className="border-2 rounded-md py-1 px-2"
          >
            <option value="" disabled>
              Bus Route...
            </option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.origin} - {route.destination}
              </option>
            ))}
          </select>
        )}
        {errors.routeId && (
          <p className="text-red-500 font-semibold">{errors.routeId.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
      >
        {loading ? "Creating..." : "Create Bus"}
      </button>
    </form>
  );
};

export default BusForm;
