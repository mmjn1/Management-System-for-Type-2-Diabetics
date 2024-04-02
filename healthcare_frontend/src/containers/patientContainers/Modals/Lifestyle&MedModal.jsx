import React from 'react';
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { useUpdateLifestyleMedMutation } from '../../../features/patient/updateProfile';

const LifestyleMedSchema = Yup.object().shape({
    dietary_habits: Yup.string().required('Dietary habits are required'),
    physical_activity_level: Yup.string().required('Physical activity level is required'),
    smoking_habits: Yup.string().required('Smoking habits are required'),
    alcohol_consumption: Yup.string().required('Alcohol consumption is required'),
    current_diabetes_medication: Yup.string().required('Current medications are required'),
    medication_adherence: Yup.string().required('Medication adherence is required'),
    family_medical_history: Yup.string().required('Family history is required'),
    medical_history: Yup.string().required('Medical history is required'),
});

const LifeStyleMedModal = ({ showModal, handleClose, details, onUpdateSuccess }) => {
    const [updateLifestyleMed, { isLoading, error }] = useUpdateLifestyleMedMutation();

    const formInitialValues = {
        dietary_habits: details?.data?.information?.dietary_habits || '',
        physical_activity_level: details?.data?.information?.physical_activity_level || '',
        smoking_habits: details?.data?.information?.smoking_habits || '',
        alcohol_consumption: details?.data?.information?.alcohol_consumption || '',
        current_diabetes_medication: details?.data?.information?.current_diabetes_medication || '',
        medication_adherence: details?.data?.information?.medication_adherence || '',
        family_medical_history: details?.data?.information?.family_medical_history || '',
        medical_history: details?.data?.information?.medical_history || '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            await updateLifestyleMed(values).unwrap();
            toast.success('Lifestyle and Medical History successfully updated!');
            onUpdateSuccess(); 

            setTimeout(() => {
                handleClose(); // Close the modal after a delay
                onUpdateSuccess(values);
            }, 2500);
            resetForm();

        } catch (err) {
            console.error('Failed to update health info:', err);
            toast.error('Failed to update health information.');
        }
        setSubmitting(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Update Lifestyle and Medical History</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={formInitialValues}
                validationSchema={LifestyleMedSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, touched, errors }) => (
                    <Form>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="dietary_habits">Dietary Habits</label>
                                <Field name="dietary_habits" as="textarea" type="text" className={`form-control ${touched.dietary_habits && errors.dietary_habits ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="dietary_habits" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="physical_activity_level">Physical Activity Level</label>
                                <Field name="physical_activity_level" as="textarea" className={`form-control ${touched.physical_activity_level && errors.physical_activity_level ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="physical_activity_level" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="smoking_habits">Smoking Habits</label>
                                <Field name="smoking_habits" type="text" className={`form-control ${touched.smoking_habits && errors.smoking_habits ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="smoking_habits" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="alcohol_consumption">Alcohol Consumption</label>
                                <Field name="alcohol_consumption" type="text" className={`form-control ${touched.alcohol_consumption && errors.alcohol_consumption ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="alcohol_consumption" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="current_diabetes_medication">Current Medications</label>
                                <Field name="current_diabetes_medication" as="textarea" className={`form-control ${touched.current_diabetes_medication && errors.current_diabetes_medication ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="current_diabetes_medication" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="medication_adherence">Medication Adherence</label>
                                <Field name="medication_adherence" type="text" className={`form-control ${touched.medication_adherence && errors.medication_adherence ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="medication_adherence" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="family_medical_history">Family History</label>
                                <Field name="family_medical_history" as="textarea" className={`form-control ${touched.family_medical_history && errors.family_medical_history ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="family_medical_history" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="medical_history">Medical History</label>
                                <Field name="medical_history" as="textarea" className={`form-control ${touched.medical_history && errors.medical_history ? 'is-invalid' : ''}`} />
                                <ErrorMessage name="medical_history" component="div" className="invalid-feedback" />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
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

export default LifeStyleMedModal;
