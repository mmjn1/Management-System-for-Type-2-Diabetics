import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * CustomForms is a React component that provides a UI for managing and interacting with form records. It supports operations such as fetching, searching, viewing, editing, and deleting form entries. Each form entry is associated with a patient, and additional patient details are fetched and displayed with each form. The component handles API interactions, state management, and dynamic UI updates based on user actions and data retrieval status.
 *
 * Features:
 * - Fetches forms from an API and enriches them with patient names.
 * - Provides a search functionality to filter forms by patient name.
 * - Supports CRUD operations on forms.
 * - Displays a modal for delete confirmation to prevent accidental deletions.
 *
 * Error handling is incorporated to manage and display errors during API interactions. Loading states are also managed to enhance the user experience during data fetching or processing.
 */


const CustomForms = () => {
    const [forms, setForms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formToDelete, setFormToDelete] = useState(null);


    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/forms/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                const formsWithPatient = await Promise.all(response.data.map(async form => {
                    try {
                        const patientResponse = await axios.get(`http://localhost:8000/api/patient-records/${form.patient}/`, {
                            headers: {
                                Authorization: `Token ${localStorage.getItem('token')}`,
                            },
                        });
                        return { ...form, patientName: `${patientResponse.data.first_name} ${patientResponse.data.last_name}` };
                    } catch (err) {
                        console.error('Error fetching patient details:', err);

                        return { ...form, patientName: 'No patient details' };
                    }
                }));
                setForms(formsWithPatient);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []);

    const filteredForms = searchTerm
        ? forms.filter(form =>
            form.patientName && form.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
        : forms;


    const handleDelete = (formId) => {
        setFormToDelete(formId);
    };

    const handleDeleteConfirmed = async () => {
        if (!formToDelete) return;

        try {
            await axios.delete(`http://localhost:8000/api/forms/${formToDelete}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            setForms(forms.filter((form) => form.id !== formToDelete));
            setFormToDelete(null); 
        } catch (error) {
            console.error('Failed to delete the form:', error);
        }
    };

    const handleCloseModal = () => {
        setFormToDelete(null);
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">An error occurred: {error}</div>;

    return (
        <div className="container">
            <div className="d-flex align-items-center my-5">
                <h1 className="flex-grow-1">Forms</h1>
                <div className="d-flex align-items-center">
                    <div className="me-2" style={{ width: '200px' }}>
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ height: '38px' }}
                        />
                    </div>
                    <Link to="/forms/create" className="btn btn-outline-primary" style={{ lineHeight: '1.5' }}>
                        Create New Form
                    </Link>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Form Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredForms.map((form) => (
                        <tr key={form.id}>
                            <td>{form.id}</td>
                            <td>{form.patientName}</td>
                            <td>{form.name}</td>
                            <td>
                                <Link to={`/forms/${form.id}/details`} className="btn btn-info mx-1">
                                    View
                                </Link>
                                <Link to={`/forms/${form.id}/edit`} className="btn btn-primary mx-1">
                                    Edit
                                </Link>
                                <button className="btn btn-danger mx-1" onClick={() => handleDelete(form.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {formToDelete && (
                <DeleteConfirmationModal
                    onDeleteConfirmed={handleDeleteConfirmed}
                    onCancel={handleCloseModal}
                />
            )}
        </div>
    );
};

const DeleteConfirmationModal = ({ onDeleteConfirmed, onCancel }) => {
    return (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Confirmation</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this form?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onDeleteConfirmed}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomForms;
