import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    useGetPatientsQuery, 
} from '../features/authslice';

const PatientLoginPage = () => {
    const dispatch = useDispatch();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // console.log(email, password)

    const {
        data: patients,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetPatientsQuery();
    console.log(patients)

    const onSubmit = (e) => {
        e.preventDefault();
        let userCredentials = {
            email, password
        };
    };

    let content;
    if (isLoading) {
        content = <p> Loading... </p>;  
    } else if (isSuccess) {
        content = JSON.stringify(patients)
    } else if(isError) {
        content = <p>{error}</p>
    }
 
    return (
        <div className="container mt-5">
            <h1>Sign In</h1>
            <p>Sign into your account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email} onChange={e => setEmail(e.target.value)} required
                    />
                    </div>

                    <div className="form-group">
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength="6"
                        required />
                    </div>
                    <button className='btn btn-primary' type="submit"> Login </button>
            </form>

            <p className="mt-3">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <p className='mt-3'>
                Forgot your password? <Link to="/reset-password">Reset Password</Link>
            </p>
        </div>
    );
};


export default PatientLoginPage;

