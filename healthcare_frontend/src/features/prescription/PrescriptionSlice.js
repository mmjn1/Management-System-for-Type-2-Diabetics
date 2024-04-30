import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

/**
 * Redux slice for managing prescription-related data. 
 * This slice facilitates operations such as fetching, creating, updating, and deleting prescriptions through asynchronous API calls.
 * It manages application state related to prescription operations and provides user feedback via notifications.
 *
 * Functions:
 * - fetchPrescription: Retrieves a single prescription or a batch of prescriptions.
 * - fetchPrescriptionsDoctor: Fetches prescriptions associated with a specific doctor by their ID.
 * - fetchPrescriptionsPatient: Fetches prescriptions associated with a specific patient by their ID.
 * - createPrescription: Submits new prescription data to the API and updates the state upon successful creation.
 * - updatePrescription: Updates a specific prescription's details in the API and the state.
 * - updatePatientPrescription: Updates prescription details for a patient, specifically for scenarios like refills.
 * - deletePrescription: Removes a prescription using its ID from the API and updates the state by filtering out the deleted record.
 *
 * State:
 * - Prescription: Array or object storing detailed information about one or many prescriptions.
 * - Prescriptions: Array storing multiple prescriptions, often used for listing purposes.
 * - status: Tracks the status of prescription operations ('idle', 'loading', 'succeeded', 'failed').
 * - error: Contains error messages if an operation fails.
 *
 * Notifications:
 * - Utilises react-hot-toast to display notifications about the status of operations, including during loading,
 *   successful completion, or failure of prescription-related tasks.
 */


const initialState = {
  Prescription: [],
  Prescriptions: [],
  status: 'idle',
  error: null,
};

export const fetchPrescription = createAsyncThunk('Prescription/fetchPrescription', async () => {
  const response = await axios.get('api/Prescription/');
  return response.data;
});

export const fetchPrescriptionsDoctor = createAsyncThunk(
  'Prescription/fetchPrescriptionDoctor',
  async (id) => {
    const response = await axios.get(`api/Prescriptions/doctor/${id}/`);
    return response.data;
  },
);

export const fetchPrescriptionsPatient = createAsyncThunk(
  'Prescription/fetchPrescriptionPatient',
  async (id) => {
    const response = await axios.get(`api/Prescriptions/patient/${id}/`);
    return response.data;
  },
);

export const createPrescription = createAsyncThunk(
  'Prescription/createPrescription',
  async (data) => {
    const token = await localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const response = await axios.post('api/Prescription/', data, header);
    return response.data;
  },
);

export const updatePrescription = createAsyncThunk(
  'Prescription/updatePrescription',
  async (data) => {
    const response = await axios.patch(`api/Prescription/${data.id}/`, data);
    return response.data;
  },
);

export const updatePatientPrescription = createAsyncThunk(
  'Prescription/updatePatientPrescription',
  async (data) => {
    const response = await axios.put(`api/Prescriptions/patient/${data.id}/`, data);
    return response.data;
  },
);

export const deletePrescription = createAsyncThunk(
  'Prescription/deletePrescription',
  async (id) => {
    await axios.delete(`api/Prescription/${id}/`);
    return id;
  },
);

export const PrescriptionSlice = createSlice({
  name: 'Prescription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    let TID = null;

    builder
      .addCase(fetchPrescription.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrescription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Prescription = action.payload;
      })
      .addCase(fetchPrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchPrescriptionsDoctor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrescriptionsDoctor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Prescriptions = action.payload;
      })
      .addCase(fetchPrescriptionsDoctor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchPrescriptionsPatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrescriptionsPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Prescriptions = action.payload;
      })
      .addCase(fetchPrescriptionsPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(updatePatientPrescription.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Requesting...');
      })
      .addCase(updatePatientPrescription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const PrescriptionIndex = state.Prescriptions.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (PrescriptionIndex !== -1) {
          // Update the is_blocked property
          state.Prescriptions[PrescriptionIndex].is_blocked = action.payload.is_blocked;

          toast.success('Refill requested...', { id: TID });
        } else {
          // Handle if the Prescription is not found (might be an error condition)
        }
        // state.Prescription = [...state.Prescription, action.payload]
        toast.success('Updated...', { id: TID });
      })
      .addCase(updatePatientPrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error('Oops! something went wrong', { id: TID });
      })

      .addCase(createPrescription.pending, (state) => {
        TID = toast.loading('Loading...⏳');
        state.status = 'loading';
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        toast.success('Prescription Created!', { id: TID });
        state.status = 'succeeded';
        state.Prescription = action.payload;
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.status = 'failed';
        toast.error('Oops! something went wrong', { id: TID });
        state.error = action.error.message;
      })

      .addCase(updatePrescription.pending, (state) => {
        state.status = 'loading';
        TID = toast.loading('Updating...');
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const PrescriptionIndex = state.Prescription.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (PrescriptionIndex !== -1) {
          // Update the is_blocked property
          state.Prescription[PrescriptionIndex].is_blocked = action.payload.is_blocked;

          toast.success('Updated...', { id: TID });
        } else {
          // Handle if the Prescription is not found (might be an error condition)
        }
        // state.Prescription = [...state.Prescription, action.payload]
        toast.success('Updated...', { id: TID });
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error('Oops! something went wrong', { id: TID });
      })

      .addCase(deletePrescription.pending, (state) => {
        TID = toast.loading('Deleting...');
        state.status = 'loading';
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        toast.success('Prescription Removed!', { id: TID });
        state.Prescriptions = state.Prescriptions.filter((item) => item.id !== action.payload);
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.status = 'failed';
        toast.error('Oop! something went wrong', { id: TID });
        state.error = action.error.message;
      });
  },
});

export default PrescriptionSlice.reducer;