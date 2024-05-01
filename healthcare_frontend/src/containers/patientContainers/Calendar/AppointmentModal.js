import { Button, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FetchAppointmentTypes } from '../../../features/appointments/AppointmentTypes';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor } from '../../../features/doctor/FetchDoctor';
import { fetchDoctorTimeSlots } from '../../../features/appointments/doctor_slots';
import { CreatePatientAppointment } from '../../../features/appointments/PatientAppointment';

const today = new Date();
today.setHours(0, 0, 0, 0);

const AppointmentSchema = Yup.object().shape({
  appointment_type: Yup.string().required('Required'),
  doctor: Yup.string().required('Required'),
  time_slot: Yup.string().required('Required'),
  appointment_date: Yup.date()
    .required('Required')
    .nullable()
    .min(today, 'Appointment cannot be in the past'),
  reason_for_appointment: Yup.string().required('Required'),
});

/**
 * `AppointmentModal`provides a user interface for patients to schedule new appointments.
 * It integrates with Redux for state management and Formik for form handling, including validation using Yup.
 *
 * Features:
 * - Allows users to select a doctor, appointment type, date, and time slot.
 * - Fetches available doctors and appointment types from the backend.
 * - Dynamically loads available time slots based on the selected doctor and date.
 * - Validates user input to ensure all required fields are filled and the appointment date is not in the past.
 * - Submits the appointment details to the backend upon form submission.
 *
 * Props:
 * - showModal: Boolean that controls the visibility of the modal.
 * - handleClose: Function to close the modal.
 *
 * State:
 * - selectedDate: Stores the currently selected date.
 * - selectedDoctor: Stores the currently selected doctor.
 * - slots: Stores available time slots fetched based on the selected doctor and date.
 *
 * The component uses `useEffect` to fetch initial data and to reload available time slots when necessary.
 */


const AppointmentModal = ({ showModal, handleClose }) => {
  const dispatch = useDispatch();
  const appointment_types = useSelector((state) => state.AppointmentTypesSlice.data);
  const doctors = useSelector((state) => state.DoctorSlice.data);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const slots = useSelector((state) => state.DoctorTimeSlotsSlice.data);


  const HandleSubmit = (values) => {
    dispatch(CreatePatientAppointment(values))
    handleClose()
  };


  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(FetchAppointmentTypes());
  }, [dispatch]);
  

  const formik = useFormik({
    initialValues: {
      patient: localStorage.getItem('patient_id'),
      doctor: '',
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

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    formik.setFieldValue('doctor', event.target.value);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const fetchSlots = () => {
    const data = {
      id: selectedDoctor,
      date: selectedDate.toLocaleDateString('en-CA'),
    };
    dispatch(fetchDoctorTimeSlots(data));
  };

  return (
    <Modal centered show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
      </Modal.Header>

      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>

          <div className='form-group'>
            <label htmlFor='doctor'> Doctor Selection </label>
            <select
              name='doctor'
              className={`form-control ${formik.errors.doctor && formik.touched.doctor ? 'is-invalid' : ''}`}
              onChange={handleDoctorChange}
            >
              <option value=''>Select a doctor</option>
              {doctors.map((item) => (
                <option key={item.id} value={item.id}>
                  Dr. {item.first_name} {item.last_name}
                </option>
              ))}
            </select>
            <div className='invalid-feedback'>
              {formik.errors.doctor && formik.touched.doctor && formik.errors.doctor}
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='appointment_type'>Appointment Type</label>
            <select
              name='appointment_type'
              className={`form-control ${formik.errors.appointment_type && formik.touched.appointment_type ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
            >
              <option value=''>select appointment type</option>
              {appointment_types.map((item) => (
                <option key={item.key} value={item.value}>
                  {item.key}
                </option>
              ))}
            </select>
            <div className='invalid-feedback'>
              {formik.errors.appointment_type && formik.touched.appointment_type && formik.errors.v}
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
                <label htmlFor='time_slot'>Time Slot</label>
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
            Book
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
