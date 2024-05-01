import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form } from 'react-bootstrap';
import {
  CreateFollowupNotes,
  deletePatientAppointment,
  updatePatientAppointment,
} from '../../features/appointments/PatientAppointment';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';

import { fetchTimeSlots } from '../../features/appointments/DoctorAvailabilitySlice';
import { fetchDoctorTimeSlots } from '../../features/appointments/doctor_slots';
import { fetchDoctor } from '../../features/doctor/FetchDoctor';

const today = new Date();
today.setHours(0, 0, 0, 0);

const AppointmentSchema = Yup.object().shape({
  time_slot: Yup.string().required('Required'),
  appointment_date: Yup.date()
    .required('Required')
    .nullable()
    .min(today, 'Appointment cannot be in the past'),
});

/**
 * CustomAgenda manages the display and interaction logic for a specific appointment event.
 * It provides functionalities such as viewing appointment details, adding follow-up notes, rescheduling, and deleting appointments.
 * 
 * Props:
 * - event: An object containing details about the appointment such as title, dates, type, and patient information.
 * 
 * State:
 * - show, showDelete, showFollowup, showReschedule: Booleans to control the visibility of various modals.
 * - selectedDate, selectedDoctor: States to hold the currently selected date and doctor for rescheduling.
 * - slots: Holds available time slots fetched based on the selected date and doctor.
 * 
 * The component uses Redux for state management to dispatch actions such as fetching time slots, deleting, and updating appointments.
 * It also uses Formik for form handling and Yup for validation to ensure required fields are filled out correctly.
 * 
 * The component renders buttons to trigger different modals (details, delete, follow-up, reschedule) and forms within these modals
 * to submit new data. It dynamically fetches and displays available time slots for rescheduling based on the selected doctor and date.
 */

const CustomAgenda = ({ event }) => {
  const doctorId = localStorage.getItem('doctor_id');
  const patient_id = localStorage.getItem('patient_id');

  const slots = useSelector((state) => state.DoctorTimeSlotsSlice.data);

  const validationSchema = Yup.object().shape({
    FollowupNote: Yup.string().required('Follow-up note is required'),
  });
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showFollowup, setFollowup] = useState(false);
  const [showReschedule, setReschedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const doctors = useSelector((state) => state.DoctorSlice.data);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (event.type !== 'patient') {
      dispatch(fetchTimeSlots(doctorId));
    } else {
      dispatch(fetchDoctor());
    }
  }, [dispatch]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = () => setShowDelete(true);

  const handleDelete = () => {
    dispatch(deletePatientAppointment(event.id));
    handleDeleteClose();
  };

  const handleSubmitNotes = (values) => {
    const Appointment = event.id;
    const FollowupNote = values.FollowupNote;
    const body = { Appointment, FollowupNote };
    dispatch(CreateFollowupNotes(body));
    setFollowup(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
    formik.setFieldValue('appointment_date', event.target.value);
  };

  const HandleSubmit = (values) => {
    const body = {
      id: event.id,
      data: values,
    };
    dispatch(updatePatientAppointment(body));
    // setReschedule(false);
  };

  const formik = useFormik({
    initialValues: {
      appointment_date: '',
      time_slot: '',
    },
    validationSchema: AppointmentSchema,
    onSubmit: HandleSubmit,
  });

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchSlots = () => {
    const data = {
      id: event.type === 'patient' ? selectedDoctor : doctorId,
      date: selectedDate.toLocaleDateString('en-CA'),
    };
    dispatch(fetchDoctorTimeSlots(data));
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    formik.setFieldValue('doctor', event.target.value);
  };

  useEffect(() => {
    if (selectedDate && patient_id !== null) {
      fetchSlots();
    }
  }, [selectedDate, selectedDoctor]);

  return (
    <span>
      <em style={{ color: 'blue' }}>{event.title}</em> <br />
      <a
        target='_blank'
        className='btn btn-outline-primary btn-sm m-0'
        href={event.meeting_link?.start_url}
      >
        Join meeting
      </a>
      <button
        className='btn btn-outline-success btn-icon ml-1 btn-sm'
        onClick={handleShow}
        title='View details'
      >
        <i className='fas fa-eye icon-nm '></i>
      </button>
      {event.type === 'patient' ? (
        ''
      ) : (
        <button
          className='btn btn-outline-warning btn-icon ml-1 btn-sm'
          onClick={() => setFollowup(true)}
          title='add followup notes'
        >
          <i className='fas fa-pen icon-nm '></i>
        </button>
      )}
      <button
        className='btn btn-outline-info btn-icon mx-1 btn-sm'
        onClick={() => setReschedule(true)}
        title='Rescheduled'
      >
        <i className='fas fa-history icon-nm '></i>
      </button>
      <button
        className='btn btn-outline-danger btn-icon btn-sm'
        onClick={handleDeleteShow}
        title='delete meeting'
      >
        <i className='fas fa-trash-alt icon-nm '></i>
      </button>
      <Modal centered size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment with {event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px' }}>
          <div className='row'>
            <div className='col-6'>
              <p>
                <strong>Appointment date:</strong> {event.appointment_date}
              </p>
              <p>
                <strong>Start time:</strong> {event.start_date}
              </p>
              <p>
                <strong>End time:</strong> {event.end_date}
              </p>
              <p>
                <strong>Appointment type:</strong> {event.appointment_type}
              </p>
              <p>
                <strong>Reason for appointment:</strong> {event.reason_for_appointment}
              </p>
            </div>
            <div className='col-6'>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Meeting link:</strong>{' '}
                <a href={event.meeting_link?.start_url}>Join Zoom meeting</a>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px' }}>
          Are you sure to delete this appointment? This action cannot be undone and will remove the appointment from the calendar.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant='danger' onClick={handleDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered size='lg' show={showFollowup} onHide={() => setFollowup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add followup notes for {event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px' }}>
          <div className='row'>
            <div className='col-6'>
              <p>
                <strong>Appointment #:</strong> {event.id}
              </p>
            </div>
            <div className='col-6'>
              <p>
                <strong>Appointment date:</strong> {event.appointment_date}
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Formik
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmitNotes(values)}
                initialValues={{
                  FollowupNote: '',
                }}
              >
                {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
                  <Form className='form' noValidate onSubmit={handleSubmit}>
                    <div className='form-group'>
                      <Form.Control
                        as='textarea'
                        name='FollowupNote'
                        className='form-control'
                        placeholder='Enter your follow-up notes'
                        value={values.FollowupNote}
                        onChange={handleChange}
                        isInvalid={!!errors.FollowupNote}
                        required
                        rows='3'
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.FollowupNote}
                      </Form.Control.Feedback>
                    </div>

                    <Modal.Footer>
                      <Button variant='outline-secondary' onClick={() => setFollowup(false)}>
                        Close
                      </Button>
                      <Button variant='outline-success' type='submit'>
                        Save
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal centered size='lg' show={showReschedule} onHide={() => setReschedule(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rescheduled meeting for {event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px' }}>
          <div className='row'>
            <div className='col-6'>
              <p>
                <strong>Appointment #:</strong> {event.id}
              </p>
            </div>
            <div className='col-6'>
              <p>
                <strong>Appointment date:</strong> {event.appointment_date}
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              {event.type !== 'patient' ? (
                ''
              ) : (
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
                        {item.first_name} {item.last_name}
                      </option>
                    ))}
                  </select>
                  <div className='invalid-feedback'>
                    {formik.errors.doctor && formik.touched.doctor && formik.errors.doctor}
                  </div>
                </div>
              )}

              <form className='form' noValidate onSubmit={formik.handleSubmit}>
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
                        className={`form-control ${formik.errors.time_slot && formik.touched.time_slot ? 'is-invalid' : ''}`}
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

                <Modal.Footer>
                  <Button variant='outline-secondary' onClick={() => setReschedule(false)}>
                    Close
                  </Button>
                  <Button variant='outline-success' type='submit'>
                    Update time
                  </Button>
                </Modal.Footer>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </span>
  );
};

CustomAgenda.propTypes = {
  event: PropTypes.object,
};
export default CustomAgenda;