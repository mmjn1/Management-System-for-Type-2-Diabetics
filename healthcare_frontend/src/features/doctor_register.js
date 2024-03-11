import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This module handles the registration of a doctor.
 * 
 * The `registerDoctor` async thunk is exported, which is used to send a POST request to the "api/createDoctor/" endpoint. 
 * The data for the request is provided as an argument when dispatching the thunk. 
 * The response from the API (the newly created doctor) is returned as the fulfilled value of the thunk.
 * 
 * The `registerDoctorSlice` slice is created with the name "registerDoctor" and an initial state. 
 * The initial state has a `data` array, a `status` of "idle", and an `error` of null.
 *
 * The slice doesn't define any additional reducers, but it does define extra reducers for the `registerDoctor` async thunk:
 * - When the thunk is dispatched and the request is pending, a loading toast is displayed and the status is set to "loading".
 * - When the request is completed and the thunk is fulfilled, a success toast is displayed, the status is set to "succeeded", and the `data` is updated with the response from the API.
 * - If the request fails and the thunk is rejected, an error toast is displayed, the status is set to "failed", and the `error` is updated with the error message from the rejection.
 
 * This reducer handles actions dispatched with the `registerDoctor` async thunk and updates the state accordingly.
 */

export const registerDoctor = createAsyncThunk("tasks/registerslice", async (data) => {
    const response = await axios.post("/api/createDoctor/", data);
    return response.data;
},);
const TID = toast();

export const registerDoctorSlice = createSlice({
    name: "registerDoctor", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(registerDoctor.pending, (state) => {
                toast.loading('Creating Account', {id: TID})
                state.status = "loading";

            })
            .addCase(registerDoctor.fulfilled, (state, action) => {
                state.status = "succeeded";
                toast.success('Success! Please check your inbox for an activation email to complete your registration', {id: TID})
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(registerDoctor.rejected, (state, action) => {
                toast.error("This email is already in use. Please try a different one or log in to your existing account.", {
                    id: TID,
                });
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default registerDoctorSlice.reducer;