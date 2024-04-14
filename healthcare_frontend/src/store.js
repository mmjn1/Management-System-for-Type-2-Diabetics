import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/api/userslice';
import registerDoctor from "./features/doctor/doctor_register";
import registerUserPatient from "./features/patient/patient_register";
import forgetPasswordfunction from "./features/api/forgetPassword";
import ForgetPasswordConfirm from "./features/api/forgetPassword_confirm";
import fetchDoctor from "./features/doctor/FetchDoctor";
import userDetailsSlice from "./features/api/Userdetails";
import { apiSlice } from "./features/api/contactSlice";
import appointmentsReducer from "./features/appointments/appointmentsSlice";
import { patientAppointmentCreation } from "./features/appointments/patientAppointment";
import chatReducer from "./features/chat/chatSlice";
import fetchPatient from "./features/patient/fetchPatients";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistStore, persistReducer } from "redux-persist";
import { doctorApi } from './features/appointments/availabilitySlice';
import { updateProfile } from './features/patient/updateProfile';
import { doctorAvailabilityApi } from './features/appointments/doctorAvailabilitySlice';
import { timeslotApi } from './features/timeslotAPI';
import patientRecordsReducer from "./features/api/patient_records";
import { updateDoctorProfile } from './features/doctor/updateDoctorProfile';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [doctorApi.reducerPath]: doctorApi.reducer,
  [updateProfile.reducerPath]: updateProfile.reducer,
  [doctorAvailabilityApi.reducerPath]: doctorAvailabilityApi.reducer,
  [patientAppointmentCreation.reducerPath]: patientAppointmentCreation.reducer,
  [timeslotApi.reducerPath]: timeslotApi.reducer,
  [updateDoctorProfile.reducerPath]: updateDoctorProfile.reducer, 
  
  user: userReducer,
  registerDoctor: registerDoctor,
  registerUserPatient: registerUserPatient,
  forgetPasswordfunction: forgetPasswordfunction,
  ForgetPasswordConfirm: ForgetPasswordConfirm,
  DoctorSlice: fetchDoctor,
  userDetails: userDetailsSlice,
  appointments: appointmentsReducer,
  chat: chatReducer,
  PatientSlice: fetchPatient,
  patientRecords: patientRecordsReducer, 

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(doctorApi.middleware).concat(doctorAvailabilityApi.middleware)
      .concat(patientAppointmentCreation.middleware).concat(timeslotApi.middleware)
      .concat(updateProfile.middleware).concat(updateDoctorProfile.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default { store, persistor };
