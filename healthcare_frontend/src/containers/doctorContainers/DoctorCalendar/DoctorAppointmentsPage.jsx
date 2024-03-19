import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "../../../assets/patientcss/button.css";
import AppointmentModal from '../DoctorCalendar/Modal';
import AvailabilityModal from '../DoctorCalendar/AvailabilityModal';

const localizer = momentLocalizer(moment);

function DoctorAppointmentsPage(props) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false); // New state for AvailabilityModal visibility

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