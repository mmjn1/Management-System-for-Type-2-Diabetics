import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const requestLogin = createAsyncThunk("tasks/requestlogin", async (data) => {
    const response = await axios.post("auth/token/login/", data);
    return response.data;
},);

export const LoginSlice = createSlice({
    name: "Login", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(requestLogin.pending, (state) => {
                state.status = "loading";
            })
            .addCase(requestLogin.fulfilled, (state, action) => {
                localStorage.setItem("token", action.payload.auth_token);
                console.log(action.payload.auth_token)
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(requestLogin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default LoginSlice.reducer;
