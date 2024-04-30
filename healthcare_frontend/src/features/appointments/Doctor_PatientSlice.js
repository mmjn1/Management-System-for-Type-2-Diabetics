import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module manages the Redux state for fetching doctor-patient relationships using Redux Toolkit.
 * It handles asynchronous API requests to retrieve a list of patients associated with a specific doctor,
 * which is crucial for managing patient care and appointments.
 *
 * Features:
 * - `FetchDoctorPatient`: An asynchronous thunk action that fetches the list of patients for a doctor from the backend.
 *
 *   It uses Axios for HTTP requests, with authorization handled via a token stored in localStorage.
 * 
 * - `DoctorPatientSlice`: A slice for managing the state of doctor-patient data, including reducers for handling different states
 *   of the data fetching process (loading, succeeded, failed).
 *
 * State:
 * - `data`: An array to store the fetched list of patients.
 * - `status`: A string indicating the loading status, which can be 'idle', 'loading', 'succeeded', or 'failed'.
 * - `error`: A string to store error messages, if any, from the fetch operation.
 *
 * The slice manages the lifecycle of doctor-patient data fetching, including handling of pending,
 * fulfilled, and rejected states of the fetch operation. 
 */

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const FetchDoctorPatient = createAsyncThunk('DoctorPatient/DoctorPatientSlice', async () => {
  const token = localStorage.getItem('token');
  const header = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const response = await axios.get('api/doctor/patients/', header);
  return response.data;
});

export const DoctorPatientSlice = createSlice({
  name: 'DoctorPatientSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchDoctorPatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(FetchDoctorPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(FetchDoctorPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default DoctorPatientSlice.reducer;
