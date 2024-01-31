import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/", // Django backend url
  }),
  // endpoints: (builder) => ({
  //     registerPatient: builder.mutation({
  //         query: (body) => ({
  //             url: "register/patient/",
  //             method: "POST",
  //             body,
  //         }),
});
