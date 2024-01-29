import React, { useState } from 'react';
import '../sass/modal.scss';

const AddAppointmentModal = ({ isOpen, onRequestClose, selectedDate }) => {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    purpose: '',
    dateOfVisit: selectedDate,
    startTime: '',
    endTime: '',
    doctor: '',
    status: '',
    description: '',
    shareViaEmail: false,
    shareViaSMS: false,
    shareViaWhatsApp: false,
  });

//   if (!isOpen) {
//     return null;
//   }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here.
    // This could involve setting the state of the parent component or making an API call.
    console.log(appointmentData);
    onRequestClose(); // Close the modal after form submission
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="appointmentForm">
        <h2>New Appointment</h2>
        <label>
          Patient Name
          <input
            type="text"
            name="patientName"
            value={appointmentData.patientName}
            onChange={handleChange}
          />
        </label>
        <label>
          Purpose of visit
          <select name="purpose" value={appointmentData.purpose} onChange={handleChange}>
            {/* Add options here */}
          </select>
        </label>
        <label>
          Date of visit
          <input
            type="date"
            name="dateOfVisit"
            value={appointmentData.dateOfVisit}
            onChange={handleChange}
          />
        </label>
        {/* Include other fields similarly */}
        <div>
          <label>
            Share with patient via Email
            <input
              type="checkbox"
              name="shareViaEmail"
              checked={appointmentData.shareViaEmail}
              onChange={handleChange}
            />
          </label>
          <label>
            SMS
            <input
              type="checkbox"
              name="shareViaSMS"
              checked={appointmentData.shareViaSMS}
              onChange={handleChange}
            />
          </label>
          <label>
            WhatsApp
            <input
              type="checkbox"
              name="shareViaWhatsApp"
              checked={appointmentData.shareViaWhatsApp}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="button" onClick={onRequestClose}>Cancel</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddAppointmentModal;
