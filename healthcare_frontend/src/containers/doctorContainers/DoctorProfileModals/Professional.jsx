import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateProfessionalInfoMutation } from '../../../features/doctor/updateDoctorProfile';
import toast from 'react-hot-toast';

const ProfessionalSchema = Yup.object().shape({
    speciality: Yup.string().required('Speciality is required'),
    diabetes_management_experience: Yup.string().required('Diabetes management experience is required'),
});

const Professional = ({ showModal, handleClose, details, onUpdateSuccess }) => {
    const [updateProfessionalInfo, { isLoading, error }] = useUpdateProfessionalInfoMutation();

    const userInformation = details?.data?.information;

    const formInitialValues = {
        diabetes_management_experience: userInformation?.diabetes_management_experience || '',
        speciality: userInformation?.speciality || '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            await updateProfessionalInfo(values).unwrap();
            toast.success('Practice information updated successfully!');
            onUpdateSuccess();

            setTimeout(() => {
                handleClose();
                onUpdateSuccess(values);
            }, 2500);
            resetForm();
        } catch (error) {
            console.error('Failed to update practice info:', error);
            toast.error('Failed to update Practice information.');
        }
        setSubmitting(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Practice Information</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={formInitialValues}
                validationSchema={ProfessionalSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, touched, errors }) => (
                    <Form>
                        <Modal.Body>
                            {error && <Alert variant="danger">Failed to update account information.</Alert>}
                            <div className="form-group">
                                <label htmlFor="speciality"> Speciality</label>
                                <Field name="speciality" type="text" className={`form-control ${touched.speciality && errors.speciality ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="speciality" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="diabetes_management_experience"> Diabetes Management Experience </label>
                                <Field name="diabetes_management_experience" type="text" as="textarea" className={`form-control ${touched.diabetes_management_experience && errors.diabetes_management_experience ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="diabetes_management_experience" component="div" className="invalid-feedback" />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting || isLoading}>
                                {isSubmitting || isLoading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="sr-only">Saving...</span>
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );

};


export default Professional;