import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userReducer from './commonSlice';

import { API_URL } from 'config';


export const registerUserPatient = createAsyncThunk(`/api/auth/patient/register`, async (data, thunkAPI) => {
    // console.log("data on createAsyncThunk", data);
    const body = JSON.stringify({

        "email": data.email,
        "password": data.password,
        "name": data.name,
        "patient": {
            "current_diabetes_medication": data.current_diabetes_medication,
            "dietary_habits": data.dietary_habits,
            "type_of_diabetes": data.type_of_diabetes,
            "date_of_diagnosis": data.date_of_diagnosis,
            "blood_sugar_level": data.blood_sugar_level,
            "target_blood_sugar_level": data.target_blood_sugar_level,
            "medical_history": data.medical_history,
            "physical_activity_level": data.physical_activity_level,
            "smoking_habits": data.smoking_habits,
            "alcohol_consumption": data.alcohol_consumption,
            "insurance_information": data.insurance_information,
        },
        "re_password": data.re_password,
      
    
    });

    try {
        const res = await fetch(`/api/auth/patient/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body
        });

        const data = await res.json();
        if (res.status === 201) {
            return data;

        }
        else {
            console.log("data on else on data", data);
            console.log("data on else + + with ThunkAPI ", thunkAPI.rejectWithValue(data));
            console.log("data on else + + with registerUserPatient ", registerUserPatient.fulfilled.toString());
            return thunkAPI.rejectWithValue(data);
        }
    }
    catch (err) {
        console.log("data on Catch + + with ThunkAPI ", thunkAPI.rejectWithValue(err.response.data));

        return thunkAPI.rejectWithValue(err.response.data);
    }
});


const getProfile = createAsyncThunk(`/api/patient/profile`, async (_, thunkAPI) => {

    try {
        const res = await fetch(`/api/patient/profile`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        })

        const data = await res.json(); // data is the response from the backend (express router --> router.get('/api/patient/profile', ...)

        // when the response is 200, return the data
        if (res.status === 200) {

            return data;
        }
        else {
            return thunkAPI.rejectWithValue(res.data);
        }



    } catch (err) {
        console.log("data on Catch + + with ThunkAPI ", thunkAPI.rejectWithValue(err.response.data));
    }
})

export const loginUser = createAsyncThunk(`/api/users/login`, async (data, thunkAPI) => {
    const body = JSON.stringify({
        email: data.email,
        password: data.password,
    });

    try {

        // this map to the backend route (express router --> router.post('/api/users/login', ...)
        const res = await fetch(`/api/users/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body
        });

        // console.log("res on await", res);

        const data = await res.json();

        // console.log("data on await", data);

        if (res.status === 200) {

            const { dispatch } = thunkAPI;

            // dispatch the action to set the patient data
            dispatch(getProfile());

            return data;

        }
        else {
            return thunkAPI.rejectWithValue(data);
        }
    }
    catch (err) {

        return thunkAPI.rejectWithValue(err.response.data);
    }
});


const patientSlice = createSlice({
    name: 'patient',
    // ...userReducer.initialState,
    initialState: {
        ...userReducer.initialState,
    },
    reducers: {
        ...userReducer.reducers,

        resetRegistered: (state) => {
            state.registered = false;
        },
        setPatientData: (state, action) => {

            // state.patientData = action.payload;
            state.user = action.payload; // store the patient data in the user field
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserPatient.pending, state => {
                state.loading = true;
            })

            .addCase(registerUserPatient.fulfilled, state => {
                state.loading = false;
                state.registered = true;
            })

            .addCase(registerUserPatient.rejected, state => {
                state.loading = false;
                state.registered = false;
            })

            .addCase(loginUser.pending, state => {
                state.loading = true;
            })

            .addCase(loginUser.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = true;
            })

            .addCase(loginUser.rejected, state => {
                state.loading = false;
                state.isAuthenticated = false;
            })

            .addCase(getProfile.pending, state => {
                state.loading = true;
            })

            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(getProfile.rejected, state => {
                state.loading = false;
            })


            ;
    },
});


// login the user

export const { setPatientData, resetRegistered } = patientSlice.actions;

export default patientSlice.reducer;