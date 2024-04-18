// services/timeslotApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const timeslotApi = createApi({
  reducerPath: 'timeslotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (builder) => ({
    getTimeslotById: builder.query({
      query: (timeSlotId) => `/timeslots/${timeSlotId}/`,
    }),
  }),
});

export const { useGetTimeslotByIdQuery } = timeslotApi;