import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { fetchPatientRecords } from "../../features/api/patient_records";
import "../../assets/patientcss/records.css";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const PatientDetailsPage = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const patientId = query.get('patientId');
    const dispatch = useDispatch();
    const patientDetails = useSelector(state => state.patientRecords.currentRecord);

    useEffect(() => {
        if (patientId) {
            dispatch(fetchPatientRecords(patientId));
        }
    }, [dispatch, patientId]);

    const handleCreateCustomForm = () => {
        navigate('/forms/create');
    };

    if (!patientDetails) {
        return <div className="loading-patient-details">Loading patient details...</div>;
    }

    return (
        <div className="patient-details-container">
            <div style={{ marginBottom: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleCreateCustomForm}>
                    Create Custom Form
                </Button>
            </div>
            <div className="patient-details-section">
                <h2>Patient Identification</h2>
                <table className="patient-identification-table">
                    <tbody>
                        <tr><th>Name:</th><td>{patientDetails.first_name} {patientDetails.last_name}</td></tr>
                        <tr><th>Type of Diabetes:</th><td>{patientDetails.type_of_diabetes}</td></tr>
                        <tr><th>Date of Diagnosis:</th><td>{patientDetails.date_of_diagnosis}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="patient-details-section">
                <h2>Current Health Status</h2>
                <table className="patient-health-status-table">
                    <tbody>
                        <tr><th>Blood Sugar Level:</th><td>{patientDetails.blood_sugar_level}</td></tr>
                        <tr><th>Target Blood Sugar Level:</th><td>{patientDetails.target_blood_sugar_level}</td></tr>
                        <tr><th>Medication Adherence:</th><td>{patientDetails.medication_adherence}</td></tr>
                        <tr><th>Current Diabetes Medication:</th><td>{patientDetails.current_diabetes_medication}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="patient-details-section">
                <h2>Lifestyle Information</h2>
                <table className="patient-lifestyle-table">
                    <tbody>
                        <tr><th>Dietary Habits:</th><td>{patientDetails.dietary_habits}</td></tr>
                        <tr><th>Physical Activity Level:</th><td>{patientDetails.physical_activity_level}</td></tr>
                        <tr><th>Smoking Habits:</th><td>{patientDetails.smoking_habits}</td></tr>
                        <tr><th>Alcohol Consumption:</th><td>{patientDetails.alcohol_consumption}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="patient-details-section">
                <h2>Medical History</h2>
                <table className="patient-medical-history-table">
                    <tbody>
                        <tr><th>Family Medical History:</th><td>{patientDetails.family_medical_history}</td></tr>
                        <tr><th>Medical History:</th><td>{patientDetails.medical_history}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientDetailsPage;
