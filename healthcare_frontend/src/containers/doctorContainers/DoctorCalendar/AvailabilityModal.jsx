import React, { useState, useEffect } from "react";
import { Modal, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Formik, FieldArray, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BsPlus, BsFillTrashFill } from 'react-icons/bs';
import moment from "moment";
import { useUpdateAvailabilityMutation, useCreateAvailabilityMutation } from '../../../features/availabilitySlice';

const daysOfWeek = [
  { name: 'Monday', value: 'Monday' },
  { name: 'Tuesday', value: 'Tuesday' },
  { name: 'Wednesday', value: 'Wednesday' },
  { name: 'Thursday', value: 'Thursday' },
  { name: 'Friday', value: 'Friday' },
  { name: 'Saturday', value: 'Saturday' },
  { name: 'Sunday', value: 'Sunday' },
];

const timeSlots = Array.from({ length: 35 }, (_, index) => {
  const time = moment({ hour: 8 }).add(15 * index, 'minutes');
  return time.format('HH:mm');
});

const AvailabilitySchema = Yup.object().shape({
  days: Yup.array().of(
    Yup.object().shape({
      day: Yup.string().required("Day is required"),
      selected: Yup.boolean(),
      slots: Yup.array().of(
        Yup.object().shape({
          start_time: Yup.string().required("Start time is required"),
          end_time: Yup.string().test(
            'is-greater',
            'End time must be later than start time',
            function (value) {
              const { start_time } = this.parent;
              return moment(value, 'HH:mm').isAfter(moment(start_time, 'HH:mm'));
            }
          ).required("End time is required"),
          location: Yup.string().required("Location is required"),
        }).required('At least one time slot is required')
      ).test(
        'slots-check',
        'At least one time slot must be added',
        slots => slots.some(slot => slot.start_time && slot.end_time)
      ),
    })
  ),
});

const AvailabilityModal = ({ showModal, handleClose }) => {
  const doctorId = localStorage.getItem('id'); // Retrieve the doctor's ID from local storage
  const [availability, setAvailability] = useState([]);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [updateAvailability, { isLoading }] = useUpdateAvailabilityMutation();
  const [createAvailability] = useCreateAvailabilityMutation();
  const [locations, setLocations] = useState([]);
  const [existingAvailability, setExistingAvailability] = useState([]);

  useEffect(() => {
    // Function to fetch locations
    const fetchLocations = async () => {
      const response = await fetch('/api/locations/');
      const data = await response.json();
      setLocations(Object.entries(data));
    };

    const fetchAndSetExistingAvailability = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/fetch-availability/?doctor_id=${doctorId}`, {
          method: 'GET',
          headers: { 'Authorization': `Token ${token}` }
        });

        if (response.ok) {
          const fetchedData = await response.json();
          const daysWithAvailability = fetchedData.map(item => item.day_of_week);

          // Combine updates into a single state update to avoid batching issues
          const updatedStates = fetchedData.reduce((acc, currentDay) => {
            const dayIndex = daysOfWeek.findIndex(day => day.value === currentDay.day_of_week);
            if (dayIndex !== -1) {
              acc.updatedAvailability.push(currentDay.day_of_week);
              acc.updatedInitialValues[dayIndex] = {
                day: currentDay.day_of_week,
                selected: true,
                slots: currentDay.time_slots.map(slot => ({
                  start_time: moment(slot.start_time, 'HH:mm:ss').format('HH:mm'),
                  end_time: moment(slot.end_time, 'HH:mm:ss').format('HH:mm'),
                  location: slot.location,
                })),
              };
            }
            return acc;
          }, { updatedAvailability: [], updatedInitialValues: daysOfWeek.map(day => ({ day: day.value, selected: false, slots: [{ start_time: '', end_time: '', location: '' }] })) });

          // Apply combined state updates
          setExistingAvailability(fetchedData);
          setAvailability(updatedStates.updatedAvailability);
          setInitialFormValues({ days: updatedStates.updatedInitialValues });
        } else {
          console.error('Failed to fetch existing availability:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching existing availability:', error);
      }
    };

    if (showModal) {
      fetchLocations();
      fetchAndSetExistingAvailability();
    }
  }, [showModal, doctorId]);


  const handleDayChange = (day, setFieldValue, values) => {
    const dayIndex = daysOfWeek.findIndex(d => d.value === day);
    const isSelected = availability.includes(day);

    if (isSelected) {
      setAvailability(availability.filter(d => d !== day));
      // Reset the slots for the unchecked day
      setFieldValue(`days[${dayIndex}].slots`, [{ start_time: '', end_time: '', location: '' }]);
    } else {
      setAvailability([...availability, day]);
      // Ensures that the first slot does not have a rubbish bin when a day is checked for the first time
      setFieldValue(`days[${dayIndex}].slots`, [{ start_time: '', end_time: '', location: '' }]);
    }
    setFieldValue(`days[${dayIndex}].selected`, !isSelected);
  };

  const [initialFormValues, setInitialFormValues] = useState({
    days: daysOfWeek.map(day => ({
      day: day.value,
      selected: false,
      slots: [{ start_time: '', end_time: '', location: '' }],
    })),
  });

  //console.log("Initial form values for the form:", initialFormValues);


  const findTimeIndex = (time) => timeSlots.findIndex(t => t === time);

  // Convert time to the expected format by the backend
  const formatTimeForBackend = (time) => moment(time, 'H:mm').format('HH:mm:ss');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting availability data:", values);
    setSubmissionError(''); // Clear any previous error messages

    // Ensure that the availability state includes all the days that have been selected
    setAvailability(values.days.filter(day => day.selected).map(day => day.day));

    // Structure the data for submission
    const availabilityData = values.days
    .filter(day => day.selected)
    .map(day => {
      const existingDayData = existingAvailability.find(avail => avail.day_of_week === day.day);
      return {
        id: existingDayData ? existingDayData.id : undefined,
        doctor: doctorId,
        day_of_week: day.day,
        is_working: day.selected,
        time_slots: day.slots.map(slot => {
          // Include the ID for existing slots, if available
          const existingSlot = existingDayData ? existingDayData.time_slots.find(ts => 
            moment(ts.start_time, 'HH:mm:ss').format('HH:mm') === slot.start_time &&
            moment(ts.end_time, 'HH:mm:ss').format('HH:mm') === slot.end_time &&
            ts.location === slot.location
          ) : undefined;

          return {
            id: existingSlot ? existingSlot.id : undefined, // Include the ID if the slot already exists
            start_time: formatTimeForBackend(slot.start_time),
            end_time: formatTimeForBackend(slot.end_time),
            location: slot.location,
          };
        }),
      };
    });

      try {
        // Process each availability entry
        for (const day of availabilityData) {
          console.log("Submitting availability data for day:", day);
    
          if (day.id) {
            // If an ID is present, update the existing availability
            await updateAvailability({ id: day.id, ...day }).unwrap();
          } else {
            // If no ID is present, create a new availability
            await createAvailability(day).unwrap();
          }
        }

      setSubmissionSuccess(true);
      setSubmissionError(''); // Clear any submission error
      // Optionally, you can set a timeout to close the modal after a delay
      setTimeout(() => {
        handleClose();
        resetForm();
        setSubmissionSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save availability:', error);
      setSubmissionError('Failed to save availability. Please try again.');
      setSubmissionSuccess(false);
    } finally {
      setSubmitting(false);
    }


  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>My Availability</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialFormValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, resetForm, errors, touched, handleChange, handleSubmit }) => (
          <Form>
            <Modal.Body>
              {submissionSuccess ? (
                <div className="alert alert-success" role="alert">
                  Availability updated successfully!
                </div>
              ) : (
                <>
                  <p style={{ color: '#000', fontSize: '1rem' }}>Here you can specify your availability where you can help organise meetings that work better for yourself and your patients.</p>
                  <div className="mb-3">
                    Please choose which days you are available
                    <div className="d-flex flex-wrap">
                      {daysOfWeek.map((day, index) => (
                        <label className="d-flex align-items-center me-4 mb-2" key={day.value}>
                          <Field
                            type="checkbox"
                            name={`days[${index}].selected`}
                            checked={availability.includes(day.value)}
                            onChange={() => {
                              handleDayChange(day.value, setFieldValue, values)
                            }}
                            className="me-2"
                          />
                          {day.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  {values.days.filter(day => day.selected).map((day, index) => (
                    // Only renders the selected days and their slots
                    <div key={day.day} className="mb-3">
                      <strong>{day.day.toUpperCase()}:</strong>
                      <FieldArray
                        name={`days[${index}].slots`}
                        render={slotHelpers => (
                          day.slots.map((slot, slotIndex) => {
                            // Determine the earliest possible start time for the current slot
                            const previousSlotEndTime = slotIndex > 0 ? day.slots[slotIndex - 1].end_time : null;
                            const earliestStartTimeIndex = previousSlotEndTime ? findTimeIndex(previousSlotEndTime) + 1 : 0;
                            const validStartTimes = timeSlots.slice(earliestStartTimeIndex);

                            // Determine valid end times based on the selected start time for the current slot
                            const selectedStartTimeIndex = findTimeIndex(slot.start_time);
                            const validEndTimes = timeSlots.slice(selectedStartTimeIndex + 1); // +1 ensures end time is after start time

                            return (
                              <div key={slotIndex} className="d-flex align-items-center mb-2">
                                <DropdownButton id={`dropdown-start-time-${index}-${slotIndex}`} title={slot.start_time || "Start Time"} variant="outline-secondary" className="me-2">
                                  {validStartTimes.map((time, timeIndex) => (
                                    <Dropdown.Item key={timeIndex} onClick={() => {

                                      setFieldValue(`days[${index}].slots[${slotIndex}].start_time`, time)
                                    }}>
                                      {time}
                                    </Dropdown.Item>
                                  ))}
                                </DropdownButton>
                                <span className="me-2">to</span>
                                <DropdownButton id={`dropdown-end-time-${index}-${slotIndex}`} title={slot.end_time || "End Time"} variant="outline-secondary" className="ms-2 me-3">
                                  {validEndTimes.map((time, timeIndex) => (
                                    <Dropdown.Item key={timeIndex} onClick={() => setFieldValue(`days[${index}].slots[${slotIndex}].end_time`, time)}>
                                      {time}
                                    </Dropdown.Item>
                                  ))}
                                </DropdownButton>
                                <DropdownButton id={`dropdown-location-${index}-${slotIndex}`} title={slot.location || "Location"} variant="outline-secondary" className="ms-3">
                                  {locations.map(([key, name]) => (
                                    <Dropdown.Item key={key} onClick={() => setFieldValue(`days[${index}].slots[${slotIndex}].location`, name)}>
                                      {name}
                                    </Dropdown.Item>
                                  ))}
                                </DropdownButton>
                                {day.slots.length - 1 === slotIndex && (
                                  <>
                                    <Button variant="primary" onClick={() => slotHelpers.insert(slotIndex + 1, { start_time: '', end_time: '', location: '' })} className="ms-2 p-0">
                                      <BsPlus />
                                    </Button>
                                    {slotIndex > 0 && ( // Only show the rubbish bin if it's not the first slot
                                      <Button variant="outline-danger" onClick={() => slotHelpers.remove(slotIndex)} className="ms-2 p-0">
                                        <BsFillTrashFill />
                                      </Button>
                                    )}
                                  </>
                                )}
                                <ErrorMessage name={`days[${index}].slots[${slotIndex}].start_time`} component="div" className="text-danger" />
                                <ErrorMessage name={`days[${index}].slots[${slotIndex}].end_time`} component="div" className="text-danger" />
                                <ErrorMessage name={`days[${index}].slots[${slotIndex}].location`} component="div" className="text-danger" />
                              </div>
                            );
                          })
                        )}
                      />
                    </div>
                  ))}
                </>
              )}
              {submissionError && (
                <div className="alert alert-danger" role="alert">
                  {submissionError}
                </div>
              )}

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                handleClose(); // Close the modal
                resetForm(); // Reset the form
                setAvailability([]); // Clear the availability state
                setSubmissionError(''); // Clear any submission error
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || isLoading}>
                {isLoading ? 'Saving...' : 'Send Availability'}
              </Button>
              {errors.submit && touched.submit && <div className="text-danger">{errors.submit}</div>}
            </Modal.Footer>

          </Form>

        )}
      </Formik>
    </Modal>
  );
};

export default AvailabilityModal;
