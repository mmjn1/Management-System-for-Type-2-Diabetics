import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Card } from 'react-bootstrap';

const MyRecords = () => {
    const [records, setRecords] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const patientId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const config = {
            headers: { Authorization: `Token ${token}` }
        };

        axios.get(`/api/patient/${patientId}/forms/`, config)
            .then(response => {
                setRecords(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the records:', error);
                setError('There was an error fetching your records.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!records || records.length === 0) {
        return <p>No records found.</p>;
    }

    return (
        <div className="my-records">
            <h1 className="text-center mb-4">My Records</h1>
            {records.map((record, index) => (
                <div key={index} className="record-card mb-3 p-3 border rounded">
                    <h2 className="record-title mb-3">{record.form_name}</h2>
                    <p className="record-submitted mb-1"><strong>Submitted by:</strong> Dr. {record.doctor_name}</p>
                    <p className="record-date mb-2"><strong>Date:</strong> {new Date(record.created_at).toLocaleDateString()}</p>
                    <div className="record-responses">
                        {record.responses.map((response, idx) => (
                            <div key={idx} className="response-item mb-1">
                                <strong>{response.field_label}:</strong> {response.response_value}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyRecords;