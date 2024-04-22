import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing Advices data, including fetching, creating, updating, and deleting Advices.
 * Utilizes createAsyncThunk for asynchronous actions and handles states for loading, success, and failure.
 * 
 * Functions:
 * - fetchAdvices: Fetches all Advices from the API and populates the Advices state.
 * - createAdvices: Submits new Advices data to the API and updates the state on success.
 * - updateAdvices: Updates specific Advices data by ID via the API and reflects changes in the state.
 * - deleteAdvices: Deletes an Advices by ID from the API and removes it from the state.
 * 
 * State:
 * - Advices: Array of Advices objects.
 * - status: Represents the current loading status ('idle', 'loading', 'succeeded', 'failed').
 * - error: Stores error messages from failed operations.
 * 
 * Uses react-hot-toast for UI notifications on the status of asynchronous operations.
 */



const initialState = {
  Advices: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchAdvices = createAsyncThunk(
  'Advices/fetchAdvices',
  async () => {
    const response = await axios.get('api/Advices/')
    return response.data
  },
)

export const createAdvices = createAsyncThunk(
  'Advices/createStudent',
  async studentData => {
    const response = await axios.post('api/Advices/', studentData)
    return response.data
  },
)

export const updateAdvices = createAsyncThunk(
  'Advices/updateStudent',
  async data => {
    const response = await axios.patch(`api/Advices/${data.id}/`, data)
    return response.data
  },
)

export const deleteAdvices = createAsyncThunk(
  'Advices/deleteStudent',
  async id => {
    await axios.delete(`api/Advices/${id}/`)
    return id // Return the ID of the deleted student
  },
)

export const AdvicesSlice = createSlice({
  name: 'Advices',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchAdvices.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchAdvices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Advices = action.payload
      })
      .addCase(fetchAdvices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createAdvices.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createAdvices.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.Advices = action.payload
      })
      .addCase(createAdvices.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateAdvices.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateAdvices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const AdvicesIndex = state.Advices.findIndex(
          item => item.id === action.payload.id,
        )
        if (AdvicesIndex !== -1) {
          // Update the is_blocked property
          state.Advices[AdvicesIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Advices is not found (might be an error condition)
        }
        // state.Advices = [...state.Advices, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateAdvices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wrong', { id: TID })
      })

      .addCase(deleteAdvices.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteAdvices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Student Removed!', { id: TID })
        state.Advices = state.Advices.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteAdvices.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default AdvicesSlice.reducer
