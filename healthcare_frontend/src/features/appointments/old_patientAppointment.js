// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//
// const baseUrl = 'http://localhost:8000/api';
//
// // Function to retrieve the token from local storage or any other storage mechanism
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };
//
// export const patientAppointmentCreation = createApi({
//   reducerPath: 'appointmentApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl,
//     prepareHeaders: (headers, { getState }) => {
//       // Get the auth token from the storage
//       const token = getAuthToken();
//       // If we have a token, set the Authorization header
//       if (token) {
//         headers.set('Authorization', `Token ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Appointment'],
//   endpoints: (builder) => ({
//     submitAppointment: builder.mutation({
//       query: (appointmentData) => ({
//         url: '/patient-create-appointment/',
//         method: 'POST',
//         body: appointmentData,
//       }),
//       invalidatesTags: ['Appointment'],
//     }),
//   }),
// });
//
// export const { useSubmitAppointmentMutation } = patientAppointmentCreation;