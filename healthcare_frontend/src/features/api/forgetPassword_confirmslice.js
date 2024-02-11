import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

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
                toast.error("Oops! Something went wrong", {
                    id: TID,
                });
                state.error = action.error.message;
            });
    },
});

export default ForgetPasswordConfirmSlice.reducer;