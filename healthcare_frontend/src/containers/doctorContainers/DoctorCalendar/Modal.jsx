import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useSubmitAppointmentMutation } from "../../../features/appointments/patientAppointment";

const today = new Date();
today.setHours(0, 0, 0, 0);

const AppointmentSchema = Yup.object().shape({
  doctor: Yup.string().required("Required"),
  appointment_type: Yup.string().required("Required"),
  start_time: Yup.string()
    .required("Required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: Yup.string()
    .required("Required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .test(
      "is-greater",
      "End time must be later than start time",
      function (value) {
        const { start_time } = this.parent;
        return (
          new Date(`1970/01/01 ${value}`) > new Date(`1970/01/01 ${start_time}`)
        );
      }
    ),
  appointment_date: Yup.date()
    .required("Required")
    .nullable()
    .min(today, "Appointment cannot be in the past"),

  reason_for_appointment: Yup.string().required("Required"),
});

const AppointmentModal = ({ showModal, handleClose }) => {
  const [submitInquiry, { isLoading }] = useSubmitAppointmentMutation();
  const [patients, setPatients] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    // Retrieve the token from local storage
    const authToken = localStorage.getItem('token');

    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    const authHeader = `Token ${authToken}`;

    fetch("/api/doctor/patients/", {
      headers: {
        "Authorization": authHeader,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatients(data);
        //console.log('Patients:', data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });

    fetch("/api/doctor-appointment-types/", {
      headers: {
        "Authorization": authHeader,
      },
    })
      .then((response) => response.json())
      .then((data) => setAppointmentTypes(data));

    const slots = generateTimeSlots();
    setTimeSlots(slots);

  }, []);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Appointment</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          patient: "",
          appointment_type: "",
          start_time: "",
          end_time: "",
          appointment_date: "",
          reason_for_appointment: "",
        }}
        validationSchema={AppointmentSchema}
        onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {

          console.log("Form values before submission:", values);
          console.log("Selected doctor:", values.doctor);
          //console.log("Doctors:", doctors); 

          // const doctorIndex = doctors.findIndex(doctor => {
          //   const [title,firstName, lastName] = values.doctor.split(' ');


          //   return doctor.first_name === firstName && doctor.last_name === lastName;
          // });

          // const doctorId = doctorIndex + 1


          const formattedValues = {
            ...values,
            //doctor: doctorId,
            start_time: values.start_time,
            end_time: values.end_time,
          };

          console.log('Submitting:', formattedValues);

          try {
            const result = await submitInquiry(formattedValues).unwrap();
            alert("Your appointment has been successfully scheduled. You will receive a confirmation email shortly!");
            resetForm();
            handleClose();
          } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit appointment. Please try again.");
            if (error.data) {
              setErrors(error.data);
            }
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="doctor"> Patient Selection </label>

                <Field
                  as="select"
                  name="patient"
                  className={`form-control ${errors.doctor && touched.doctor ? "is-invalid" : ""
                    }`}
                  onChange={(e) => {
                    console.log("Raw selected option value:", e.target.value);
                    const value = e.target.selectedIndex;
                    const patientId = (value);
                    console.log("Selected patient ID:", patientId);
                    setFieldValue("patient", e.target.value, true);
                  }}
                >
                  <option value="">Select a patient </option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
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
                    <option key={type.key} value={type.value}>
                      {type.key}
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
                <label htmlFor="start_time">Start Time</label>
                <Field
                  as="select"
                  name="start_time"
                  className={`form-control ${errors.start_time && touched.start_time ? "is-invalid" : ""
                    }`}
                >
                  <option value="">Select start time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_time">End Time</label>
                <Field
                  as="select"
                  name="end_time"
                  className={`form-control ${errors.end_time && touched.end_time ? "is-invalid" : ""
                    }`}
                >
                  <option value="">Select end time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="end_time"
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
                />
                <ErrorMessage
                  name="appointment_date"
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
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Sending...</span>
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AppointmentModal;

// Helper function to format time if needed
function formatTime(time) {
  // Assuming `time` is in the format "HH:MM" or "HH:MM:SS"
  // If your time is in a different format, adjust the logic accordingly
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function generateTimeSlots() {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }
  return slots;
}
