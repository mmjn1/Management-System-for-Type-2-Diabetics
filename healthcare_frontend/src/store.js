import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/api/userslice';
import registerDoctor from "./features/doctor_register";
import registerUserPatient from "./features/patient_register";
import forgetPasswordfunction from "./features/api/forgetPassword";
import ForgetPasswordConfirm from "./features/api/forgetPassword_confirm";
import fetchDoctor from "./features/FetchDoctor";
import userDetailsSlice from "./features/api/Userdetails";
import { apiSlice } from "../src/features/api/authslice";
import appointmentsReducer from "./features/api/appointmentsSlice";
import { patient_appointment } from "./features/api/create_appointment";
import chatReducer from "./features/chat/chatSlice";


import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistStore, persistReducer } from "redux-persist";
import { doctorApi } from './features/availabilitySlice';


const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [doctorApi.reducerPath]: doctorApi.reducer,

  user: userReducer,
  registerDoctor: registerDoctor,
  registerUserPatient: registerUserPatient,
  forgetPasswordfunction: forgetPasswordfunction,
  ForgetPasswordConfirm: ForgetPasswordConfirm,
  DoctorSlice: fetchDoctor,
  userDetails: userDetailsSlice,
  appointments: appointmentsReducer,
  patientAppointment: patient_appointment,
  chat: chatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(doctorApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store); 

export default { store, persistor };
