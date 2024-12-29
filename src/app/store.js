import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import bookingReducer from "./feature/booking/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
  },
});
