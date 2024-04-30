import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * This module manages the Redux state for fetching appointments specific to a patient using Redux Toolkit.
 * It handles asynchronous API requests to retrieve a patient's appointments based on their ID.
 *
 * Features:
 * - `fetchAppointmentByPatient`: An asynchronous thunk action that fetches appointments for a specific patient.
 *   It uses Axios for HTTP requests, with authorization handled via a token stored in localStorage.
 * - `AppointmentByPatientSlice`: A slice for managing the state of patient-specific appointments, including reducers
 *   for handling different states of the data fetching process (loading, succeeded, failed).
 *
 * State:
 * - `data`: An array to store the fetched appointments.
 * - `status`: A string indicating the loading status, which can be 'idle', 'loading', 'succeeded', or 'failed'.
 * - `error`: A string to store error messages, if any, from the fetch operation.
 *
 * The slice manages the lifecycle of appointment data fetching, including handling of pending,
 * fulfilled, and rejected states of the fetch operation. 
 */

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchAppointmentByPatient = createAsyncThunk(
  'AppointmentTypes/fetchAppointmentPatient',
  async (id) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const response = await axios.get(`api/get-patient-appointment-pid/?patient_id=${id}`, header);
    return response.data;
  },
);

export const AppointmentByPatientSlice = createSlice({
  name: 'fetchAppointmentPatient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAppointmentByPatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointmentByPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAppointmentByPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default AppointmentByPatientSlice.reducer;
