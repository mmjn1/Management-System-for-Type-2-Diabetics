import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Token ${token}` : '';
};

export const updateProfile = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', token);
      }
      return headers; 
    },
  }),
  endpoints: (builder) => ({
    updateAccountInfo: builder.mutation({
      query: (body) => ({
        url: '/accountinfo/',
        method: 'PATCH',
        body,
      }),
    }),
    updateLifestyleMed: builder.mutation({
      query: (body) => ({
        url: '/lifestyle-med/',
        method: 'PATCH',
        body,
      }),
    }),
    updateHealthInfo: builder.mutation({
      query: (body) => ({
        url: '/health-info/',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useUpdateAccountInfoMutation, useUpdateLifestyleMedMutation, useUpdateHealthInfoMutation } = updateProfile;