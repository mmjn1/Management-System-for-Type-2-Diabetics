import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Asynchronous thunk action responsible for fetching user details.
 * It retrieves the user's authentication token from local storage,
 * sets the authorization header, and makes a GET request to the user details endpoint.
 * It then returns the user details data from the response.
 * 
 */

export const userDetails = createAsyncThunk("tasks/detailsslice", async (data) => {
    const token = localStorage.getItem('token'); // Retrieve the user's token from local storage.
    const header = {
        headers: {
            Authorization: `Token ${token}`,
        },
    }
    const response = await axios.get("getDetails/", header); // Make the GET request.
    return response.data;
},);

/**
 * userDetailsSlice is a slice of Redux state managing user details, including their retrieval,
 * loading status, and any associated errors.
 * 
 * The slice includes:
 * - An initialState object defining the default state structure.
 * - A set of reducers for handling updates to this part of the state (none in this case as actions are async).
 * - Extra reducers for handling the lifecycle of userDetails async actions (pending, fulfilled, rejected).
 */

export const userDetailsSlice = createSlice({

    name: "userdetails", initialState: {
        data: [], status: "idle", error: null,
    }, reducers: {}, extraReducers: (builder) => {
        builder
            .addCase(userDetails.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userDetails.fulfilled, (state, action) => {
                localStorage.setItem('type',action.payload.user.type)
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(userDetails.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default userDetailsSlice.reducer;
