import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
/**
 * This module handles the fetching of doctor data.
 * 
 * The `fetchDoctor` async thunk is exported, which is used to send a GET request to the "api/api/doctors/" endpoint. 
 * The response from the API (the list of doctors) is returned as the fulfilled value of the thunk.
 * 
 * The `DoctorSlice` slice is created with the name "doctorslice" and an initial state. 
 * The initial state has a `data` array, a `status` of "idle", and an `error` of null.
 * 
 * The slice doesn't define any additional reducers, but it does define extra reducers for the `fetchDoctor` async thunk:
 * - When the thunk is dispatched and the request is pending, the status is set to "loading".
 * - When the request is completed and the thunk is fulfilled, the status is set to "succeeded", and the `data` is updated with the response from the API.
 * - If the request fails and the thunk is rejected, the status is set to "failed", and the `error` is updated with the error message from the rejection.
 * 
 * The reducer function from the `DoctorSlice` slice is exported as the default export of this module. 
 * This reducer handles actions dispatched with the `fetchDoctor` async thunk and updates the state accordingly.
 */
export const fetchDoctor = createAsyncThunk("tasks/doctorslice", async () => {
    const response = await axios.get("api/api/doctors/");
    return response.data;
},);

export const DoctorSlice = createSlice({
    name: "doctorslice", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(fetchDoctor.pending, (state) => {
                state.status = "loading";

            })
            .addCase(fetchDoctor.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchDoctor.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default DoctorSlice.reducer;