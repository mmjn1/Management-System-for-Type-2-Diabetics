import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const register = createAsyncThunk(
  'api/patient/register/', async ({email, password}, thunkAPI) => {
    const body = JSON.stringify({
      email, 
      password
    });

    try {
      const res = await fetch('/api/patient/register/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body
    })

      const data = await res.json();

      if (res.status === 201) {
        return data;


      } else {
        return thunkAPI.rejectWithValue(data);
      }
      
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);

    }

  }
);

const initialState = { 
  isAuthenticated: false,
  isActivated: false,
  user: null,
  loading: false,
  registered: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetRegistered: state => {
      state.registered = false;
    },
  },

  extraReducers: builder => {
    builder.addCase(register.pending, state => {
      state.loading = true;
    });

    builder.addCase(register.fulfilled, state => {
      state.loading = false;
      state.registered = true;
    });

    builder.addCase(register.rejected, state => {
      state.loading = false;
    });
  
  }

})

export const { resetRegistered } = userSlice.actions
export default userSlice.reducer