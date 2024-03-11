import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This redux slice and asynchronous thunk for handling forgotten password functionality.
 * 
 * The `ForgetPasswordfunction` is an asynchronous thunk that sends a POST request to the
 * "auth/users/reset_password/" endpoint with user data for resetting a forgotten password.
 * It utilizes Axios for HTTP requests.
 * 
 * `ForgetPasswordSlice` is a Redux slice that contains the state related to the forgotten password process.
 * It includes the initial state, reducer actions, and handles different states (loading, succeeded, failed)
 * of the asynchronous request through extraReducers.
 * 
 * Toast notifications from 'react-hot-toast' are used to provide feedback during the request lifecycle:
 * - Displays a loading toast when the request is pending.
 * - Displays a success toast when the request is fulfilled.
 * - Displays an error toast when the request is rejected.
 */

export const ForgetPasswordfunction = createAsyncThunk(
  "tasks/forgetpasswordslice",
  async (data) => {
    const response = await axios.post("auth/users/reset_password/", data);
    return response.data;
  }
);
const TID = toast();

export const ForgetPasswordSlice = createSlice({
  name: "forgetpasswordslice",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ForgetPasswordfunction.pending, (state) => {
        toast.loading("Sending email 📨", { id: TID });
        state.status = "loading";
      })
      .addCase(ForgetPasswordfunction.fulfilled, (state, action) => {
        toast.success("Email Sent", { id: TID });

        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(ForgetPasswordfunction.rejected, (state, action) => {
        state.status = "failed";
        toast.error("Failed to send reset email. Please check your email address or try again later.", {
          id: TID,
        });
        state.error = action.error.message;
      });
  },
});

export default ForgetPasswordSlice.reducer;
