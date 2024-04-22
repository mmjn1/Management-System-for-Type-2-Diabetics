import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing symptoms data.
 * This slice includes CRUD operations (Create, Read, Update, Delete) to handle symptoms data through asynchronous API calls.
 * It provides a systematic approach to updating the application state based on the success or failure of these operations
 * and utilises notifications to provide feedback to the user.
 *
 * Functions:
 * - fetchSymptoms: Asynchronously fetches a list of symptoms from the API and updates the 'data' state with the received payload.
 * - createSymptoms: Sends new symptoms data to the API and updates the state upon successful creation.
 * - updateSymptoms: Applies updates to an existing symptoms record in the API and reflects these changes in the state.
 * - deleteSymptoms: Removes a symptoms record by its ID from the API and updates the state by filtering out the deleted item.
 *
 * State:
 * - data: Array to store symptoms records.
 * - status: Indicates the current status of operations (e.g., 'idle', 'loading', 'succeeded', 'failed').
 * - error: Stores error message details if an operation fails.
 *
 * Notifications:
 * - Utilizes react-hot-toast to provide real-time notifications about the status of CRUD operations, enhancing user interaction by indicating loading, success, or errors.
 */

const initialState = {
  data: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchSymptoms = createAsyncThunk(
  'Symptoms/fetchSymptoms',
  async () => {
    const response = await axios.get('api/Symptoms/')
    return response.data
  },
)

export const createSymptoms = createAsyncThunk(
  'Symptoms/createSymptoms',
  async studentData => {
    const response = await axios.post('api/Symptoms/', studentData)
    return response.data
  },
)

export const updateSymptoms = createAsyncThunk(
  'Symptoms/updateSymptoms',
  async data => {
    const response = await axios.patch(`api/Symptoms/${data.id}/`, data)
    return response.data
  },
)

export const deleteSymptoms = createAsyncThunk(
  'Symptoms/deleteSymptoms',
  async id => {
    await axios.delete(`api/Symptoms/${id}/`)
    return id // Return the ID of the deleted student
  },
)

export const SymptomsSlice = createSlice({
  name: 'Symptoms',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchSymptoms.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchSymptoms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchSymptoms.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createSymptoms.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createSymptoms.fulfilled, (state, action) => {
        toast.success('Symptoms added successfully', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createSymptoms.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Symptoms already exist', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateSymptoms.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateSymptoms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const SymptomsIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (SymptomsIndex !== -1) {
          // Update the is_blocked property
          state.data[SymptomsIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Symptoms is not found (might be an error condition)
        }
        // state.Symptoms = [...state.Symptoms, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateSymptoms.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('An error occurred.', { id: TID })
      })

      .addCase(deleteSymptoms.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteSymptoms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Symptoms removed successfully', { id: TID })
        state.data = state.data.filter(teacher => teacher.id !== action.payload)
      })
      .addCase(deleteSymptoms.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('An error occurred while deleting symptoms', { id: TID })
        state.error = action.error.message
      })
  },
})

export default SymptomsSlice.reducer