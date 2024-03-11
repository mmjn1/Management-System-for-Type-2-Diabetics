import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Redux slice and asynchronous thunk for handling password reset confirmation functionality.
 * 
 * The `ForgetPasswordConfirm` is an asynchronous thunk that sends a POST request to the
 * "auth/users/reset_password_confirm/" endpoint with user data for confirming a password reset.
 * It uses Axios for making HTTP requests.
 * 
 * `ForgetPasswordConfirmSlice` is a Redux slice containing state related to the password reset confirmation process.
 * It defines an initial state, reducer actions, and handles the different states (loading, succeeded, failed)
 * of the asynchronous request in extraReducers.
 * 
 * Toast notifications from 'react-hot-toast' are utilized to provide user feedback during the request lifecycle:
 * - Displays a loading toast when the request is pending.
 * - Displays a success toast when the request is fulfilled and the password is successfully changed.
 * - Displays an error toast when the request is rejected due to failed password reset confirmation.
 */



export const ForgetPasswordConfirm = createAsyncThunk("tasks/forgetpasswordConfirmslice", async (data) => {
    const response = await axios.post("auth/users/reset_password_confirm/", data);
    return response.data;
},);

const TID = toast();


export const ForgetPasswordConfirmSlice = createSlice({
    name: "forgetpasswordConfirmslice", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
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
                toast.error("Password reset failed. Please check your information and try again.", {
                    id: TID,
                });
                state.error = action.error.message;
            });
    },
});

export default ForgetPasswordConfirmSlice.reducer;