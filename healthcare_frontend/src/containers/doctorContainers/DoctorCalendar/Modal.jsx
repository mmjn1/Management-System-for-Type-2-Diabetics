import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { FetchDoctorPatient } from '../../../features/appointments/Doctor_PatientSlice';
import { FetchAppointmentTypes } from '../../../features/appointments/AppointmentTypes';
import { fetchTimeSlots } from '../../../features/appointments/DoctorAvailabilitySlice';
import { CreatePatientAppointment } from '../../../features/appointments/PatientAppointment';
import { useFormik } from 'formik';
import { fetchDoctorTimeSlots } from '../../../features/appointments/doctor_slots';

const today = new Date();
today.setHours(0, 0, 0, 0);

const AppointmentSchema = Yup.object().shape({
  appointment_type: Yup.string().required('Required'),
  patient: Yup.string().required('Required'),
  time_slot: Yup.string().required('Required'),
  appointment_date: Yup.date()
    .required('Required')
    .nullable()
    .min(today, 'Appointment cannot be in the past'),

  reason_for_appointment: Yup.string().required('Required'),
});

/**
 * AppointmentModal provides a form within a modal for scheduling new appointments.
 * It allows selection of patient, appointment type, date, time slot, and reason for the appointment.
 * The component integrates with Redux to fetch necessary data (patients, appointment types, time slots) and to dispatch the appointment creation action.
 * It uses Formik for form handling and Yup for form validation, ensuring that all required fields are filled out correctly before submission.
 *
 * Features:
 * - Dynamic fetching of patients and appointment types on component mount.
 * - Conditional rendering of time slots based on the selected date.
 * - Real-time form validation using Yup.
 * - Submission of the form results in creating an appointment in the backend.
 */

const AppointmentModal = ({ showModal, handleClose }) => {
  const doctorId = localStorage.getItem('doctor_id');
  const dispatch = useDispatch();
  const patients = useSelector((state) => state.DoctorPatientSlice.data);
  const appointmentTypes = useSelector((state) => state.AppointmentTypesSlice.data);
  const slots = useSelector((state) => state.DoctorTimeSlotsSlice.data);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(FetchDoctorPatient());
    dispatch(FetchAppointmentTypes());
    dispatch(fetchTimeSlots(doctorId));
  }, [dispatch]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchSlots = () => {
    const data = {
      id: doctorId,
      date: selectedDate.toLocaleDateString('en-CA'),
    };
    dispatch(fetchDoctorTimeSlots(data));
  };
  const HandleSubmit = (values) => {
    const doctor = localStorage.getItem('doctor_id');
    const { appointment_date, appointment_type, patient, reason_for_appointment, time_slot } =
      values;
    const body = {
      doctor,
      appointment_type,
      appointment_date,
      patient,
      reason_for_appointment,
      time_slot,
    };
    dispatch(CreatePatientAppointment(body));
  };

  const formik = useFormik({
    initialValues: {
      patient: '',
      appointment_type: '',
      appointment_date: '',
      reason_for_appointment: '',
      time_slot: '',
    },
    validationSchema: AppointmentSchema,
    onSubmit: HandleSubmit,
  });

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
    formik.setFieldValue('appointment_date', event.target.value);
  };


  return (
    <Modal centered show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
      </Modal.Header>

      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <div className='form-group'>
            <label htmlFor='patient'> Patient Selection </label>

            <select
              name='patient'
              className={`form-control ${formik.errors.patient && formik.touched.patient ? 'is-invalid' : ''}`}
              onChange={(e) => {
                formik.setFieldValue('patient', e.target.value, true);
              }}
            >
              <option value=''>Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
            <div className='invalid-feedback'>
              {formik.errors.patient && formik.touched.patient && formik.errors.patient}
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='appointment_type'>Appointment Type</label>
            <select
              onChange={formik.handleChange}
              name='appointment_type'
              className={`form-control ${formik.errors.appointment_type && formik.touched.appointment_type
                  ? 'is-invalid'
                  : ''
                }`}
            >
              <option value=''>Select appointment type</option>
              {appointmentTypes.map((type) => (
                <option key={type.key} value={type.value}>
                  {type.key}
                </option>
              ))}
            </select>
            <div className='invalid-feedback'>
              {formik.errors.appointment_type &&
                formik.touched.appointment_type &&
                formik.errors.appointment_type}
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='appointment_date'>Date</label>
            <input
              type='date'
              name='appointment_date'
              onChange={handleDateChange}
              className={`form-control ${formik.errors.appointment_date && formik.touched.appointment_date
                  ? 'is-invalid'
                  : ''
                }`}
            />
            <div className='invalid-feedback'>
              {formik.errors.appointment_date &&
                formik.touched.appointment_date &&
                formik.errors.appointment_date}
            </div>
          </div>

          <div className='form-group'>
            {slots.length !== undefined ? (
              <>
                <label htmlFor='end_time'>Time Slot</label>
                <button
                  onClick={() => fetchSlots()}
                  type='button'
                  className='btn btn-xd btn-icon btn-icon-success'
                >
                  <i className='fas fa-redo icon-sm m-0 p-0'></i>
                </button>
                <select
                  onChange={formik.handleChange}
                  name='time_slot'
                  className={`form-control ${formik.errors.time_slot && formik.touched.time_slot ? 'is-invalid' : ''
                    }`}
                >
                  <option value=''>Select time slot</option>
                  {slots.length !== 0 ? (
                    slots.map((subItem) => (
                      <option key={`${subItem.id}`} value={subItem.id}>
                        {subItem.start_time} {subItem.end_time}
                      </option>
                    ))
                  ) : (
                    <option disabled>No slots available</option>
                  )}
                </select>
              </>
            ) : (
              <span className='text-danger'>{slots.message}</span>
            )}

            <div className='invalid-feedback'>
              {formik.errors.time_slot && formik.touched.time_slot && formik.errors.time_slot}
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='reason_for_appointment'>Reason for Appointment</label>
            <input
              onChange={formik.handleChange}
              name='reason_for_appointment'
              className={`form-control ${formik.errors.reason_for_appointment && formik.touched.reason_for_appointment
                  ? 'is-invalid'
                  : ''
                }`}
            />
            <div className='invalid-feedback'>
              {formik.errors.reason_for_appointment &&
                formik.touched.reason_for_appointment &&
                formik.errors.reason_for_appointment}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button variant='primary' type='submit'>
            Send
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AppointmentModal;