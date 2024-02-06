import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  
  endpoints: (builder) => ({
    // Endpoint for submitting inquiry for the contact form on home page
    submitInquiry: builder.mutation({
      query: (inquiryData) => ({
        url: 'create-contact/',
        method: 'POST',
        body: inquiryData,
      }),
    }),
  }),
});

export const { useSubmitInquiryMutation } = apiSlice;
