import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userReducer from './commonSlice';


export const registerUserDoctor = createAsyncThunk('/api/doctor/register', async (data, thunkAPI) => {
    // console.log("data on createAsyncThunk", data);

    const body = JSON.stringify({
        "email": data.email,
        "password": data.password,

        doctor: {
            "speciality": data.speciality,
            "years_of_experience": data.years_of_experience,
            "medical_license_number": data.medical_license_number,
            "country_of_issue": data.country_of_issue,
            "year_of_issue": data.year_of_issue,
            "diabetes_management_experience": data.diabetes_management_experience,
            "treatement_approach": data.treatement_approach,
            "contact_hours": data.contact_hours,
            "communication_method_for_patients": data.communication_method_for_patients,
            "tel_number": data.tel_number,
            "emergency_consulations": data.emergency_consulations

        },
        "re_password": data.re_password,
    });

    // console.log("body before try", body);


    try {
        // console.log("body in try", body);
        const res = await fetch(`/api/doctor/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body
        })

        // console.log("res on await", res);

        const data = await res.json();

        // console.log("data on await", data);

        if (res.status === 201) {
            return data;
        }
        else {
            return thunkAPI.rejectWithValue(data)
        }
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)

    }
});




const doctorSlice = createSlice({
    name: 'doctor',
    initialState: {
        ...userReducer.initialState,
    },
    reducers: {
        setDoctorData: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(registerUserDoctor.pending, state => {
            state.loading = true;
        })
            .addCase(registerUserDoctor.fulfilled, state => {
                state.loading = false;
                state.registered = true;
            })
            .addCase(registerUserDoctor.rejected, state => {
                state.loading = false;
            })
    }
});

export const { setDoctorData } = doctorSlice.actions;
export default doctorSlice.reducer;