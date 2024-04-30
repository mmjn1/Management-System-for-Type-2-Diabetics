import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module defines the Redux state management for fetching doctor-specific time slots using Redux Toolkit.
 * It handles asynchronous API requests to retrieve available time slots for doctors, which are essential for scheduling appointments.
 *
 * Features:
 * - `fetchTimeSlots`: An asynchronous thunk action that fetches time slots for a specific doctor from the backend.
 *   It uses Axios for HTTP requests, with authorization handled via a token stored in localStorage.
 * - `TimeSlotsSlice`: A slice for managing the state of time slots, including reducers for handling different states
 *   of the data fetching process (loading, succeeded, failed).
 *
 * State:
 * - `data`: An array to store the fetched time slots.
 * - `status`: A string indicating the loading status, which can be 'idle', 'loading', 'succeeded', or 'failed'.
 * - `error`: A string to store error messages, if any, from the fetch operation.
 *
 * The slice manages the lifecycle of time slots data fetching, including handling of pending,
 * fulfilled, and rejected states of the fetch operation. 
 */

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchTimeSlots = createAsyncThunk('locations/fetchTimeSlots', async (id) => {
  const token = localStorage.getItem('token');
  const header = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const response = await axios.get(`api/timeslots/?doctor_id=${id}`, header);
  return response.data;
});

export const TimeSlotsSlice = createSlice({
  name: 'TimeSlots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default TimeSlotsSlice.reducer;
