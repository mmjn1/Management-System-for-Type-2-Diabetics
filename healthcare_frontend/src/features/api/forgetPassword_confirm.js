import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Creating an asynchronous thunk for handling password reset confirmation
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
                toast.error("Oops! Something went wrong", {
                    id: TID,
                });
                state.error = action.error.message;
            });
    },
});

export default ForgetPasswordConfirmSlice.reducer;