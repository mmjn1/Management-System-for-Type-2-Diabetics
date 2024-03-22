import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers for handling actions
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
    },
  },

});

export const { addAppointment, updateAppointment, deleteAppointment } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;