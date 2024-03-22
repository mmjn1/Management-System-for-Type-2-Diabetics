import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const doctorAvailabilityApi = createApi({
  reducerPath: 'doctorAvailabilityApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  tagTypes: ['DoctorAvailability'], 
  endpoints: (builder) => ({
    getDoctorAvailability: builder.query({
      query: ({ doctorId, date }) => `doctor-availability/?doctorId=${doctorId}&date=${date}`,
      providesTags: (result, error, { doctorId }) => [{ type: 'DoctorAvailability', id: doctorId }],
    }),
    updateDoctorAvailability: builder.mutation({
      query: (updateData) => ({
        url: `/update-availability/${updateData.doctorId}`, 
        method: 'POST',
        body: updateData,
      }),
      invalidatesTags: (result, error, { doctorId }) => [{ type: 'DoctorAvailability', id: doctorId }],
    }),
    
  }),
});

export const { useGetDoctorAvailabilityQuery, useUpdateDoctorAvailabilityMutation } = doctorAvailabilityApi;
