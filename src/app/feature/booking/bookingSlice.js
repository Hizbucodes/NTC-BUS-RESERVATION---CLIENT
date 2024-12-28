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
      return response.data.data;
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
      });
  },
});

export const { toggleSeatSelection, clearSelection, setError, clearError } =
  bookingSlice.actions;
export default bookingSlice.reducer;
