import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Token ${token}` : '';
};

export const updateDoctorProfile = createApi({
  reducerPath: 'doctorProfileApi', 
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

  tagTypes: ['AccountInformation'], 
  endpoints: (builder) => ({
    updateDoctorAccount: builder.mutation({
      query: (body) => ({
        url: '/account-information/',
        method: 'PATCH',
        body,
      }),
      // invalidatesTags: ['AccountInformation'], 
    }),
    updateProfessionalInfo: builder.mutation({
      query: (body) => ({
        url: '/professional-info/',
        method: 'PATCH',
        body,
      }),
    }),
    updatePracticeInfo: builder.mutation({
      query: (body) => ({
        url: '/practice-details/',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useUpdateDoctorAccountMutation, useUpdateProfessionalInfoMutation, useUpdatePracticeInfoMutation } = updateDoctorProfile;