import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

/**
 * Redux slice for managing data related to csalts
 * This slice is responsible for fetching salt data from an API and managing the state related to these operations.
 *
 * Functions:
 * - fetchSalts: Asynchronously fetches salt data from the API and updates the state based on the response.
 *
 * State:
 * - data: Array to store salt data retrieved from the API.
 * - status: Tracks the status of fetching operations ('idle', 'loading', 'succeeded', 'failed').
 * - error: Stores error messages if the fetching operation fails.
 *
 * This slice primarily handles the loading state transitions and data management of salts without any local state modifications,
 * relying solely on the data fetched from API to update the state.
 */



const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const fetchSalts = createAsyncThunk('Symptoms/fetchSalts', async () => {
  const response = await axios.get('api/salts/')
  return response.data
})

export const SaltSlice = createSlice({
  name: 'Symptoms',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchSalts.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchSalts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchSalts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default SaltSlice.reducer