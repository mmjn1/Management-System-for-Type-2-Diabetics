
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module manages the Redux state for fetching available time slots for doctors using Redux Toolkit.
 * It handles asynchronous API requests to retrieve time slots based on doctor ID and selected date.
 *
 * Features:
 * - `fetchDoctorTimeSlots`: An asynchronous thunk action that fetches available time slots for a specific doctor
 *   on a specific date. It uses Axios for HTTP requests, with authorization handled via a token stored in localStorage.
 * - `DoctorTimeSlotsSlice`: A slice for managing the state of doctor time slots, including reducers for handling different states
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

export const fetchDoctorTimeSlots = createAsyncThunk('slots/fetchDoctorTimeSlots', async (data) => {
  const token = localStorage.getItem('token');
  const header = {headers: {Authorization: `Token ${token}`}};
  const response = await axios.get(`api/doctor-availability/${data.id}/${data.date}/`, header);
  return response.data;
});

export const DoctorTimeSlotsSlice = createSlice({
  name: 'DoctorTimeSlots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorTimeSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctorTimeSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDoctorTimeSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default DoctorTimeSlotsSlice.reducer;
