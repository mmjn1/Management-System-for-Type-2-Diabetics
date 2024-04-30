
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * This module manages the Redux state for patient appointments using Redux Toolkit. It handles asynchronous
 * API requests to create, fetch, update, delete, and add follow-up notes to patient appointments.
 *
 * Features:
 * - `CreatePatientAppointment`: Asynchronous thunk for creating a new patient appointment. It posts data to the backend
 *   and handles both success and error states with appropriate toast notifications.
 * - `fetchPatientAppointment`: Fetches appointment details based on a given doctor ID, updating the state with the fetched data.
 * - `deletePatientAppointment`: Deletes a specific appointment by ID and updates the state to remove the deleted appointment.
 * - `updatePatientAppointment`: Updates details of an existing appointment and reflects these changes in the state.
 * - `CreateFollowupNotes`: Adds follow-up notes to an existing appointment, using a PATCH request.
 *
 * State:
 * - `data`: An array storing the details of appointments.
 * - `status`: A string indicating the loading status ('idle', 'loading', 'succeeded', 'failed').
 * - `error`: Stores error messages from failed operations.
 *
 * The slice uses extraReducers to handle the lifecycle of each asynchronous action, including loading, success, and error states.
 * Toast notifications provide user feedback during each operation, enhancing the user experience by providing immediate,
 * contextual information on the operation's outcome.
 */


const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const CreatePatientAppointment = createAsyncThunk(
  'AppointmentTypes/CreatePatientAppointment',
  async (data, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    try {
      const response = await axios.post('api/patient-create-appointment/', data, header);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return rejectWithValue(err.response.data);
        } else {
          return rejectWithValue({ message: 'Network error or server unavailable' });
        }
      } else {
        return rejectWithValue({ message: 'An unexpected error occurred' });
      }
    }
  },
);

export const fetchPatientAppointment = createAsyncThunk(
  'AppointmentTypes/fetchPatientAppointment',
  async (id) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const response = await axios.get(`api/get-patient-appointment/?doctor_id=${id}`, header);
    return response.data;
  },
);

export const deletePatientAppointment = createAsyncThunk(
  'AppointmentTypes/deletePatientAppointment',
  async (id) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    await axios.delete(`api/patient-appointment/${id}/`, header);
    return id;
  },
);

export const updatePatientAppointment = createAsyncThunk(
  'AppointmentTypes/UpdatePatientAppointment',
  async (data) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const response = await axios.patch(`api/patient-appointment/${data.id}/`, data.data, header);
    return response.data;
  },
);

export const CreateFollowupNotes = createAsyncThunk(
  'AppointmentTypes/FollowupNotePatientAppointment',
  async (data) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const body={FollowupNote:data.FollowupNote}
    const response = await axios.patch(`api/patient-appointment-other/${data.Appointment}/`, body, header);
    return response.data;
  },
);

export const PatientAppointmentSlice = createSlice({
  name: 'CreatePatientAppointment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    let TID = null;

    builder
      .addCase(CreatePatientAppointment.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Creating your appointment');
      })
      .addCase(CreatePatientAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = [...state.data, action.payload];
        toast.success(
          'Your appointment has been successfully scheduled. You will receive a confirmation email shortly!',
          { id: TID },
        );
      })
      .addCase(CreatePatientAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;

        if (action.payload) {
          let errorMessage = action.payload.message || 'An unexpected error occurred.';
          toast.error(errorMessage, { id: TID });
        } else {
          toast.error('An unexpected error occurred.', { id: TID });
        }
      })

      .addCase(CreateFollowupNotes.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Adding notes');
      })
      .addCase(CreateFollowupNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.data = [...state.data, action.payload];
        toast.success('Follow-up note added', { id: TID });
      })
      .addCase(CreateFollowupNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error('An unexpected error occurred.', { id: TID });
      })

      .addCase(fetchPatientAppointment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPatientAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deletePatientAppointment.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Deleting your appointment');
      })
      .addCase(deletePatientAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        toast.success('Appointment Removed!', { id: TID });
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deletePatientAppointment.rejected, (state, action) => {
        state.status = 'failed';
        toast.error('Oop! something went wrong', { id: TID });
        state.error = action.error.message;
      })

      .addCase(updatePatientAppointment.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Updating...');
      })
      .addCase(updatePatientAppointment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = state.data.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload;
          }
          return item;
        });
        toast.success('Updated...', { id: TID });
      })
      .addCase(updatePatientAppointment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error('Oops! something went wrong', { id: TID });
      });
  },
});

export default PatientAppointmentSlice.reducer;
