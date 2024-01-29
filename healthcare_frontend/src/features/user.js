import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import destructureJSONIntoOnlyKeysAndValues from '../Utils';



// >>>>>> Common payload utils <<<<<
function createUserProfilePayload(data, userType) {

    const payload = {
        profile: {
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            mobile_number: data.mobile_number,
    
        },
    };

    if (userType === 'patient') {
        payload.patient = {
            current_diabetes_medication: data.current_diabeitc_medication,
            blood_sugar_level: data.blood_sugar_level,
            dietary_habits: data.dietary_habits,
            physical_activity_level: data.phsyical_activity_level,
            date_last_HbA1c_test_and_result: data.date_last_HbA1c_test_and_result,
        };


    } else if (userType === 'doctor') {
        payload.doctor = {
            speciality: data.speciality,
            years_of_experience: data.years_of_experience,
            medical_license_number: data.medical_license_number,
            country_of_issue: data.country_of_issue,
            year_of_issue: data.year_of_issue,
            diabetes_management_experience: data.diabetes_management_experience,
            contact_hours: data.contact_hours,
                      
        };
    }

    // add email and password
    payload.email = data.email;
    payload.password = data.password;
    payload.re_password = data.re_password;


    return payload;
}


function formatDate(date, know_full_date) {
    const d = new Date(date);
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let day = d.getDate();

    if (know_full_date) {
        // format: dd-mm-yyyy
        return `${d.toLocaleString('default', { day: '2-digit' })}-${d.toLocaleString('default', { month: '2-digit' })}-${year}`;
    } else {
        if (month < 10) {
            // format: mm-yyyy
            return `${d.toLocaleString('default', { month: '2-digit' })}-${year}`;
        } else {
            // format: mm-yyyy
            return `${month}-${year}`;
        }
    }
}


// >> End of common payload utils <<




// <<<<<==========  Patient Registration ==========>>>>>>

/**
 * @name registerUserPatient
 * @description This function is used to register a patient
 */
export const registerUserPatient = createAsyncThunk(`/api/patient/register`, async (data, thunkAPI) => {
    const body = JSON.stringify(
        // this is the new payload function with userType as student
        createUserProfilePayload(data, 'patient'),
    );



    try {
        const res = await fetch(`/api/patient/register`, {
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
            // console.log("data on else on data", data);
            // console.log("data on else + + with ThunkAPI ", thunkAPI.rejectWithValue(data));
            // console.log("data on else + + with registerUserStudent ", registerUserStudent.fulfilled.toString());
            return thunkAPI.rejectWithValue(data);
        }
    }
    catch (err) {
        // console.log("data on Catch + + with ThunkAPI ", thunkAPI.rejectWithValue(err.response.data));

        return thunkAPI.rejectWithValue(err.response.data);
    }
});




// <<<<<<----====== Doctor function ======------>>>>>>

/**
 * @name registerUserDoctor
 * @description This function is used to register a doctor
 */
export const registerUserDoctor = createAsyncThunk('/api/doctor/register', async (data, thunkAPI) => {

    const body = JSON.stringify(

        // this is the new payload function with userType as doctor
        createUserProfilePayload(data, 'doctor'),

    );

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



// ===================  Placement Form Submission ===================

///  --------============ Employer Placement Provider Form ============-------- ///
// -------- Employer Placement Provider Form submission function -------- ///
/**
 * @name submitEmployerPlacementProviderForm
 * @description This function is used to submit the employer placement provider form
*/


// --------========= END OF SUBMIT PLACEMENT PROVIDER FORM =========---------













// --------========= Start of Student Placement Authorization Form =========---------
/**
 * @name submitStudentPlacementAuthorisationForm
 * @description This function is used to submit the student placement provider form
*/


// --------========= END of Student Placement Authorization Form =========---------




const getProfile = createAsyncThunk(`/api/profile`, async (user_type, thunkAPI) => {

    // it can be student or employer
    const user = user_type;

    const body = JSON.stringify({
        user_type: user,
    });

    try {
        const res = await fetch(`/api/profile`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body
        })

        const data = await res.json(); // data is the response from the backend (express router --> router.get('/api/student/profile', ...)

        // when the response is 200, return the data
        if (res.status === 200) {
            // set the user type to the data

            // console.log("data on getProfile", data);
            // data.user_type = user_type;
            // console.log("data on getProfile", data);

            const plainJSON = destructureJSONIntoOnlyKeysAndValues(data);

            // plainJSON['user_type'] = user_type;
            // console.log("plainJSON on data", data);
            // console.log("plainJSON on getProfile", plainJSON);

            // console.log("plainJSON on after adding user_type");

            // add the user_type to the json object at the beginning
            // plainJSON.user_type = user_type;
            // console.log("plainJSON on getProfile", plainJSON['user_type']);
            // console.log((plainJSON))

            return plainJSON;
        }
        else {
            // console.log("data on else on data", data);
            return thunkAPI.rejectWithValue(res.data);
        }



    } catch (err) {
        // console.log("data on Catch + + with ThunkAPI ", thunkAPI.rejectWithValue(err.response.data));
        return thunkAPI.rejectWithValue(err.response.data);
    }
})


// console.log("data on createAsyncThunk", data);
export const loginUser = createAsyncThunk(`/api/users/login`, async (data, thunkAPI) => {
    // console.log("data on createAsyncThunk", data);
    const { email, password, user_type } = data;

    const body = JSON.stringify({
        email: data.email,
        password: data.password,
        user_type: data.user_type,
    });

    // console.log("body before try", body);


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
            // console.log("data on if", data);

            const { dispatch } = thunkAPI;

            // dispatch the action to set the student data
            dispatch(getProfile(user_type));

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

export const logoutUser = createAsyncThunk(`/api/users/logout`, async (_, thunkAPI) => {

    try {
        const res = await fetch(`/api/users/logout`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        const data = await res.json();

        if (res.status === 200) {
            console.log("logout scuuess");
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



export const activateUser = createAsyncThunk(
    '/api/activation',
    async ({ uid, token }, thunkAPI) => {

        // console.log("uid: ");

        try {
            // console.log("uid: ")
            const response = await fetch(`/api/users/activation/${uid}/${token}`);

            const data = await response.json();

            console.log("data on activation", data);

            if (response.status === 200) {
                console.log("data on if activation", data);
                return data;
            }
            else {
                return thunkAPI.rejectWithValue(data);
            }

        } catch (err) {
            // console.log("err on catch", err);
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
);

export const verifyAccount = createAsyncThunk(
    '/api/verify-account',
    async (_, thunkAPI) => {


        try {

            // this map to the backend route (express router --> router.post('/api/users/login', ...)
            const res = await fetch(`/api/verify-account`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            // console.log("res on await", res);

            const data = await res.json();

            console.log("data verifyAccount", data);

            if (res.status === 200) {
                // console.log("data on if", data);

                console.log("res on verifyAccount", res);

                const { dispatch } = thunkAPI;

                const { user_type } = data;

                // dispatch the action to set the student data
                dispatch(getProfile(user_type));

                return data;

            }
            else {
                console.log("data on else on verifyAccount", data);
                return thunkAPI.rejectWithValue(data);
            }
        }
        catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);



const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    registered: false,
    isPatient: false,
    isDoctor: false,
    isAdmin: false,
    errors: null,
};



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /**
         * @name reset registered
         */
        resetRegistered: state => {
            state.registered = false;
        },

        setStateErrors: (state, action) => {
            state.errors = action.payload;
        },

        /**
         * @name set user with payload
         * @description set the user to patient, doctor ,admin
         */
        setPatient: (state, action) => {
            state.user = action.payload;
            state.isPatient = true;
        },
        setDoctor: (state, action) => {
            state.user = action.payload;
            state.isDoctor = true;
        },
        setAdmin: (state, action) => {
            state.user = action.payload;
            state.isAdmin = true;
        },

        /**
         * @name logout
         * @description set the user to null and set the isAuthenticated to false
         */
        logout: state => {
            state.isAuthenticated = false;
            state.user = null;
            state.isPatient = false;
            state.isDoctor = false;
            state.isAdmin = false;
        },

       

    },
    extraReducers: builder => {
        builder

            // ============ ------ Patient ------============
            /**
             * Student  actions (register, login, get profile)
             */

            // ------ Patient Register ------
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


            // ------ Patient Login ------

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

            // ------ Patient Profile ------
            .addCase(getProfile.pending, state => {
                state.loading = true;

            })

            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;

                console.log("action.payload typeof ", typeof action.payload)

                // check re_password and delete it
                if (action.payload.re_password) {

                    delete action.payload.re_password;
                }
                console.log("action.payload", action.payload)

                /*
                *   1 = student
                *   2 = employer
                *   3 = tutor
                *   4 = admin
                */
                console.log("action.payload.role", action.payload.role);
                // console.log("action role type", typeof action.payload.role);
                if (action.payload.role === "1") {
                    console.log("I am a patient");
                    // console.log("I am a student");
                    // set the user to the payload
                    state.user = action.payload;
                    console.log("state.user", state.user);
                    // set the isStudent to true
                    state.isStudent = true;
                } else if (action.payload.role === "2") {
                    // set the user to the payload
                    state.user = action.payload;
                    // set the isDoctor to true
                    state.isDoctor = true;
                } else if (action.payload.role === "3") {
                    // set the user to the payload
                    state.user = action.payload;
                    // set the isTutor to true
                    state.isTutor = true;
                } else if (action.payload.role === "4") {
                    // set the user to the payload
                    state.user = action.payload;
                    // set the isAdmin to true
                    state.isAdmin = true;
                }


            })

            .addCase(getProfile.rejected, state => {
                state.loading = false;
            })


            // ============ ------ Doctor ------============
            // *------ Doctor Register ------* //
            /**
             * Doctor  actions (register, login, get profile)
             */
            .addCase(registerUserDoctor.pending, state => {
                state.loading = true;
            })
            .addCase(registerUserDoctor.fulfilled, state => {
                state.loading = false;
                state.registered = true;
            })
            .addCase(registerUserDoctor.rejected, state => {
                state.loading = false;
            })
            // *------ End of Doctor Register ------* //




            // ============ ------Activation ------============

            .addCase(activateUser.pending, state => {
                state.loading = true;
            })

            .addCase(activateUser.fulfilled, state => {
                state.loading = false;
                state.registered = true;
            })

            .addCase(activateUser.rejected, state => {
                state.loading = false;
            })



            // ============ ------Logout ------============
            .addCase(logoutUser.pending, state => {
                state.loading = true;
            })

            .addCase(logoutUser.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isPatient = false;
                state.isDoctor = false;
                state.isAdmin = false;
            })

            .addCase(logoutUser.rejected, state => {
                state.loading = false;
            })
            // ============ ------Verifying user ------============
            .addCase(verifyAccount.pending, state => {
                state.loading = true;
            })

            .addCase(verifyAccount.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = true;
            })

            .addCase(verifyAccount.rejected, state => {
                state.loading = false;
            })

            // =================[======Placement Submission Form ====== ]====================
            // *------ Employer Placement Form submission ------* //
       

    }
});

// export const { resetRegistered } = userSlice.actions;
// export default userSlice.reducer;

export const { resetRegistered,
    setPatient, setDoctor, setAdmin, logout, setStateErrors } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = state => state?.user?.user;
export const selectIsAuthenticated = state => state.user.isAuthenticated;
export const selectIsLoading = state => state.user.loading;
export const selectUserRole = state => state?.user?.user?.role;
// export const IsPlacementFormSubmitted = state => state?.user?.user?.is_placement_form_submitted;