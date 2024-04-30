import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module defines Redux state management for fetching and storing appointment types .
 * It utilizes Redux Toolkit's `createSlice` and `createAsyncThunk` for handling asynchronous API requests with ease.
 *
 * Features:
 * - `FetchAppointmentTypes`: An asynchronous thunk action that fetches appointment types from the backend.
 *   
 * It uses Axios for HTTP requests, with authorization handled via token stored in localStorage.
 * 
 * - `AppointmentTypesSlice`: A slice for appointment types that includes reducers for handling different states
 *   of the data fetching process (loading, succeeded, failed).
 *
 * State:
 * - `data`: An array to store the fetched appointment types.
 * - `status`: A string indicating the loading status, which can be 'idle', 'loading', 'succeeded', or 'failed'.
 * - `error`: A string to store error messages, if any, from the fetch operation.
 *
 * The slice manages the lifecycle of appointment types data fetching, including handling of pending,
 * fulfilled, and rejected states of the fetch operation. 
 */

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const FetchAppointmentTypes = createAsyncThunk('AppointmentTypes/AppointmentTypes', async () => {
  const token = localStorage.getItem('token');
  const header = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const response = await axios.get('api/doctor-appointment-types/', header);
  return response.data;
});

export const AppointmentTypesSlice = createSlice({
  name: 'AppointmentTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAppointmentTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(FetchAppointmentTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(FetchAppointmentTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default AppointmentTypesSlice.reducer;
