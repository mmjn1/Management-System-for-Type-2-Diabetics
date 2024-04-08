import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "../../../assets/patientcss/button.css";
import AppointmentModal from '../DoctorCalendar/Modal';
import AvailabilityModal from '../DoctorCalendar/AvailabilityModal';
import DoctorWebSocket from '../../../WebSocketConnection/DoctorWebsocket';
import { useDispatch, useSelector } from 'react-redux';
import { addAppointment, deleteAppointment } from '../../../features/appointments/appointmentsSlice';

const localizer = momentLocalizer(moment);

function DoctorAppointmentsPage(props) {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.appointments.appointments);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  useEffect(() => {
    const doctorId = localStorage.getItem('id');

    if (doctorId) {
      const doctorWebSocket = new DoctorWebSocket(doctorId, handleAppointmentNotification);

      doctorWebSocket.connect();

      return () => {
        doctorWebSocket.disconnect();
      };
    } else {
      console.error('Doctor ID not found in local storage');
    }
  }, [dispatch]);

 const handleAppointmentNotification = (notification) => {
  if (notification.type === 'appointment_notification' && notification.action === 'create') {
    // Handle the creation of a new appointment
    const formattedAppointment = formatAppointmentForCalendar(notification.appointment_data);
    formattedAppointment.then(appointment => {
      if (appointment) {
        dispatch(addAppointment(appointment));
      }
    });
  } else if (notification.type === 'appointment_deleted') {
    // Handle the deletion of an appointment
    dispatch(deleteAppointment(notification.appointment_id));
  }
};

  const formatAppointmentForCalendar = async (appointmentData) => {
    console.log('Appointment Data:', appointmentData); // Debug log
  
    // Check if time_slot is present instead of start_time and end_time
    if (!appointmentData.appointment_date || !appointmentData.time_slot) {
      console.error('Missing date or time_slot information:', appointmentData);
      return null; 
    }
  
    // Fetch the time slot details using the time_slot ID
    let timeSlotDetails;
    try {
      const response = await fetch(`/api/timeslots/${appointmentData.time_slot}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch time slot details, status: ${response.status}`);
      }
      timeSlotDetails = await response.json();
      console.log('Time slot details:', timeSlotDetails);
    } catch (error) {
      console.error('Error fetching time slot details:', error);
      return null;
    }

    const doctorDetails = async () => {
      try {
        const response = await fetch(`/api/doctor/${appointmentData.doctor}/`);
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
  
    // Assuming timeSlotDetails contains start_time and end_time
    const startDateTime = `${appointmentData.appointment_date}T${timeSlotDetails.start_time}`;
    const endDateTime = `${appointmentData.appointment_date}T${timeSlotDetails.end_time}`;
  
    // Attempt to create Date objects
    try {
      const startIsoString = new Date(startDateTime).toISOString();
      const endIsoString = new Date(endDateTime).toISOString();
  
      const title = `${appointmentData.appointment_type} with Dr. ${doctorName} for ${appointmentData.reason_for_appointment}`;
  
      return {
        id: appointmentData.id,
        title: title,
        start: startIsoString,
        end: endIsoString,
      };
    } catch (error) {
      console.error('Error creating Date object:', error);
      return null; // Return null if Date creation fails
    }
  };



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

  return (
    <>
      <div style={{ position: 'relative', height: '700px' }}>
        <BigCalendar
          {...props}
          localizer={localizer}
          events={appointments}
          style={{ height: '100%', width: '195%' }}
        />
        <div style={{ position: 'absolute', bottom: 0, right: 0, marginBottom: '10px', marginRight: '-550px' }}>
          <Button className="scheduleAppointmentButton" onClick={handleAddClick}>
            Schedule New Appointment
          </Button>
          <Button className="updateAvailabilityButton" onClick={handleAvailabilityClick}>
            Manage Availability
          </Button>
        </div>
      </div>
      <AppointmentModal
        showModal={showAppointmentModal}
        handleClose={handleCloseAppointmentModal}
      />
      <AvailabilityModal
        showModal={showAvailabilityModal}
        handleClose={handleCloseAvailabilityModal}
      />
    </>
  );
}

export default DoctorAppointmentsPage;
