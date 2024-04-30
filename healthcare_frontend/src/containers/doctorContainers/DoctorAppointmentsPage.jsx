import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useState, Fragment, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AppointmentModal from './DoctorCalendar/Modal';
import AvailabilityModal from './DoctorCalendar/AvailabilityModal';
import events from './events';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientAppointment } from '../../features/appointments/PatientAppointment';
import CustomEvent from './CalenderComponent';
import CustomAgenda from './CustomAgenda';

const localizes = momentLocalizer(moment);

/**
 * DoctorAppointmentsPage component renders a calendar interface for doctors to view and manage their appointments.
 * It uses react-big-calendar for displaying appointments.
 * The component fetches appointment data from a Redux store, allows scheduling new appointments, and managing availability through modals.
 *
 * Features:
 * - Displays appointments on a calendar with custom components for events and agenda.
 * - Provides modals for scheduling new appointments and managing availability.
 * - Fetches and updates appointments data from a backend server using Redux actions.
 * - Uses moment.js for date handling with a localizer for the calendar.
 */

const DoctorAppointmentsPage = () => {
  const dispatch = useDispatch();
  const [myEvents, setEvents] = useState(events);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const doctor_id = localStorage.getItem('doctor_id');
  const appointments = useSelector((state) => state.PatientAppointmentSlice);

  const handleAddClick = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };

  const handleAvailabilityClick = () => {
    setShowAvailabilityModal(true);
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
  };
  useEffect(() => {
    dispatch(fetchPatientAppointment(doctor_id));
  }, [dispatch]);

  useEffect(() => {
    if (appointments.data !== null) {
      const events = appointments.data.map((appointment) => ({
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        reason_for_appointment: appointment.reason_for_appointment,
        meeting_link: appointment.meeting_link,
        appointment_type: appointment.appointment_type,
        title: appointment.patient.user.first_name + ' ' + appointment.patient.user.last_name,
        patient_id: appointment.patient.id,
        patient_gender: appointment.patient.gender,
        patient_phone_number: appointment.patient.Mobile,
        patient_email: appointment.patient.Email,
        location: appointment.time_slot.location.name,
        start_date: appointment.time_slot.start_time,
        end_date: appointment.time_slot.end_time,
        start: new Date(appointment.appointment_date + 'T' + appointment.time_slot.start_time),
        end: new Date(appointment.appointment_date + 'T' + appointment.time_slot.end_time),
      }));
      setEvents(events);
    }
  }, [appointments.data]);

  return (
    <Fragment>
      <div className='content d-flex flex-column flex-column-fluid'>
        <div className='d-flex flex-column-fluid'>
          <div className='container'>
            <div className='d-flex flex-row'>
              <div className='flex-grow-1 ms-md-3' id='kt_chat_content'>
                <div className='card card-custom'>
                  <div className='card-header align-items-center px-4 py-3'>
                    <div className='text-left flex-grow-1'></div>
                    <div className='text-center flex-grow-1'>
                      <div className='text-dark-75 font-weight-bold font-size-h5 text-capitalize'>
                        Schedule appointment
                      </div>
                      <div></div>
                    </div>
                    <div className='text-right flex-grow-1'></div>
                  </div>

                  <div className='card-body'>
                    <div className='scroll scroll-pull scroll custom-scroll'>
                      <div style={{ position: 'relative', height: '700px' }}>
                        <Calendar
                          localizer={localizes}
                          events={myEvents}
                          startAccessor='start'
                          endAccessor='end'
                          style={{ height: 500 }}
                          components={{
                            event: CustomEvent,
                            agenda: {
                              event: CustomAgenda,
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='card-footer'>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button className='scheduleAppointmentButton' onClick={handleAddClick}>
                        Schedule New Appointment
                      </Button>
                      <Button
                        className='updateAvailabilityButton'
                        onClick={handleAvailabilityClick}
                      >
                        Manage Availability
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAppointmentModal ? (
        <AppointmentModal
          showModal={showAppointmentModal}
          handleClose={handleCloseAppointmentModal}
        />
      ) : (
        ''
      )}
      {showAvailabilityModal ? (
        <AvailabilityModal
          showModal={showAvailabilityModal}
          handleClose={handleCloseAvailabilityModal}
        />
      ) : (
        ''
      )}
    </Fragment>
  );
};

export default DoctorAppointmentsPage;