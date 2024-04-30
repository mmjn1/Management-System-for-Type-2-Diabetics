import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/api/userslice';
import registerDoctor from "./features/doctor/doctor_register";
import registerUserPatient from "./features/patient/patient_register";
import forgetPasswordfunction from "./features/api/forgetPassword";
import ForgetPasswordConfirm from "./features/api/forgetPassword_confirm";
import fetchDoctor from "./features/doctor/FetchDoctor";
import userDetailsSlice from "./features/api/Userdetails";
import { apiSlice } from "./features/api/contactSlice";
import chatReducer from "./features/chat/chatSlice";
import fetchPatient from "./features/patient/fetchPatients";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistStore, persistReducer } from "redux-persist";
import { updateProfile } from './features/patient/updateProfile';
import { timeslotApi } from './features/doctor/timeslotAPI';
import patientRecordsReducer from "./features/api/patient_records";
import { updateDoctorProfile } from './features/doctor/updateDoctorProfile';
import PrescriptionSlice from './features/prescription/PrescriptionSlice';
import MedicineSlice from './features/prescription/MedicineSlice';
import DrugsSlice from './features/prescription/DrugsSlice';
import SymptomsSlice from './features/prescription/SymptomsSlice';
import TestsSlice from './features/prescription/TestsSlice';
import VitalsSlice from './features/prescription/VitalsSlice';
import AdvicesSlice from './features/prescription/AdvicesSlice';
import DiagnosesSlice from './features/prescription/DiagnosesSlice';
import FollowUpsSlice from './features/prescription/FollowUpsSlice';
import HistoriesSlice from './features/prescription/HistoriesSlice';
import SaltSlice from './features/prescription/SaltSlice';
import EmailSlice from './features/prescription/EmailSlice';
import PackageSlice from './features/prescription/PackageSlice';

import LocationSlice from './features/appointments/LocationSlice';
import TimeSlotsSlice from './features/appointments/DoctorAvailabilitySlice';
import DoctorAvailability from './features/appointments/AvailabilitySlice';
import DoctorPatientSlice from './features/appointments/Doctor_PatientSlice';
import AppointmentTypesSlice from './features/appointments/AppointmentTypes';
import PatientAppointmentSlice from './features/appointments/PatientAppointment';
import AppointmentByPatientSlice from './features/appointments/patientdataSlice';
import DoctorTimeSlotsSlice from './features/appointments/doctor_slots';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [updateProfile.reducerPath]: updateProfile.reducer,
  [timeslotApi.reducerPath]: timeslotApi.reducer,
  [updateDoctorProfile.reducerPath]: updateDoctorProfile.reducer,

  user: userReducer,
  registerDoctor: registerDoctor,
  registerUserPatient: registerUserPatient,
  forgetPasswordfunction: forgetPasswordfunction,
  ForgetPasswordConfirm: ForgetPasswordConfirm,
  DoctorSlice: fetchDoctor,
  userDetails: userDetailsSlice,
  chat: chatReducer,
  PatientSlice: fetchPatient,
  patientRecords: patientRecordsReducer,
  Prescription: PrescriptionSlice,
  Medicine: MedicineSlice,
  Drugs: DrugsSlice,
  Symptoms: SymptomsSlice,
  Tests: TestsSlice,
  Vitals: VitalsSlice,
  Advices: AdvicesSlice,
  Diagnoses: DiagnosesSlice,
  FollowUps: FollowUpsSlice,
  Histories: HistoriesSlice,
  Salts: SaltSlice,
  EmailSlice: EmailSlice,
  PackageSlice: PackageSlice,
  LocationSlice: LocationSlice,
  TimeSlotsSlice: TimeSlotsSlice,
  DoctorAvailability: DoctorAvailability,
  DoctorPatientSlice: DoctorPatientSlice,
  AppointmentTypesSlice: AppointmentTypesSlice,
  PatientAppointmentSlice: PatientAppointmentSlice,
  AppointmentByPatientSlice: AppointmentByPatientSlice,
  DoctorTimeSlotsSlice: DoctorTimeSlotsSlice,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(timeslotApi.middleware)
      .concat(updateProfile.middleware).concat(updateDoctorProfile.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default { store, persistor };
