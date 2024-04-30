import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { useState, Fragment, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import events from '../../doctorContainers/events';
import { fetchAppointmentByPatient } from '../../../features/appointments/patientdataSlice';
import AppointmentModal from './AppointmentModal';
import CustomEvent from '../../doctorContainers/CalenderComponent';
import CustomAgenda from '../../doctorContainers/CustomAgenda';

const localizes = momentLocalizer(moment);

/**
 * `Appointments` renders a calendar view for managing patient appointments.
 * It integrates with Redux for state management to fetch and display appointments from the backend.
 * The component uses `react-big-calendar` with a moment localizer for date handling, providing a rich
 * interactive calendar experience.
 *
 * Features:
 * - Displays appointments on a calendar with custom event and agenda components.
 * - Allows users to schedule new appointments using a modal form.
 * - Dynamically updates the calendar view based on fetched appointment data.
 *
 * State:
 * - myEvents: Holds the events (appointments) to be displayed on the calendar.
 * - showAppointmentModal: Boolean to control the visibility of the appointment scheduling modal.
 *
 * Effects:
 * - Fetches appointments for the logged-in patient on component mount and updates the calendar events.
 * - Listens for changes in the fetched appointments data to update the calendar events accordingly.
 *
 * The component provides functionalities such as viewing detailed appointment information,
 * adding new appointments, and navigating through different views (day, week, month) of the calendar.
 */


const Appointments = () => {
  const dispatch = useDispatch();
  const [myEvents, setEvents] = useState(events);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const patient_id = localStorage.getItem('patient_id');
  const appointments = useSelector((state) => state.AppointmentByPatientSlice);

  const handleAddClick = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
  };


  useEffect(() => {
    dispatch(fetchAppointmentByPatient(patient_id));
  }, [dispatch]);

  useEffect(() => {
    console.log(appointments)
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
        type: 'patient',
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
                            agenda: { event: CustomAgenda },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='card-footer'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button className='scheduleAppointmentButton' onClick={handleAddClick}>
                        Schedule New Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppointmentModal
        showModal={showAppointmentModal}
        handleClose={handleCloseAppointmentModal}
      />
    </Fragment>
  );
};
export default Appointments;