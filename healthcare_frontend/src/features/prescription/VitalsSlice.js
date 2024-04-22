
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing patient vital signs data within the application.
 * This slice facilitates CRUD operations (Create, Read, Update, Delete) for managing vitals data through
 * asynchronous API calls. 
 * It maintains the state transitions based on these operations and presents notifications to provide feedback to the user.
 *
 * Functions:
 * - fetchVitals: Retrieves a list of vitals from the API and updates the 'Vitals' array in the state.
 * - createVitals: Submits new vitals data to the API and updates the state upon successful creation.
 * - updateVitals: Sends updated details for an existing set of vitals to the API and updates the state accordingly.
 * - deleteVitals: Removes a set of vitals using its ID from the API and updates the state by filtering out the deleted record.
 *
 * State:
 * - Vitals: Array storing vitals data.
 * - status: Tracks the status of operations regarding vitals ('idle', 'loading', 'succeeded', 'failed').
 * - error: Contains error messages if an operation fails.
 *
 * Notifications:
 * - Utilises react-hot-toast to display real-time notifications about the status of operations, enhancing user interaction
 *   by indicating loading, success, or errors.
 */

const initialState = {
  Vitals: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchVitals = createAsyncThunk('Vitals/fetchVitals', async () => {
  const response = await axios.get('api/Vitals/')
  return response.data
})

export const createVitals = createAsyncThunk(
  'Vitals/createVitals',
  async studentData => {
    const response = await axios.post('api/Vitals/', studentData)
    return response.data
  },
)

export const updateVitals = createAsyncThunk(
  'Vitals/updateVitals',
  async data => {
    const response = await axios.patch(`api/Vitals/${data.id}/`, data)
    return response.data
  },
)

export const deleteVitals = createAsyncThunk(
  'Vitals/deleteVitals',
  async id => {
    await axios.delete(`api/Vitals/${id}/`)
    return id // Return the ID of the deleted student
  },
)

export const VitalsSlice = createSlice({
  name: 'Vitals',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchVitals.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchVitals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Vitals = action.payload
      })
      .addCase(fetchVitals.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createVitals.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createVitals.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.Vitals = action.payload
      })
      .addCase(createVitals.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateVitals.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateVitals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const VitalsIndex = state.Vitals.findIndex(
          item => item.id === action.payload.id,
        )
        if (VitalsIndex !== -1) {
          // Update the is_blocked property
          state.Vitals[VitalsIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Vitals is not found (might be an error condition)
        }
        // state.Vitals = [...state.Vitals, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateVitals.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wrong', { id: TID })
      })

      .addCase(deleteVitals.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteVitals.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Student Removed!', { id: TID })
        state.Vitals = state.Vitals.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteVitals.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default VitalsSlice.reducer
