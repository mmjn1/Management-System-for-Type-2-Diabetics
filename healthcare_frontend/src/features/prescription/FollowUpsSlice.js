import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing follow-up actions.
 *
 * This slice facilitates operations such as fetching, creating, updating, and deleting follow-up records
 * through asynchronous API calls, managing state updates based on the outcomes of these operations, and
 * providing user feedback with notifications.
 * 
 * Functions:
 * - fetchFollowUps: Retrieves a list of follow-up records from the API and updates the 'FollowUps' state array.
 * - createFollowUps: Submits new follow-up data to the API and integrates the new record into the state upon success.
 * - updateFollowUps: Modifies an existing follow-up record based on provided data and updates the state to reflect changes.
 * - deleteFollowUps: Removes a follow-up record using its ID from the API and purges it from the state.
 * 
 * State:
 * - FollowUps: Array of follow-up objects.
 * - status: Current operation status ('idle', 'loading', 'succeeded', 'failed').
 * - error: Contains error message details if an operation fails.
 * 
 * Notifications:
 * - Uses react-hot-toast to display notifications indicating the status of operations (loading, success, error).
 */



const initialState = {
  FollowUps: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchFollowUps = createAsyncThunk(
  'FollowUps/fetchFollowUps',
  async () => {
    const response = await axios.get('api/FollowUps/')
    return response.data
  },
)

export const createFollowUps = createAsyncThunk(
  'FollowUps/createFollowUps',
  async studentData => {
    const response = await axios.post('api/FollowUps/', studentData)
    return response.data
  },
)

export const updateFollowUps = createAsyncThunk(
  'FollowUps/updateFollowUps',
  async data => {
    const response = await axios.patch(`api/FollowUps/${data.id}/`, data)
    return response.data
  },
)

export const deleteFollowUps = createAsyncThunk(
  'FollowUps/deleteFollowUps',
  async id => {
    await axios.delete(`api/FollowUps/${id}/`)
    return id 
  },
)

export const FollowUpsSlice = createSlice({
  name: 'FollowUps',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchFollowUps.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.FollowUps = action.payload
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createFollowUps.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createFollowUps.fulfilled, (state, action) => {
        toast.success('Follow up created', { id: TID })
        state.status = 'succeeded'
        state.FollowUps = action.payload
      })
      .addCase(createFollowUps.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already created', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateFollowUps.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateFollowUps.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const FollowUpsIndex = state.FollowUps.findIndex(
          item => item.id === action.payload.id,
        )
        if (FollowUpsIndex !== -1) {
          // Update the is_blocked property
          state.FollowUps[FollowUpsIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the FollowUps is not found (might be an error condition)
        }
        // state.FollowUps = [...state.FollowUps, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateFollowUps.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wrong', { id: TID })
      })

      .addCase(deleteFollowUps.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteFollowUps.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Follow up Removed!', { id: TID })
        state.FollowUps = state.FollowUps.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteFollowUps.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default FollowUpsSlice.reducer
