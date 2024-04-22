
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing Diagnoses data, tailored for operations such as fetching, creating,
 * updating, and deleting Diagnoses records via an API. Utilising Redux Toolkit's createAsyncThunk for
 * asynchronous actions and handles various states like loading, success, and failure.
 * 
 * Functions:
 * - fetchDiagnoses: Retrieves a list of Diagnoses from the server and updates the state.
 * - createDiagnoses: Posts new Diagnoses data to the server and adds it to the state upon success.
 * - updateDiagnoses: Sends updated data for a specific Diagnoses record to the server and updates the state.
 * - deleteDiagnoses: Deletes a Diagnoses record from the server using its ID and removes it from the state.
 * 
 * State:
 * - Diagnoses: Array of Diagnoses objects.
 * - status: Current status of Diagnoses operations ('idle', 'loading', 'succeeded', 'failed').
 * - error: Error message in case of a failed operation.
 * 
 * Additional Features:
 * - Uses react-hot-toast for displaying notifications related to the asynchronous operations' status.
 */

const initialState = {
  Diagnoses: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchDiagnoses = createAsyncThunk(
  'Diagnoses/fetchDiagnoses',
  async () => {
    const response = await axios.get('api/Diagnoses/')
    return response.data
  },
)

export const createDiagnoses = createAsyncThunk(
  'Diagnoses/createDiagnoses',
  async studentData => {
    const response = await axios.post('api/Diagnoses/', studentData)
    return response.data
  },
)

export const updateDiagnoses = createAsyncThunk(
  'Diagnoses/updateDiagnoses',
  async data => {
    const response = await axios.patch(`api/Diagnoses/${data.id}/`, data)
    return response.data
  },
)

export const deleteDiagnoses = createAsyncThunk(
  'Diagnoses/deleteDiagnoses',
  async id => {
    await axios.delete(`api/Diagnoses/${id}/`)
    return id 
  },
)

export const DiagnosesSlice = createSlice({
  name: 'Diagnoses',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchDiagnoses.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchDiagnoses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Diagnoses = action.payload
      })
      .addCase(fetchDiagnoses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createDiagnoses.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createDiagnoses.fulfilled, (state, action) => {
        toast.success('Diagnoses successfully created', { id: TID })
        state.status = 'succeeded'
        state.Diagnoses = action.payload
      })
      .addCase(createDiagnoses.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Failed to create a new diagnosis', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateDiagnoses.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateDiagnoses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const DiagnosesIndex = state.Diagnoses.findIndex(
          item => item.id === action.payload.id,
        )
        if (DiagnosesIndex !== -1) {
          // Update the is_blocked property
          state.Diagnoses[DiagnosesIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
        }
        // state.Diagnoses = [...state.Diagnoses, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateDiagnoses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('An error occurred. Please try again.', { id: TID })
      })

      .addCase(deleteDiagnoses.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteDiagnoses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Diagnosis successfully removed', { id: TID })
        state.Diagnoses = state.Diagnoses.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteDiagnoses.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('An error occurred', { id: TID })
        state.error = action.error.message
      })
  },
})

export default DiagnosesSlice.reducer
