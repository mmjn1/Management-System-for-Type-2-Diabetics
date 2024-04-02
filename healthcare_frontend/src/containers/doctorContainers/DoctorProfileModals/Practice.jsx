import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdatePracticeInfoMutation } from '../../../features/doctor/updateDoctorProfile';
import toast from 'react-hot-toast';

const PracticeSchema = Yup.object().shape({
    contact_hours: Yup.string().required('Contact hours are required'),
    tel_number: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Telephone number is required'),
    emergency_consultations: Yup.string().required('Emergency consultations availability is required'),
    treatment_approach: Yup.string().required('Treatment approach is required'),
});

const Practice = ({ showModal, handleClose, details, onUpdateSuccess }) => {
    const [updatePracticeInfo, { isLoading, error }] = useUpdatePracticeInfoMutation();

    const userInformation = details?.data?.information;

    const formInitialValues = {
        contact_hours: userInformation?.contact_hours || '',
        tel_number: userInformation?.tel_number || '',
        emergency_consultations: userInformation?.emergency_consultations || '',
        treatment_approach: userInformation?.treatment_approach || '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            await updatePracticeInfo(values).unwrap();
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
                validationSchema={PracticeSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, touched, errors }) => (
                    <Form>
                        <Modal.Body>
                            {error && <Alert variant="danger">Failed to update account information.</Alert>}
                            <div className="form-group">
                                <label htmlFor="contact_hours"> Contact Hours</label>
                                <Field name="contact_hours" type="text" className={`form-control ${touched.contact_hours && errors.contact_hours ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="contact_hours" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tel_number"> Telephone Number </label>
                                <Field name="tel_number" type="text" as="textarea" className={`form-control ${touched.tel_number && errors.tel_number ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="tel_number" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergency_consultations"> Emergency Consultations Availability </label>
                                <Field name="emergency_consultations" type="text" as="textarea" className={`form-control ${touched.emergency_consultations && errors.emergency_consultations ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="emergency_consultations" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="treatment_approach"> Treatment Approach</label>
                                <Field name="treatment_approach" type="text" as="textarea" className={`form-control ${touched.treatment_approach && errors.treatment_approach ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="treatment_approach" component="div" className="invalid-feedback" />
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


export default Practice;


