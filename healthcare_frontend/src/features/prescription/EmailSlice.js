import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing email sending operations within the application.
 * This slice defines asynchronous operations for sending emails via the API, updating the state based
 * on the operation's outcome, and providing user feedback through notifications.
 * 
 * Functions:
 * - sendEmail: Triggers an API call to send an email with prescription data. Updates the Redux state 
 *   to reflect the progress and outcome of this operation.
 * 
 * State:
 * - status: Tracks the status of the send email operation ('idle', 'loading', 'succeeded', 'failed').
 * - error: Stores error message in case the email sending operation fails.
 * 
 * Notifications:
 * - Displays notifications to the user regarding the status of the email sending process using
 *   react-hot-toast, including loading, success, and error messages.
 */


const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const sendEmail = createAsyncThunk(
  'Prescription/sendEmail',
  async data => {
    const response = await axios.post('api/Prescriptions/email/', data)
    return response.data
  },
)

export const EmailSlice = createSlice({
  name: 'EmailSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    let TID = null

    builder

      .addCase(sendEmail.pending, state => {
        TID = toast.loading('Sending email')
        state.status = 'loading'
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        toast.success('Email sent 📨', { id: TID })
        state.status = 'succeeded'
        state.Prescription = action.payload
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oops! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default EmailSlice.reducer
