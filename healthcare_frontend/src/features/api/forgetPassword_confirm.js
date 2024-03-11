import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This module defines Redux logic for handling password reset confirmation using @reduxjs/toolkit, axios, and react-hot-toast.
 * 
 * The `ForgetPasswordConfirm` asynchronous thunk sends a POST request to the "auth/users/reset_password_confirm/" 
 * endpoint with the user's reset data. If successful, the backend should confirm the user's password reset.
 * 
 * `ForgetPasswordConfirmSlice` manages the Redux state for this password reset confirmation process. It initializes
 * with default data, status, and error states, and updates these states based on the async thunk's lifecycle:
 * - Displays a loading toast when the password reset confirmation is in process.
 * - Shows a success toast upon successful password change.
 * - Shows an error toast if the password reset fails due to incorrect reset code or other issues.
 * 
 * The state and actions in this slice facilitate integration of the password reset confirmation process into a React application,
 * enhancing user feedback and interactivity during the password reset flow.
 */


export const ForgetPasswordConfirm = createAsyncThunk(
    "tasks/forgetpasswordConfirmslice", 
    async (data) => {
    
    // Making a POST request to the password reset confirmation endpoint
    const response = await axios.post("auth/users/reset_password_confirm/", data);
    return response.data;
},);

// Creating the slice for the forget password confirmation feature
export const ForgetPasswordConfirmSlice = createSlice({
    name: "forgetpasswordConfirmslice", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {

        const TID = toast();

        builder
            .addCase(ForgetPasswordConfirm.pending, (state) => {
                state.status = "loading";
                toast.loading('Changing Password ⌛', {id: TID})

            })
            .addCase(ForgetPasswordConfirm.fulfilled, (state, action) => {
                state.status = "succeeded";
                toast.success('Password Changed', {id: TID})

                state.data = action.payload;
            })
            .addCase(ForgetPasswordConfirm.rejected, (state, action) => {
                state.status = "failed";
                toast.error("Unable to change password. Please ensure your reset code is correct and try again.", {
                    id: TID,
                });
                state.error = action.error.message;
            });
    },
});

export default ForgetPasswordConfirmSlice.reducer;