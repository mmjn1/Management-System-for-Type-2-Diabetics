import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * This slice of the Redux store manages API interactions for doctor availability.
 * It uses RTK Query to handle network requests, providing an integration with the Redux store.
 *
 * The `updateAvailability` mutation is designed to send doctor availability data to the backend.
 * It takes the availability data as input and performs a POST request to the specified URL.
 * The mutation is accessible via an auto-generated hook, `useUpdateAvailabilityMutation`,
 * which can be used within React components to trigger the mutation.
 */

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createAvailability: builder.mutation({
      query: (newAvailabilityData) => ({
        url: '/create-availability/',
        method: 'POST',
        body: newAvailabilityData,
      }),
    }),
    updateAvailability: builder.mutation({
      query: ({ id, ...updateAvailabilityData }) => ({
        url: `/update-availability/${id}/`, 
        method: 'PATCH',
        body: updateAvailabilityData,
      }),
    }),
  }),
});

export const { useCreateAvailabilityMutation, useUpdateAvailabilityMutation } = doctorApi;