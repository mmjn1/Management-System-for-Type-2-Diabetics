import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../src/features/api/authslice';
import LoginSlice from '../src/features/api/loginslice';
import registerPatientSlice  from 'features/patient_register';
import registerDoctor from './features/doctor_register';
import ForgetPasswordConfirm from './features/api/forgetPassword_confirmslice';
import ForgotPasswordfunction from 'features/api/forgetPassword';

export const store = configureStore({
  reducer: {

    [apiSlice.reducerPath]: apiSlice.reducer,

    login: LoginSlice, 
    registerPatient: registerPatientSlice, 
    registerDoctor: registerDoctor, 
    forgetPasswordConfirm: ForgetPasswordConfirm, 
    forgotPasswordfunction: ForgotPasswordfunction,

  }, 

    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware),

}); 

export default store;
