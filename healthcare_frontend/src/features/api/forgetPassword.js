import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

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
        toast.error("Oops! Something went wrong", {
          id: TID,
        });
        state.error = action.error.message;
      });
  },
});

export default ForgetPasswordSlice.reducer;
