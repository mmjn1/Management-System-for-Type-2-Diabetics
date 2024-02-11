import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This module handles the registration of a patient.
 * 
 * The `registerUserPatient` async thunk is exported, which is used to send a POST request to the "api/createPatient/" endpoint. 
 * The data for the request is provided as an argument when dispatching the thunk. 
 * The response from the API (the newly created patient) is returned as the fulfilled value of the thunk.
 * 
 * The `registerPatientSlice` slice is created with the name "registerPatient" and an initial state. 
 * The initial state has a `data` array, a `status` of "idle", and an `error` of null.
 * 
 * The slice doesn't define any additional reducers, but it does define extra reducers for the `registerUserPatient` async thunk:
 * - When the thunk is dispatched and the request is pending, a loading toast is displayed and the status is set to "loading".
 * - When the request is completed and the thunk is fulfilled, a success toast is displayed, the status is set to "succeeded", and the `data` is updated with the response from the API.
 * - If the request fails and the thunk is rejected, an error toast is displayed, the status is set to "failed", and the `error` is updated with the error message from the rejection.
 * 
 * The reducer function from the `registerPatientSlice` slice is exported as the default export of this module. 
 * This reducer handles actions dispatched with the `registerUserPatient` async thunk and updates the state accordingly.
 */
export const registerUserPatient = createAsyncThunk("tasks/registerPatientSlice", async (data) => {
    const response = await axios.post("api/createPatient/", data);
    return response.data;
},);
const TID = toast();

export const registerPatientSlice = createSlice({
    name: "registerPatient", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(registerUserPatient.pending, (state) => {
                toast.loading('Creating Account', {id: TID})
                state.status = "loading";
            })
            .addCase(registerUserPatient.fulfilled, (state, action) => {
                toast.success('Check your email and activate account', {id: TID})
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(registerUserPatient.rejected, (state, action) => {
                toast.error("Oops! Something went wrong", {
                    id: TID,
                });
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default registerPatientSlice.reducer;