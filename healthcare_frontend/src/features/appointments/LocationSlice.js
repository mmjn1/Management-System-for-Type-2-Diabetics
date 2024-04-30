import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module defines the Redux state management for fetching location data using Redux Toolkit.
 * 
 * It handles asynchronous API requests to retrieve a list of locations of where appointments will be held.
 *
 * 
 * Features:
 * - `fetchLocations`: An asynchronous thunk action that fetches location data from the backend.
 *   It uses Axios for HTTP requests to retrieve data from 'api/locations/' endpoint.
 * 
 * - `LocationSlice`: A slice for managing the state of location data, including reducers for handling different states
 *   of the data fetching process (loading, succeeded, failed).
 *
 * State:
 * - `data`: An array to store the fetched location data.
 * - `status`: A string indicating the loading status, which can be 'idle', 'loading', 'succeeded', or 'failed'.
 * - `error`: A string to store error messages, if any, from the fetch operation.
 *
 * The slice manages the lifecycle of location data fetching, including handling of pending,
 * fulfilled, and rejected states of the fetch operation. 
 */


const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
  const response = await axios.get('api/locations/');
  return response.data;
});

export const LocationSlice = createSlice({
  name: 'Location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default LocationSlice.reducer;
