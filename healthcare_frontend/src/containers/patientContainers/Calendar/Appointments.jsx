import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { addAppointment, updateAppointment, deleteAppointment } from '../../../features/appointments/appointmentsSlice';
import "../../../assets/patientcss/button.css";
import AppointmentModal from './AppointmentModal';

const localizer = momentLocalizer(moment);


const formatAppointmentForCalendar = async (appointment) => {
  console.log('Formatting appointment:', appointment);
  if (!appointment || !appointment.time_slot) {
    console.error('Appointment or time_slot is undefined:', appointment);
    return null;
  }

  let timeSlotDetails = null;
  try {
    const response = await fetch(`/api/timeslots/${appointment.time_slot}/`);
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`Failed to fetch time slot details, status: ${response.status}`);
    }
    timeSlotDetails = await response.json();
    console.log('Time slot details:', timeSlotDetails);
  } catch (error) {
    console.error('Error fetching time slot details:', error);
    return null;
  }


  if (!appointment || !timeSlotDetails.start_time || !timeSlotDetails.end_time || !timeSlotDetails.location) {
    console.error('Appointment data is missing or incomplete:', appointment);
    return null;
  }

  const startTime = moment(timeSlotDetails.start_time, "HH:mm");
  const endTime = moment(timeSlotDetails.end_time, "HH:mm");

  if (!startTime.isValid() || !endTime.isValid()) {
    console.error('Invalid start or end time:', appointment);
    return null;
  }

  const doctorDetails = async () => {
    try {
      const response = await fetch(`/api/doctor/${appointment.doctor}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      const data = await response.json();
      return `${data.first_name} ${data.last_name}`;
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      return 'Doctor details not available';
    }
  };

  const doctorName = await doctorDetails();

  const title = `${appointment.appointment_type} with Dr. ${doctorName}\n${startTime.format("hh:mm A")}-${endTime.format("hh:mm A")} at ${timeSlotDetails.location}`;
  
  // Convert start and end times to ISO strings
  const startIsoString = new Date(appointment.appointment_date + 'T' + timeSlotDetails.start_time).toISOString();
  const endIsoString = new Date(appointment.appointment_date + 'T' + timeSlotDetails.end_time).toISOString();

  return {
    id: appointment.id,
    title: title,
    start: startIsoString,
    end: endIsoString,
    reason_for_appointment: appointment.reason_for_appointment,
  };
};

const Appointments = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);


  const handleSelectEvent = (appointment) => {
    setSelectedAppointment({
      ...appointment,
      id: appointment.id,
    });
    setShowModal(true);
  };


  const handleUpdateAppointment = async (updatedAppointment) => {
    const formattedAppointment = await formatAppointmentForCalendar(updatedAppointment);
    if (formattedAppointment) {
      dispatch(updateAppointment(formattedAppointment));
      alert("Appointment updated successfully");
      setShowModal(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    dispatch(deleteAppointment(appointmentId)); 
    setShowModal(false);
  };

  const handleAppointmentCreated = async (newAppointment) => {
    if (newAppointment) {
      dispatch(addAppointment(newAppointment));
    }
  };

  const handleAddClick = () => {
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };


  return (
    <>
      <div style={{ position: 'relative', height: '700px' }}>
        <BigCalendar
          {...props}
          localizer={localizer}
          events={appointments}
          style={{ height: '100%', width: '195%' }}
          onSelectEvent={handleSelectEvent}
        />
        <div style={{ position: 'absolute', bottom: 0, right: 0, marginBottom: '10px', marginRight: '-550px' }}>
          <Button className="scheduleAppointmentButton" onClick={handleAddClick}>
            Schedule New Appointment
          </Button>
        </div>
      </div>
      <AppointmentModal
        showModal={showModal}
        handleClose={handleCloseModal}
        onAppointmentCreated={handleAppointmentCreated}
        onAppointmentUpdated={handleUpdateAppointment}
        onDeleteAppointment={handleDeleteAppointment}
        selectedAppointment={selectedAppointment}
        events={appointments}
        formatAppointmentForCalendar={formatAppointmentForCalendar}

      />
    </>
  );
};

export default Appointments;
