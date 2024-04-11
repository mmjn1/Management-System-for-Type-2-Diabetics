import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPatientRecords = createAsyncThunk("patients/fetchRecords", async (patientId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const header = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };
        const url = patientId ? `/api/patient-records/${patientId}/` : '/api/patient_records/';
        const response = await axios.get(url, header);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient records:', error);
        return rejectWithValue(error.response.data);
    }
});

export const patientRecordsSlice = createSlice({
    name: "patientRecords",
    initialState: {
        records: null, // For storing multiple records
        currentRecord: null, // For storing a specific record
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientRecords.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPatientRecords.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Check if the payload is an array (multiple records)
                if (Array.isArray(action.payload)) {
                    state.records = action.payload;
                } else {
                    // If not an array, assume it's a single record
                    state.currentRecord = action.payload;
                }
            })
            .addCase(fetchPatientRecords.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default patientRecordsSlice.reducer;