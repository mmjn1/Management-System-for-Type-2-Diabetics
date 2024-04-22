import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing Drugs data in the application.
 * This slice handles operations such as fetching, creating, updating, and deleting drugs records
 * using asynchronous actions with the Redux Toolkit's createAsyncThunk. It handles state updates
 * based on the response from API calls and includes user notifications through react-hot-toast.
 * 
 * Functions:
 * - fetchDrugs: Fetches a list of drugs from the API and updates the 'Drugs' array in the state.
 * - createDrugs: Adds a new drug record to the API and updates the state upon successful creation.
 * - updateDrugs: Modifies an existing drug record in the API and updates the state accordingly.
 * - deleteDrugs: Removes a drug record from the API and updates the state by filtering out the deleted record.
 * 
 * State:
 * - Drugs: Array of drug objects.
 * - status: Current status of API operations ('idle', 'loading', 'succeeded', 'failed'). - indicate the initial or resting state of an asynchronous operation before any action has been triggered
 * - error: Stores error messages from failed operations.
 * 
 * Notifications:
 * - Displays loading, success, and error notifications using react-hot-toast during each async operation.
 */


const initialState = {
  Drugs: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchDrugs = createAsyncThunk('Drugs/fetchDrugs', async () => {
  const response = await axios.get('api/Drugs/')
  return response.data
})

export const createDrugs = createAsyncThunk(
  'Drugs/createDrugs',
  async studentData => {
    const response = await axios.post('api/Drugs/', studentData)
    return response.data
  },
)

export const updateDrugs = createAsyncThunk('Drugs/updateDrugs', async data => {
  const response = await axios.patch(`api/Drugs/${data.id}/`, data)
  return response.data
})

export const deleteDrugs = createAsyncThunk('Drugs/deleteDrugs', async id => {
  await axios.delete(`api/Drugs/${id}/`)
  return id // Return the ID of the deleted student
})

export const DrugsSlice = createSlice({
  name: 'Drugs',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchDrugs.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchDrugs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.Drugs = action.payload
      })
      .addCase(fetchDrugs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createDrugs.pending, state => {
        TID = toast.loading('Loading...⏳')
        state.status = 'loading'
      })
      .addCase(createDrugs.fulfilled, (state, action) => {
        toast.success('Drug successfully created', { id: TID })
        state.status = 'succeeded'
        state.Drugs = action.payload
      })
      .addCase(createDrugs.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Drug already exists', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateDrugs.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateDrugs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const DrugsIndex = state.Drugs.findIndex(
          item => item.id === action.payload.id,
        )
        if (DrugsIndex !== -1) {
          // Update the is_blocked property
          state.Drugs[DrugsIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Drugs is not found (might be an error condition)
        }
        // state.Drugs = [...state.Drugs, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateDrugs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('An error occurred', { id: TID })
      })

      .addCase(deleteDrugs.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteDrugs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Drug successfully removed', { id: TID })
        state.Drugs = state.Drugs.filter(
          teacher => teacher.id !== action.payload,
        )
      })
      .addCase(deleteDrugs.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('An error occurred', { id: TID })
        state.error = action.error.message
      })
  },
})

export default DrugsSlice.reducer
