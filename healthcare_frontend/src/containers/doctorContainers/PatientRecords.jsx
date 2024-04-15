import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientRecords } from "../../features/api/patient_records";
import { DataGrid } from '@mui/x-data-grid';
import "../../assets/patientcss/records.css";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


const PatientRecords = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const patientRecordsState = useSelector(state => state.patientRecords);


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'first_name', headerName: 'First name', width: 130 },
        { field: 'last_name', headerName: 'Last name', width: 130 },
        { field: 'date_of_diagnosis', headerName: 'Date of Diagnosis', width: 160 },
        { field: 'blood_sugar_level', headerName: 'Blood Sugar Level', width: 160 },
        { field: 'target_blood_sugar_level', headerName: 'Target Blood Sugar Level', width: 190 },
        { field: 'current_diabetes_medication', headerName: 'Current Diabetes Medication', width: 210 },
        { field: 'medication_adherence', headerName: 'Medication Adherence', width: 190 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => handleView(params.row)}
                    >
                        View
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    const handleView = (row) => {
        // Navigate to the PatientDetailsPage with the patient ID as a query parameter
        navigate(`/doctor/patient-details?patientId=${row.id}`);
    };



    useEffect(() => {
        dispatch(fetchPatientRecords());
    }, [dispatch]);

    useEffect(() => {
    }, [patientRecordsState.records]);


    return (
        <div style={{ height: '100%', width: '83%' }}>
            <div className="containers">


                <DataGrid
                    rows={Array.isArray(patientRecordsState.records) ? patientRecordsState.records.map((patient, index) => ({
                        ...patient,
                        id: patient.id || index,
                        first_name: patient.first_name,
                        last_name: patient.last_name,
                        email: patient.email,
                        date_of_diagnosis: patient.date_of_diagnosis,
                        blood_sugar_level: patient.blood_sugar_level,
                        target_blood_sugar_level: patient.target_blood_sugar_level,
                        current_diabetes_medication: patient.current_diabetes_medication,
                        medication_adherence: patient.medication_adherence,
                    })) : []}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                    loading={patientRecordsState.status === 'loading'}
                />
            </div>
        </div>
    );
}

export default PatientRecords;
