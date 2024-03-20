import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import moment from 'moment';
import { useSubmitAppointmentMutation } from "../../../features/appointments/patientAppointment";
import { useGetDoctorAvailabilityQuery } from '../../../features/appointments/doctorAvailabilitySlice';
import '../../../assets/patientcss/modal.css';
import { availabilityWebSocketService } from "../../../WebSocketConnection/AvailabilityWebSocketService";


const today = new Date();
today.setHours(0, 0, 0, 0);

const AppointmentSchema = Yup.object().shape({
  doctor: Yup.string().required("Required"),
  appointment_date: Yup.date()
    .required("Required")
    .nullable()
    .min(today, "Appointment cannot be in the past"),
  reason_for_appointment: Yup.string().required("Required"),
  appointment_type: Yup.string().required("Required"),
  timeSlot: Yup.string().required("Required"),
});

const AppointmentModal = ({ showModal, handleClose, onAppointmentCreated, onAppointmentUpdated, onDeleteAppointment, selectedAppointment, formatAppointmentForCalendar }) => {
  const token = localStorage.getItem('token');
  const [submitAppointment, { isLoading, isSuccess }] = useSubmitAppointmentMutation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const { data: availableTimeSlots, isFetching } = useGetDoctorAvailabilityQuery({ doctorId: selectedDoctorId, date: selectedDate }, {
    skip: !selectedDoctorId || !selectedDate, // Skip the query if no doctor or date is selected
  });



  const isEditing = selectedAppointment !== null;

  const handleModalClose = () => {
    // Reset the selected time slot when closing the modal
    setSelectedTimeSlot(null);
    // Reset the selected doctor ID and date to clear time slots
    setSelectedDoctorId('');
    setSelectedDate(null);
    // Call the handleClose prop to actually close the modal
    handleClose();
  };

  useEffect(() => {
    fetch("/api/api/doctors/")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
      });

    fetch("/api/patient-appointment-types/")
      .then((response) => response.json())
      .then((data) => setAppointmentTypes(data));

    if (showModal && selectedDoctorId) {
      const handleMessage = (data) => {
        // Your handling code here
      };

      availabilityWebSocketService.connectToDoctorAvailabilityUpdates(selectedDoctorId, handleMessage);
    }

    return () => {
      availabilityWebSocketService.disconnectFromDoctorAvailabilityUpdates();
    };
  }, [showModal, selectedDoctorId]);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const formInitialValues = isEditing && selectedAppointment ? {

    appointment_type: selectedAppointment.title.split(' with ')[0] || "",
    // Extract the doctor's name from the title and find the corresponding doctor ID
    doctor: (() => {
      const doctorName = selectedAppointment.title.split(' with ')[1]?.split('\n')[0];
      if (doctorName) {
        const doctorWithoutPrefix = doctorName.replace('Dr. ', '').trim();
        const matchingDoctor = doctors.find(doctor =>
          `${doctor.first_name} ${doctor.last_name}` === doctorWithoutPrefix
        );
        return matchingDoctor ? matchingDoctor.id : '';
      }
      return '';
    })(), appointment_date: moment(selectedAppointment.start).format('YYYY-MM-DD'),
    reason_for_appointment: selectedAppointment.reason_for_appointment,
    appointment_id: selectedAppointment.id,
    timeSlot: selectedAppointment.timeSlot?.id || "",

  } : {
    doctor: "",
    appointment_type: "",
    appointment_date: "",
    reason_for_appointment: "",
    timeSlot: "",
  };

  console.log('Form initial values:', selectedAppointment)

  const handleDelete = async () => {

    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(`/api/appointments/${selectedAppointment.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          // Successfully deleted appointment
          alert('Appointment deleted successfully.');
          onDeleteAppointment(selectedAppointment.id); // Call the callback function passed from parent to update the list
          handleClose();
        } else {
          throw new Error('Failed to delete the appointment.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete the appointment.');
      }
    }
  };


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('Form values:', values);
    const timeSlotObject = availableTimeSlots.find(slot => slot.id === values.timeSlot); // Assuming timeSlot is an id

    // if (!timeSlotObject) {
    //   console.error('No matching time slot found');
    //   setSubmitting(false);
    //   return; // Stop execution if no matching slot is found
    // }



    // Adjust data to fit your backend's expectations
    const submissionData = {
      doctor: values.doctor,
      appointment_date: values.appointment_date,
      reason_for_appointment: values.reason_for_appointment,
      appointment_type: values.appointment_type,
      time_slot: values.timeSlot, // Ensure this is correctly mapping to your form's timeSlot value
    };
    console.log('Form values:', values);

    console.log('Submitting appointment:', submissionData);

    try {
      const response = await submitAppointment(submissionData).unwrap();
      console.log('Submitted appointment to the doctor:', response);
      const newAppointment = await formatAppointmentForCalendar(response);
      onAppointmentCreated(newAppointment); // Pass the new appointment data to the parent component
      alert("Appointment submitted successfully.");
      handleClose();
    } catch (error) {
      console.error("Failed to submit appointment:", error);
      alert("Failed to submit the appointment.");
    } finally {
      setSubmitting(false);
      resetForm();
    }



    // try {
    //   await submitAppointment(submissionData).unwrap(); // If RTK Query is used
    //   alert('Appointment submitted successfully.');
    //   onAppointmentCreated && onAppointmentCreated();
    //   resetForm();
    // } catch (error) {
    //   console.error('Failed to submit appointment:', error);
    //   alert('Failed to submit the appointment.');
    // } finally {
    //   setSubmitting(false); // End submitting process
    //   handleClose(); // Close the modal
    // }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Appointment" : "New Appointment"}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={formInitialValues}
        // validationSchema={AppointmentSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >

        {({ isSubmitting, errors, touched, setFieldValue, handleSubmit }) => (
          <Form>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="doctor">Doctor</label>

                <Field
                  as="select"
                  name="doctor"
                  className={`form-control ${errors.doctor && touched.doctor ? "is-invalid" : ""
                    }`}

                  onChange={(e) => {

                    console.log("Raw selected option value:", e.target.value);
                    ;
                    const value = e.target.selectedIndex;
                    const doctorId = (value);
                    console.log("Selected doctor ID:", doctorId);
                    setSelectedDoctorId(e.target.value);
                    setFieldValue("doctor", e.target.value, true);
                  }}
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </option>

                  ))}
                </Field>
                <ErrorMessage
                  name="doctor"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment_date">Date</label>
                <Field
                  type="date"
                  name="appointment_date"
                  className={`form-control ${errors.appointment_date && touched.appointment_date
                    ? "is-invalid"
                    : ""
                    }`}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setFieldValue("appointment_date", e.target.value, true);
                  }}
                />
                <ErrorMessage
                  name="appointment_date"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              {selectedDoctorId && selectedDate && availableTimeSlots && availableTimeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  className={`m-1 ${selectedTimeSlot === slot.id ? 'selected-time-slot' : ''}`}
                  onClick={() => {
                    setFieldValue("timeSlot", (slot.id)); // Ensuring the ID is set as a string
                    console.log("Selected time slot:", slot);
                    setSelectedTimeSlot(slot.id); // This updates the local state, which might be used for UI purposes
                  }}
                >
                  {`${moment(slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(slot.end_time, 'HH:mm:ss').format('HH:mm')} at ${slot.location}`}
                </Button>
              ))}


              <div className="form-group">
                <label htmlFor="appointment_type">Appointment Type</label>
                <Field
                  as="select"
                  name="appointment_type"
                  className={`form-control ${errors.appointment_type && touched.appointment_type
                    ? "is-invalid"
                    : ""
                    }`}
                >
                  <option value="">Select appointment type</option>
                  {appointmentTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.value}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="appointment_type"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason_for_appointment">
                  Reason for Appointment
                </label>
                <Field
                  as="textarea"
                  name="reason_for_appointment"
                  className={`form-control ${errors.reason_for_appointment &&
                    touched.reason_for_appointment
                    ? "is-invalid"
                    : ""
                    }`}
                />
                <ErrorMessage
                  name="reason_for_appointment"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              {showSuccessMessage && (
                <div className="alert alert-success" role="alert">
                  Appointment submitted successfully!
                </div>
              )}

            </Modal.Body>
            <Modal.Footer>


              <div className="d-flex justify-content-between w-100">
                {isEditing && (
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isSubmitting || isLoading}>
                    Cancel Appointment
                  </Button>
                )}
                <div>
                  <Button
                    variant="secondary"
                    onClick={handleModalClose}
                    disabled={isSubmitting || isLoading}
                    className="mr-2"
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || isLoading}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Modal.Footer>

          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AppointmentModal;
