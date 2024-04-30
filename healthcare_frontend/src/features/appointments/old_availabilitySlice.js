import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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