import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => ({
        url: "/patient",
        method: "GET",
        headers: {
          //   "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),

    createPatient: builder.mutation({
      query: (body) => ({
        url: "/auth/patient-register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetPatientsQuery } = apiSlice;
