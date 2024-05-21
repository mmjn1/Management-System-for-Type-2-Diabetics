import React, { useState, useEffect } from 'react';
import { Modal, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Formik, FieldArray, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { BsPlus, BsFillTrashFill } from 'react-icons/bs';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations } from '../../../features/appointments/LocationSlice';
import { fetchTimeSlots } from '../../../features/appointments/DoctorAvailabilitySlice';
import { useUpdateAvailabilityMutation, useCreateAvailabilityMutation, } from '../../../features/appointments/old_availabilitySlice';
import { DoctorAvailability } from '../../../features/appointments/AvailabilitySlice';

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
      day: Yup.string().required('Day is required'),
      selected: Yup.boolean(),
      slots: Yup.array()
        .of(
          Yup.object()
            .shape({
              start_time: Yup.string().required('Start time is required'),
              end_time: Yup.string()
                .test('is-greater', 'End time must be later than start time', function (value) {
                  const { start_time } = this.parent;
                  return moment(value, 'HH:mm').isAfter(moment(start_time, 'HH:mm'));
                })
                .required('End time is required'),
              location: Yup.string().required('Location is required'),
              mode: Yup.string().required('Mode is required'),
            })
            .required('At least one time slot is required'),
        )
        .test('slots-check', 'At least one time slot must be added', (slots) =>
          slots.some((slot) => slot.start_time && slot.end_time),
        ),
    }),
  ),
});

/**
 * AvailabilityModal provides a UI for doctors to manage their availability for appointments.
 * It allows doctors to select days they are available and specify time slots for each selected day.
 * The component uses Formik for form handling and Yup for validation, ensuring that the data entered is correct before submission.
 * It interacts with Redux to fetch necessary data and to dispatch actions that update the doctor's availability in the backend.
 *
 * Features:
 * - Dynamic form fields that allow adding and removing time slots.
 * - Dropdowns for selecting start and end times, and locations for each time slot.
 * - Integration with Redux for fetching locations and time slots, and for updating availability.
 * - Real-time form validation using Yup.
 * - Feedback messages for successful updates or errors.
 */

const AvailabilityModal = ({ showModal, handleClose }) => {
  const dispatch = useDispatch();

  const doctorId = localStorage.getItem('doctor_id'); // Retrieve the doctor's ID from local storage
  const [availability, setAvailability] = useState([]);
  const [submissionError, setSubmissionError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [updateAvailability, { isLoading: isUpdating }] = useUpdateAvailabilityMutation();
  const [createAvailability, { isLoading: isCreating }] = useCreateAvailabilityMutation();
  const isLoading = isUpdating || isCreating;
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const locations = useSelector((state) => state.LocationSlice);
  const timeslots = useSelector((state) => state.TimeSlotsSlice);
  const [existingAvailability, setExistingAvailability] = useState([]);

  useEffect(() => {
    dispatch(fetchLocations());
    dispatch(fetchTimeSlots(doctorId));
  }, [showModal, doctorId]);

  /**
   * This function, `handleDayChange`, manages the selection or deselection of days for a doctor's availability.
   * It updates both the internal state and the form values to reflect changes in the selected days and their corresponding time slots.
   *
   * @param {string} day - The day being toggled.
   * @param {function} setFieldValue - Formik's method to set the value of a field directly.
   * @param {object} values - Current form values.
   */
  const handleDayChange = (day, setFieldValue, values) => {
    // Find the index of the day in the week.
    const dayIndex = daysOfWeek.findIndex((d) => d.value === day);
    // Check if the day is already selected.
    const isSelected = availability.includes(day);
    // Retrieve existing slots for the day from Formik's state.
    const formikDaySlots = values.days[dayIndex]?.slots ?? [];

    if (isSelected) {
      // If the day is already selected, remove it and its slots.
      setAvailability(availability.filter((d) => d !== day));
      setFieldValue(`days[${dayIndex}].slots`, formikDaySlots.length === 0 ? [] : formikDaySlots);
    } else {
      // If the day is not selected, add it and update slots.
      setAvailability([...availability, day]);
      // Fetch matching slots from the global state.
      const matchingSlots = timeslots.data[day];
      // Combine and deduplicate slots from global state and Formik's state.
      const updatedSlots = matchingSlots !== undefined
        ? [
          ...matchingSlots.filter(
            (slot) => !formikDaySlots.some(
              (fSlot) => fSlot.start_time === slot.start_time && fSlot.end_time === slot.end_time
            )
          ),
          ...formikDaySlots,
        ]
        : formikDaySlots;
      setFieldValue(`days[${dayIndex}].slots`, updatedSlots.length === 0 ? [] : updatedSlots);
    }
    // Toggle the selection state of the day.
    setFieldValue(`days[${dayIndex}].selected`, !isSelected);
  };

  const [initialFormValues, setInitialFormValues] = useState({
    days: daysOfWeek.map((day) => ({
      day: day.value,
      selected: false,
      slots: [{ start_time: '08:00', end_time: '09:00', location: { id: 'temp', name: '', mode: '' } }],
    })),
  });

  const findTimeIndex = (time) => {
    // Ensure the time is in the correct format expected by the timeSlots array
    return timeSlots.findIndex((t) => t === moment(time, 'HH:mm:ss').format('HH:mm'));
  };

 
  const handleSubmit = (values) => {
    const formattedValues = {
      days: values.days.map(day => ({
        ...day,
        slots: day.slots.map(slot => ({
          ...slot,
          location: {
            ...slot.location,
            id: slot.location && !isNaN(parseInt(slot.location.id)) ? parseInt(slot.location.id) : null
          },
          start_time: moment(slot.start_time, 'HH:mm').format('HH:mm:ss'),
          end_time: moment(slot.end_time, 'HH:mm').format('HH:mm:ss')
        }))
      }))
    };
  
    dispatch(DoctorAvailability(formattedValues));
    handleClose();
  };

  return (
    <Modal centered show={showModal} onHide={handleClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>My Availability</Modal.Title>
      </Modal.Header>
      <Formik
        // validationSchema={AvailabilitySchema}
        initialValues={initialFormValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          values,
          setFieldValue,
          resetForm,
          errors,
          touched,
          handleChange,
          handleSubmit,
        }) => (
          <Form>
            <Modal.Body>
              {submissionSuccess ? (
                <div className='alert alert-success' role='alert'>
                  Availability updated successfully!
                </div>
              ) : (
                <>
                  <p style={{ color: '#000', fontSize: '1rem' }}>
                    Here you can specify your availability where you can help organise meetings that
                    work better for yourself and your patients.
                  </p>
                  <div className='mb-3'>
                    Please choose which days you are available
                    <div className='d-flex flex-wrap'>
                      {daysOfWeek.map((day, index) => (
                        <label className='d-flex align-items-center me-4 mb-2' key={day.value}>
                          <Field
                            type='checkbox'
                            name={`days[${index}].selected`}
                            checked={availability.includes(day.value)}
                            onChange={() => {
                              handleDayChange(day.value, setFieldValue, values);
                            }}
                            className='me-2'
                          />
                          {day.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/** 
                   * Renders a list of selected days with configurable time slots for each day.
                   * For each selected day, it displays a section allowing the doctor to set available time slots.
                   * 
                   * - `values.days.filter((day) => day.selected)`: Filters the days array to include only those days that are selected.
                   * - `map((day, index) => ...)`: Maps over each selected day to render its configuration options.
                   * - `FieldArray`: A component that helps manage an array of fields (time slots in this case).
                   * - `day.slots.map((slot, slotIndex) => ...)`: Maps over each slot in a day to allow setting start and end times.
                   * - `previousSlotEndTime`: Determines the end time of the previous slot to set the minimum start time for the current slot.
                   * - `findTimeIndex(previousSlotEndTime) + 1`: Finds the index of the next valid start time after the previous slot's end time.
                   * - `validStartTimes`: An array of start times that are valid for the current slot based on the end time of the previous slot.
                   * - `selectedStartTimeIndex`: Finds the index of the currently selected start time to determine valid end times.
                   * - `validEndTimes`: An array of end times that are valid for the current slot based on its start time.
                   */
                    }
                  {values.days.filter((day) => day.selected).map((day, index) => (
                    <div key={day.day} className='mb-3'>
                      <strong>{day.day.toUpperCase()}:</strong>
                      <FieldArray
                        name={`days[${index}].slots`}
                        render={(slotHelpers) => day.slots.map((slot, slotIndex) => {
                          const previousSlotEndTime = slotIndex > 0 ? day.slots[slotIndex - 1].end_time : null;
                          const earliestStartTimeIndex = previousSlotEndTime ? findTimeIndex(previousSlotEndTime) + 1 : 0;
                          const validStartTimes = timeSlots.slice(earliestStartTimeIndex);
                          const selectedStartTimeIndex = findTimeIndex(slot.start_time);
                          const validEndTimes = timeSlots.slice(selectedStartTimeIndex + 1);

                          return (
                            <div key={slotIndex} className='d-flex align-items-center mb-2'>
                              <DropdownButton
                                id={`dropdown-start-time-${index}-${slotIndex}`}
                                title={slot.start_time || 'Start Time'}
                                variant='outline-secondary'
                                className='me-2'
                              >
                                {validStartTimes.map((time, timeIndex) => (
                                  <Dropdown.Item
                                    key={timeIndex}
                                    onClick={() => {
                                      setFieldValue(`days[${index}].slots[${slotIndex}].start_time`, time);
                                    }}
                                  >
                                    {time}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>
                              <span className='me-2'>to</span>
                              <DropdownButton
                                id={`dropdown-end-time-${index}-${slotIndex}`}
                                title={slot.end_time || 'End Time'}
                                variant='outline-secondary'
                                className='ms-2 me-3'
                              >
                                {validEndTimes.map((time, timeIndex) => (
                                  <Dropdown.Item
                                    key={timeIndex}
                                    onClick={() => {
                                      setFieldValue(`days[${index}].slots[${slotIndex}].end_time`, time);
                                    }}
                                  >
                                    {time}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>

                              <DropdownButton
                                id={`dropdown-location-${index}-${slotIndex}`}
                                title={slot.location?.name || 'Location'}
                                variant='outline-secondary'
                                className='ms-3'
                              >
                                {locations.data.map((item, key) => (
                                  <Dropdown.Item
                                    key={key}
                                    onClick={() =>
                                      setFieldValue(
                                        `days[${index}].slots[${slotIndex}].location`,
                                        item || { id: null, name: '', mode: '' } // Ensure it defaults to an object
                                      )
                                    }
                                  >
                                    {item.name}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>

                              <DropdownButton
                                id={`dropdown-location-${index}-${slotIndex}`}
                                title={slot.location?.mode || 'mode'}
                                variant='outline-secondary'
                                className='ms-3'
                              >
                                {locations.data.map((item, key) => (
                                  <Dropdown.Item
                                    key={key}
                                    onClick={() =>
                                      setFieldValue(
                                        `days[${index}].slots[${slotIndex}].location.mode`,
                                        item.mode,
                                      )
                                    }
                                  >
                                    {item.mode}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>

                              {day.slots.length - 1 === slotIndex && (
                                <>
                                  <Button
                                    variant='outline-primary btn-icon btn-sm'
                                    onClick={() =>
                                      slotHelpers.insert(slotIndex + 1, {
                                        start_time: '',
                                        end_time: '',
                                        location: '',
                                        mode: '',
                                      })
                                    }
                                    className='ms-2 p-0'
                                  >
                                    <BsPlus />
                                  </Button>
                                  {slotIndex > 0 && (
                                    <Button
                                      variant='outline-danger btn-icon btn-sm'
                                      onClick={() => slotHelpers.remove(slotIndex)}
                                      className='ms-2 p-0'
                                    >
                                      <BsFillTrashFill />
                                    </Button>
                                  )}
                                </>
                              )}
                              <ErrorMessage
                                name={`days[${index}].slots[${slotIndex}].start_time`}
                                component='div'
                                className='text-danger'
                              />
                              <ErrorMessage
                                name={`days[${index}].slots[${slotIndex}].end_time`}
                                component='div'
                                className='text-danger'
                              />
                              <ErrorMessage
                                name={`days[${index}].slots[${slotIndex}].location`}
                                component='div'
                                className='text-danger'
                              />
                            </div>
                          );
                        })
                        }
                      />
                    </div>
                  ))}
                </>
              )}
              {submissionError && (
                <div className='alert alert-danger' role='alert'>
                  {submissionError}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => {
                  handleClose();
                  resetForm();
                  setAvailability([]);
                  setSubmissionError('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                type='submit'
              // disabled={isSubmitting || isLoading}
              >
                {isLoading ? 'Saving...' : 'Send Availability'}
              </Button>
              {errors.submit && touched.submit && (
                <div className='text-danger'>{errors.submit}</div>
              )}
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AvailabilityModal;