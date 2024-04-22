
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPackage = createAsyncThunk('tasks/PackageSlice', async () => {
  const response = await axios.get('pay/package/');
  return response.data;
});

export const PackageSlice = createSlice({
  name: 'PackageSlice',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPackage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchPackage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default PackageSlice.reducer;
