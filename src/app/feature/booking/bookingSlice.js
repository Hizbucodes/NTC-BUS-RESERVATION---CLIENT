import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingApi from "../../../api/bookingApi";
import seatApi from "../../../api/seatApi";

const BOOKING_TIMEOUT = 10 * 60 * 1000;

export const fetchSeats = createAsyncThunk(
  "booking/fetchSeats",
  async (busId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await seatApi.get(`getSeats/${busId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sortedSeats = response.data.data.sort(
        (a, b) => a.seatNumber - b.seatNumber
      );
      return sortedSeats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reserveSeats = createAsyncThunk(
  "booking/reserveSeats",
  async ({ tripId, seatIds }, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await bookingApi.post(
        "/reserve",
        {
          tripId,
          seatIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeBooking = createAsyncThunk(
  "booking/completeBooking",
  async (bookingDetails, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await bookingApi.post("/complete", bookingDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Booking Slice: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete booking"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await bookingApi.patch(
        `/cancelBooking/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const resetSeatStatus = createAsyncThunk(
  "seats/resetSeatStatus",
  async (seatIds, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await bookingApi.post(
        "/reset",
        { seatIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to reset seat status"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    seats: [],
    selectedSeats: [],
    loading: false,
    error: null,
    totalFare: 0,
    reservationDetails: null,
    reservationExpiry: null,
    successMessage: null,
    resetStatus: null,
  },
  reducers: {
    toggleSeatSelection: (state, action) => {
      const seatId = action.payload;
      const index = state.selectedSeats.indexOf(seatId);

      if (index === -1 && state.selectedSeats.length < 4) {
        state.selectedSeats.push(seatId);
      } else if (index !== -1) {
        state.selectedSeats.splice(index, 1);
      }
    },
    clearSelection: (state) => {
      state.selectedSeats = [];
      state.totalFare = 0;
      state.reservationDetails = null;
      state.reservationExpiry = null;
    },
    clearBookingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reserveSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.reservationDetails = action.payload;
        state.totalFare = action.payload.totalFare;
        state.reservationExpiry = new Date(
          Date.now() + BOOKING_TIMEOUT
        ).toISOString();
      })
      .addCase(reserveSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetSeatStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetSeatStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.resetStatus = action.payload.status;
        state.successMessage = action.payload.message;
      })
      .addCase(resetSeatStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(completeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const {
  toggleSeatSelection,
  clearSelection,
  setError,
  clearError,
  clearBookingState,
} = bookingSlice.actions;
export default bookingSlice.reducer;
