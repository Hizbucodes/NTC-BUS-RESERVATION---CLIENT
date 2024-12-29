import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import routeApi from "../api/routeApi";
import { IoMdAdd } from "react-icons/io";
import busApi from "../api/busApi";

const BusFormUpdate = () => {
  const { loading, token } = useSelector((state) => state.auth);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      operatorName: "",
      capacity: "",
      busType: "",
      amenities: [],
      licensePlate: "",
      routeId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  useEffect(() => {
    const fetchRoutes = async () => {
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
    const fetchBuses = async () => {
      try {
        const response = await busApi.get("/getAllBuses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBuses(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching buses:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchBuses();
  }, [token]);

  useEffect(() => {
    if (!selectedBus) {
      reset();
      return;
    }

    const busDetails = buses.find(
      (bus) => bus.id === parseInt(selectedBus, 10)
    );
    if (busDetails) {
      const { operatorName, capacity, licensePlate, routeId } = busDetails;
      reset({ operatorName, capacity, licensePlate, routeId });
    }
  }, [selectedBus, buses, reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      capacity: parseInt(data.capacity, 10),
      routeId: parseInt(data.routeId, 10),
    };

    try {
      await busApi.patch(`/${selectedBus}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Bus updated successfully");
    } catch (error) {
      console.error(
        "Error updating bus:",
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
        <label htmlFor="busSelect" className="block font-bold mb-2">
          Select Bus
        </label>
        <select
          id="busSelect"
          className="border-2 rounded-md py-2 px-3 w-full"
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
        >
          <option value="">Select a bus</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {`${bus.operatorName} - ${bus.licensePlate}`}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full rounded-r-md px-5 text-start gap-y-5 flex flex-col"
      >
        <div className="flex flex-col gap-y-1">
          <label htmlFor="operatorName">Operator Name</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="text"
            id="operatorName"
            {...register("operatorName", {
              required: "Operator Name is required",
            })}
            placeholder="Enter Operator Name"
          />
          {errors.operatorName && (
            <p className="text-red-500 font-semibold">
              {errors.operatorName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="capacity">Capacity</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="number"
            id="capacity"
            {...register("capacity", {
              required: "Capacity is required",
              min: { value: 1, message: "Capacity must be at least 1" },
            })}
            placeholder="Enter Capacity"
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
            {...register("busType")}
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
            <p className="text-red-500 font-semibold">
              {errors.busType.message}
            </p>
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

        <div className="flex flex-col gap-y-1">
          <label htmlFor="licensePlate">License Plate</label>
          <input
            className="border-2 rounded-md py-1 px-2"
            type="text"
            id="licensePlate"
            {...register("licensePlate", {
              required: "License Plate is required",
            })}
            placeholder="Enter License Plate"
          />
          {errors.licensePlate && (
            <p className="text-red-500 font-semibold">
              {errors.licensePlate.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="routeId">Route</label>
          <select
            id="routeId"
            className="border-2 rounded-md py-2 px-3 w-full"
            {...register("routeId", { required: "Route is required" })}
          >
            <option value="">Select a route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {`${route.origin} → ${route.destination}`}
              </option>
            ))}
          </select>
          {errors.routeId && (
            <p className="text-red-500 font-semibold">
              {errors.routeId.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity mt-8"
          disabled={!selectedBus}
        >
          {loading ? "Updating..." : "Update Bus"}
        </button>
      </form>
    </div>
  );
};

export default BusFormUpdate;
