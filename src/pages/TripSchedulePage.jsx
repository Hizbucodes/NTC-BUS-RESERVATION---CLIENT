import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TripCard from "../components/TripCard";
import { useLocation, useSearchParams } from "react-router-dom";
import tripAPI from "../api/tripAPI";

const TripSchedulePage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await tripAPI.get("/search", {
          params: {
            origin: searchParams.get("origin"),
            destination: searchParams.get("destination"),
            tripDate: searchParams.get("tripDate"),
          },
        });
        setTrips(response.data.result);
      } catch (err) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (
      searchParams.get("origin") &&
      searchParams.get("destination") &&
      searchParams.get("tripDate")
    ) {
      fetchTrips();
    } else {
      setError("Missing search parameters");
    }
  }, [searchParams]);
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-y-8">
      <h1 className="text-4xl font-bold mb-4">Trip Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="md:max-w-[1024px] w-full">
        {trips.length > 0 && (
          <ul>
            {trips.map((trip) => (
              <TripCard trip={trip} key={trip.id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TripSchedulePage;
