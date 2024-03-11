import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This file defines the 'auth' slice of the Redux store using Redux Toolkit, which manages
 * authentication states including login and logout functionalities. It utilises asynchronous
 * thunks to perform login and logout operations and updates the state based on these operations' outcomes.
 * 
 */


/**
 * This is the Asynchronous thunk for user login.
 * It sends user credentials to the login endpoint and handles the response.
 * On success, it stores the user's information and token in localStorage and returns the user data.
 * On failure, it captures and returns the error data.
 */
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`login_new/`, data);
      const { user, token, information } = response.data;
      localStorage.setItem("id", user.id);
      localStorage.setItem("type", user.type);
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);
/**
 * Asynchronous thunk for user logout.
 * It sends a request to the logout endpoint and clears the user's session from localStorage.
 * On failure, it captures and returns the error data.
 */

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `auth/token/logout/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      localStorage.removeItem("token"); // Clear the token
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);
/**
 * authSlice manages the state of authentication in the application.
 * It includes the user's token, status of authentication requests (idle, loading, succeeded, failed),
 * and user information such as type, id, and name.
 * The slice updates the state based on the outcomes of login and logout asynchronous thunks.
 * 
 * The initial state of this slice provides the necessary structure and default values for managing authentication in Redux,
 * ensuring consistent behaviour and predictable state updates.
 * 
 */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    type: null,
    id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    information: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const TID = toast();

    // Handle login actions
    builder
      .addCase(login.pending, (state) => {
        toast.loading("Logging in..", { id: TID });
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        toast.success("Logged in", { id: TID });
        state.status = "succeeded";
        state.token = action.payload.token;
        state.id = action.payload.user.id;
        state.first_name = action.payload.user.first_name;
        state.middle_name = action.payload.user.middle_name;
        state.last_name = action.payload.user.last_name;
        state.type = action.payload.user.type;
        state.information = action.payload.information;
      })
      .addCase(login.rejected, (state, action) => {
        toast.error("Invalid login attempt. Please check your credentials and try again.", { id: TID });

        state.status = "failed";
        state.error = action.payload;
        state.token = null;
        state.id = null;
        state.first_name = null;
        state.middle_name = null;
        state.last_name = null;
        state.type = null;
        state.information = null;
      })
      // Handle logout actions
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.status = "idle";
        state.token = null;
        state.id = null;
        state.first_name = null;
        state.middle_name = null;
        state.last_name = null;
        state.type = null;
        state.information = null;
      })
      .addCase(logout.rejected, (state, action) => {
        localStorage.clear();
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
