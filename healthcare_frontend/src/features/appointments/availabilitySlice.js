import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * This module manages the state related to doctors' availability using Redux Toolkit.
 * It defines asynchronous actions and reducers to handle the fetching and updating of doctor availability data.
 *
 * Features:
 * - `DoctorAvailability`: An asynchronous thunk action that posts availability data to the backend.
 *   It uses Axios for HTTP requests with an Authorization header containing a token retrieved from localStorage.
 * - `doctorAvailabilitySlice`: A slice that manages the state of doctor availability, including loading states and errors.
 *
 * State:
 * - `data`: An array that stores the availability data fetched or updated.
 * - `status`: A string that represents the current state of the network request ('idle', 'loading', 'succeeded', 'failed').
 * - `error`: A string that stores error messages from failed requests.
 *
 * The slice uses extraReducers to handle different states of the asynchronous action:
 * - `pending`: Sets the status to 'loading' and shows a loading toast.
 * - `fulfilled`: Updates the state with the fetched data, sets the status to 'succeeded', and shows a success toast.
 * - `rejected`: Sets the status to 'failed', stores the error message, and shows an error toast.
 *
 * 
 */


const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const DoctorAvailability = createAsyncThunk(
  'doctorAvailabilitySlice/doctorAvailabilitySlice',
  async (data) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const response = await axios.post('api/doctoravailability/', data, header);
    return response.data;
  },
);

export const doctorAvailabilitySlice = createSlice({
  name: 'doctorAvailabilitySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => { // extraReducers is useful for handling actions that are not related to the slice's reducers
    let TID = null;

    builder
      .addCase(DoctorAvailability.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Updating availability ⌛');
      })
      .addCase(DoctorAvailability.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        toast.success('Availability updated', { id: TID });
      })
      .addCase(DoctorAvailability.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error('Oops! something went wrong', { id: TID });
      });
  },
});

export default doctorAvailabilitySlice.reducer;