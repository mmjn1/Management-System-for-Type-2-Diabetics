import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Asynchronous thunk for fetching patient data.
 * This thunk sends a GET request to the specified patient endpoint to the Django backend.
 * Upon successful fetch, it returns the list of patients' data.
 * In case of failure, it handles and forwards the error for further processing.
 */
export const fetchPatient = createAsyncThunk("tasks/patientslice", async () => {
  const response = await axios.get("/api/api/patient/");
  return response.data;
});

/**
 * The PatientSlice is for managing patient data within the application.
 * It handles the state related to patient information, including their retrieval status and errors.
 *
 *
 * extraReducers:
 * - Handles the lifecycle of the fetchPatient async thunk by updating the state to reflect the current status
 *   of the patient data fetching process. It sets the status to 'loading' when the request is pending and
 *   updates the data and sets the status to 'succeeded' upon successful fetch, and records the error and
 *   sets the status to 'failed' if the request is rejected.
 */

export const PatientSlice = createSlice({
  name: "patientslice",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default PatientSlice.reducer;
