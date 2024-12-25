import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const BusForm = () => {
  const { loading } = useSelector((state) => state.auth);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      operatorName: "",
      capacity: 0,
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
        <label htmlFor="operatorName">Operator Name</label>
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
        <label htmlFor="capacity">Bus Seat Capacity</label>
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
        <label htmlFor="busType">Bus Type</label>
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

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="busAmenities">Bus Amenities (Optional)</label>
        {fields.map((amenity, index) => (
          <div key={amenity.id}>
            <input
              id="busAmenities"
              className="border-2 rounded-md py-1 px-2 "
              {...register(`amenities.${index}.name`)}
              placeholder="Amenity Name"
            />
            {errors.amenities?.[index]?.name && (
              <p className="text-red-500 font-semibold">
                {errors.amenities[index].name.message}
              </p>
            )}

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                Remove Amenity
              </button>
            )}
          </div>
        ))}
        <button
          className="border-2 font-semibold rounded-md py-1 px-2 bg-white"
          type="button"
          onClick={() => append({ name: "" })}
        >
          Add Amenity
        </button>
      </div>

      <div className=" flex flex-col gap-y-1">
        <label htmlFor="licensePlate">License Plate</label>
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
        <label htmlFor="busRoute">Select Bus Route</label>
        <select
          {...register("routeId", { required: "Bus Route is required" })}
          id="busRoute"
          className="border-2 rounded-md py-1 px-2"
        >
          <option value="" disabled>
            Bus Route...
          </option>
          <option value="kandy">Kandy</option>
          <option value="colombo">Colombo</option>
          <option value="matale">Matale</option>
        </select>
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
