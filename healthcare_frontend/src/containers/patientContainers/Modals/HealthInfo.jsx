import React from 'react';
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Formik, Field, Form, useField, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateHealthInfoMutation } from '../../../features/patient/updateProfile';  
import toast from 'react-hot-toast';

const ProfileSchema = Yup.object().shape({
    type_of_diabetes: Yup.string().required('Required'),
    date_of_diagnosis: Yup.date().required('Required'),
    blood_sugar_level: Yup.string().required('Required'),
    target_blood_sugar_level: Yup.string().required('Required'),
});

const DatePickerField = ({ ...props }) => {
    const [field, meta, helpers] = useField(props);
    return (
        <>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => {
                    helpers.setValue(value);
                }}
                onBlur={() => helpers.setTouched(true)} // Ensure the field is marked as touched on blur
                dateFormat="yyyy-MM-dd" // Correct format here
            />
            {meta.touched && meta.error ? (
                <div className="invalid-feedback d-block">{meta.error}</div> // Display error message
            ) : null}
        </>
    );
};

const HealthInfo = ({ showModal, handleClose, details, onUpdateSuccess }) => {
    const [updateHealthInfo, { isLoading, isSuccess, error }] = useUpdateHealthInfoMutation();

    const formInitialValues = {
        type_of_diabetes: details?.data?.information?.type_of_diabetes || '',
        date_of_diagnosis: details?.data?.information?.date_of_diagnosis || '',
        blood_sugar_level: details?.data?.information?.blood_sugar_level || '',
        target_blood_sugar_level: details?.data?.information?.target_blood_sugar_level || '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('Submitting the data:', values);
        setSubmitting(true);

        // Format the date_of_diagnosis field to "yyyy-MM-DD"
        const formattedValues = {
            ...values,
            date_of_diagnosis: values.date_of_diagnosis ? moment(values.date_of_diagnosis).format('yyyy-MM-DD') : '',
        };

        try {
            await updateHealthInfo(formattedValues).unwrap();
            toast.success('Health information updated successfully!');
            onUpdateSuccess(formattedValues); // Call this after success
            handleClose();
            resetForm();
            setSubmitting(false);
        } catch (err) {
            console.error('Failed to update health info:', err);
            toast.error('Failed to update health information.');
            setSubmitting(false);
        }
    };


    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Health Information</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={formInitialValues}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, touched, errors }) => (
                    <Form>
                        <Modal.Body>
                            {error && <Alert variant="danger">Failed to update health information.</Alert>}
                            <div className="form-group">
                                <label htmlFor="type_of_diabetes">Type of Diabetes</label>
                                <Field name="type_of_diabetes" type="text" className={`form-control ${touched.type_of_diabetes && errors.type_of_diabetes ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="type_of_diabetes" component="div" className="invalid-feedback" />

                            </div>
                            <div className="form-group">
                                <label htmlFor="date_of_diagnosis">Date of Diagnosis</label>
                                <DatePickerField
                                    name="date_of_diagnosis"
                                    className={`form-control ${touched.date_of_diagnosis && errors.date_of_diagnosis ? 'is-invalid' : ''}`}
                                    dateFormat="yyyy-MM-dd" // Ensure this matches the expected format
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="blood_sugar_level">Current Blood Sugar Level (mg/dL)</label>
                                <Field name="blood_sugar_level" type="text" className={`form-control ${touched.blood_sugar_level && errors.blood_sugar_level ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="blood_sugar_level" component="div" className="invalid-feedback" />

                            </div>
                            <div className="form-group">
                                <label htmlFor="target_blood_sugar_level">Target Blood Sugar Level (mg/dL)</label>
                                <Field name="target_blood_sugar_level" type="text" className={`form-control ${touched.target_blood_sugar_level && errors.target_blood_sugar_level ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="target_blood_sugar_level" component="div" className="invalid-feedback" />

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

export default HealthInfo;
