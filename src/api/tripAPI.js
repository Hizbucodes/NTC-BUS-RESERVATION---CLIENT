import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API_TRIPS,
  headers: {
    "Content-Type": "application/json",
  },
});
