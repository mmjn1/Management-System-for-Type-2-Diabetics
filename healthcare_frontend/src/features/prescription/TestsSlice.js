import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing laboratory tests data.
 * This slice includes operations such as fetching, creating, updating, and deleting test records
 * through asynchronous API calls. It ensures the application state is updated based on the outcome of these
 * operations and uses notifications to provide feedback to the user.
 *
 * Functions:
 * - fetchTests: Asynchronously retrieves a list of tests from the API and updates the 'data' state with the results.
 * - createTests: Submits new test data to the API and updates the state upon successful creation.
 * - updateTests: Sends updated details for an existing test to the API and updates the state to reflect these changes.
 * - deleteTests: Removes a test record using its ID from the API and updates the state by filtering out the deleted record.
 *
 * State:
 * - data: Array to store test records.
 * - status: Indicates the current status of operations (e.g., 'idle', 'loading', 'succeeded', 'failed').
 * - error: Stores error message details if an operation fails.
 *
 * Notifications:
 * - Utilises react-hot-toast to provide real-time notifications about the status of operations, highlighting loading, success, or errors.
 */


const initialState = {
  data: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
}

export const fetchTests = createAsyncThunk('Tests/fetchTests', async () => {
  const response = await axios.get('api/Tests/')
  return response.data
})

export const createTests = createAsyncThunk(
  'Tests/createTests',
  async studentData => {
    const response = await axios.post('api/Tests/', studentData)
    return response.data
  },
)

export const updateTests = createAsyncThunk('Tests/updateTests', async data => {
  const response = await axios.patch(`api/Tests/${data.id}/`, data)
  return response.data
})

export const deleteTests = createAsyncThunk('Tests/deleteTests', async id => {
  await axios.delete(`api/Tests/${id}/`)
  return id // Return the ID of the deleted student
})

export const TestsSlice = createSlice({
  name: 'Tests',
  initialState,
  reducers: {
    // Add reducers for local state modifications if needed
  },
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchTests.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createTests.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createTests.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createTests.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateTests.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateTests.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const TestsIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (TestsIndex !== -1) {
          // Update the is_blocked property
          state.data[TestsIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
          // Handle if the Tests is not found (might be an error condition)
        }
        // state.data = [...state.data, action.payload]
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateTests.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wrong', { id: TID })
      })

      .addCase(deleteTests.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteTests.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Student Removed!', { id: TID })
        state.data = state.data.filter(teacher => teacher.id !== action.payload)
      })
      .addCase(deleteTests.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default TestsSlice.reducer