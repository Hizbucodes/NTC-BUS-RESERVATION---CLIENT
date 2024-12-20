import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import tripAPI from "../api/tripAPI";
import TripCard from "../components/TripCard";
import { useSelector } from "react-redux";
import trip_not_found_image from "../assets/trip-not-found.jpg";

const TripSchedulePage = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);

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
          headers: {
            Authorization: `Bearer ${token}`,
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

  let content;

  content = (
    <img
      className="w-[20rem] mt-10"
      src={trip_not_found_image}
      alt="not_found"
      title="Trips Not Found - NTC"
    />
  );

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-y-8">
      <h1 className="text-4xl font-bold mb-4">{!error && "Trip Results"}</h1>
      {loading && <p>Loading...</p>}
      {error && (
        <>
          {content}
          <p className="text-xl md:text-4xl text-center font-semibold pt-8">
            {error}&#128533;
          </p>

          <span>
            Redirect to{" "}
            <Link
              to={"/"}
              className="font-semibold text-sky-500 underline underline-offset-2"
            >
              Home Page
            </Link>
          </span>
        </>
      )}

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
