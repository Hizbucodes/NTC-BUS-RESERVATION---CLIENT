import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import busApi from "../api/busApi";

const BusPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const response = await busApi.get("/getAllBuses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;

        setBuses(data);
      } catch (err) {
        setError(err.response?.data?.message || "An unexpected error occured");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [token]);

  return (
    <section className="w-full min-h-screen">
      <h1 className="text-center font-bold text-4xl my-8">All Buses</h1>
      <div className="flex pt-12 gap-x-20 flex-wrap justify-center gap-y-12">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && buses.length === 0 && (
          <p>No Buses were added by NTC admin</p>
        )}
        {buses.map((bus) => (
          <div
            className="bg-white shadow-xl shadow-black/50 rounded-md h-[250px] min-w-[320px] p-3"
            key={bus.id}
          >
            <div>
              <p className="font-bold text-center text-2xl">
                {bus.operatorName}
              </p>
            </div>
            <div className="grid grid-cols-2 mt-8 place-self-center gap-x-20 gap-y-5">
              <div>
                <label htmlFor="capacity" className="font-semibold">
                  Capacity
                </label>
                <p id="capacity">{bus.capacity}</p>
              </div>

              <div>
                <label htmlFor="busType" className="font-semibold">
                  Bus Type
                </label>
                <p id="busType">{bus.busType}</p>
              </div>

              <div>
                <label htmlFor="amenities" className="font-semibold">
                  Amenities
                </label>
                <ul>
                  {Array.isArray(bus.amenities) && bus.amenities.length > 0 ? (
                    bus.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))
                  ) : (
                    <p>Not Provided</p>
                  )}
                </ul>
              </div>

              <div>
                <label htmlFor="licensePlate" className="font-semibold">
                  License Plate
                </label>
                <p id="licensePlate">{bus.licensePlate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusPage;
