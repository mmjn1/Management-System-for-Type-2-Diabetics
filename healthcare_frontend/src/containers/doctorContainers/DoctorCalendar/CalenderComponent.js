import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

/**
 * CustomEvent displays a clickable event title that, when clicked,
 * opens a modal showing detailed information about a medical appointment.
 * The modal includes details such as appointment date, start and end times, type, reason,
 * location, and patient contact information. It also provides a link to a Zoom meeting if available.
 *
 * Props:
 * - event (object): Contains details about the appointment such as title, dates, type, reason,
 *   location, patient information, and meeting link.
 *
 * Features:
 * - Clickable event title that toggles the visibility of the modal.
 * - Modal displays comprehensive details about the appointment.
 * - Uses React Bootstrap components for UI elements.
 */

const CustomEvent = ({ event }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div onClick={handleShow}>{event.title}</div>

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
                <strong>Meeting link:</strong> <a href={event.meeting_link?.start_url}>Join Zoom meeting</a>
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
    </div>
  );
};

CustomEvent.propTypes = {
  event: PropTypes.object,
};
export default CustomEvent;