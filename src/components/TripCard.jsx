import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const handleReserveSeat = () => {
    navigate(`/seat-layout/${trip.Bus.id}`, {
      state: {
        tripId: trip.id,
      },
    });
  };
  return (
    <li
      key={trip.id}
      className="border bg-white p-4 mb-2 rounded-md shadow-lg flex flex-col my-8 gap-y-10"
    >
      <div className="flex md:flex-row flex-col gap-y-5 items-center justify-between">
        <div className="text-lg font-bold flex space-x-5 items-center justify-center">
          <h2>{trip.Route.origin}</h2> <BsArrowRight fontSize={30} />{" "}
          <h2>{trip.Route.destination}</h2>
        </div>

        <button
          type="button"
          className="bg-black text-white rounded-md md:w-40 w-36 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity shadow-lg shadow-black/50"
          onClick={handleReserveSeat}
        >
          Reserve Seat
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
        <p>
          Date:{" "}
          <span className="font-semibold">
            {new Date(trip.tripDate).toLocaleDateString()}
          </span>
        </p>
        <p>
          Departure: <span className="font-semibold">{trip.departureTime}</span>
        </p>
        <p>
          Arrival: <span className="font-semibold">{trip.arrivalTime}</span>
        </p>
        <p>
          Bus:{" "}
          <span className="font-semibold">
            {trip.Bus.operatorName} ({trip.Bus.licensePlate})
          </span>
        </p>
        <p>
          Distance:{" "}
          <span className="font-semibold">{trip.Route.distance} km</span>
        </p>
        <p>
          Duration:{" "}
          <span className="font-semibold">{trip.Route.duration} hours</span>
        </p>
      </div>
    </li>
  );
};

export default TripCard;
