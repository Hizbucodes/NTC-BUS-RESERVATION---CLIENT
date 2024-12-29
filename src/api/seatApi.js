import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API_SEATS,
  headers: {
    "Content-Type": "application/json",
  },
});
