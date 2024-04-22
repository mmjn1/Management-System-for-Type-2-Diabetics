
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing medical or historical records.
 * This slice provides functionality for CRUD operations (Create, Read, Update, Delete) on Histories
 * through asynchronous API calls. It tracks operation status and manages the application state based
 * on API interactions, while also providing user feedback via notifications.
 * 
 * Functions:
 * - fetchHistories: Retrieves a list of historical records from the API and updates the 'Histories' array in the state.
 * - createHistories: Sends new historical data to the API and adds the new record to the state upon successful creation.
 * - updateHistories: Submits updated information for an existing record to the API and modifies the state accordingly.
 * - deleteHistories: Removes a historical record using its ID from the API and deletes it from the state.
 * 
 * State:
 * - Histories: Array of historical records.
 * - status: Indicates the current status of operations (e.g., 'idle', 'loading', 'succeeded', 'failed').
 * - error: Contains error message details if an operation fails.
 * 
 * Notifications:
 * - Utilises react-hot-toast to display notifications about the status of the operations, including success and error messages.
 */


const initialState = {
  Histories: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchHistories = createAsyncThunk(
  'Histories/fetchHistories',
  async () => {
    const response = await axios.get('api/Histories/')
    return response.data
  },
)

export const createHistories = createAsyncThunk(
  'Histories/createHistories',
  async studentData => {
    const response = await axios.post('api/Histories/', studentData)
    return response.data
  },
)

export const updateHistories = createAsyncThunk(
  'Histories/updateHistories',
  async data => {
    const response = await axios.patch(`api/Histories/${data.id}/`, data)
    return response.data
  },
)

export const deleteHistories = createAsyncThunk(
  'Histories/deleteHistories',
  async id => {
    await axios.delete(`api/Histories/${id}/`)
    return id 
  },
)

export const HistoriesSlice = createSlice({
  name: 'Histories',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchHistories.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchHistories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Histories = action.payload
      })
      .addCase(fetchHistories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createHistories.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createHistories.fulfilled, (state, action) => {
        toast.success('History successfully created', { id: TID })
        state.status = 'succeeded'
        state.Histories = action.payload
      })
      .addCase(createHistories.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('History already exists', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateHistories.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateHistories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const HistoriesIndex = state.Histories.findIndex(
          item => item.id === action.payload.id,
        )
        if (HistoriesIndex !== -1) {
          // Update the is_blocked property
          state.Histories[HistoriesIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Histories is not found (might be an error condition)
        }
        // state.Histories = [...state.Histories, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateHistories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wrong', { id: TID })
      })

      .addCase(deleteHistories.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteHistories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('History successfully removed', { id: TID })
        state.Histories = state.Histories.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteHistories.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oops! An error occurred', { id: TID })
        state.error = action.error.message
      })
  },
})

export default HistoriesSlice.reducer
