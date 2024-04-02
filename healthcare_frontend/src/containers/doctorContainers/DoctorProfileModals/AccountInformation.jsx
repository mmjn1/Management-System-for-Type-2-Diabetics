import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUpdateDoctorAccountMutation } from '../../../features/doctor/updateDoctorProfile';
import toast from 'react-hot-toast';

const AccountSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
});


const AccountInformation = ({ showModal, handleClose, details, onUpdateSuccess }) => {
    const [updateDoctorAccount, { isLoading, error }] = useUpdateDoctorAccountMutation();

    const userData = details?.data?.user;

    const formInitialValues = {
        email: userData?.email || '',
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            await updateDoctorAccount(values).unwrap();
            toast.success('Account information updated successfully!');
            onUpdateSuccess();

            setTimeout(() => {
                handleClose();
                onUpdateSuccess(values);
            }, 2500);
            resetForm();
        } catch (error) {
            console.error('Failed to update account info:', error);
            toast.error('Failed to update account information.');
        }
        setSubmitting(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Account Information</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={formInitialValues}
                validationSchema={AccountSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, touched, errors }) => (
                    <Form>
                        <Modal.Body>
                            {error && <Alert variant="danger">Failed to update account information.</Alert>}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="text" className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <Field name="first_name" type="text" className={`form-control ${touched.first_name && errors.first_name ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="first_name" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <Field name="last_name" type="text" className={`form-control ${touched.last_name && errors.last_name ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="last_name" component="div" className="invalid-feedback" />
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


export default AccountInformation;