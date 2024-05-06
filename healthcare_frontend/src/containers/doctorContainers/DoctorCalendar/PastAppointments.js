import PaginationButtons from '../PaginationButtons';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentByPatient } from '../../../features/appointments/patientdataSlice';

/**
 * PastAppointments displays a list of past appointments for a specific patient.
 * It includes functionalities such as pagination, searching, and viewing detailed information about each appointment.
 * 
 * Features:
 * - Fetches appointments from a Redux store using the `fetchAppointmentByPatient` action.
 * - Allows users to search through appointments based on doctor's name, appointment ID, date, phone number, and email.
 * - Implements pagination to manage the display of appointments in a tabular format.
 * - Provides a modal view to display detailed information about a specific appointment when a row is clicked.
 * 
 * State:
 * - currentPage: Tracks the current page number in the pagination.
 * - itemsPerPage: Manages the number of items displayed per page.
 * - totalPages: Calculates the total number of pages needed based on the number of appointments.
 * - searchText: Holds the text used for searching through the appointments.
 * - filteredAppointments: Contains the list of appointments that match the search criteria.
 * - show: Boolean to control the visibility of the modal for detailed appointment information.
 * - rowdata: Holds the data of the selected appointment to be displayed in the modal.
 * 
 * The component uses local storage to retrieve the patient's ID and filters appointments based on this ID.
 * It also handles changes in pagination settings and updates the view accordingly.
 */


const PastAppointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.AppointmentByPatientSlice);

  const patient_id = localStorage.getItem('patient_id');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(appointments.data);
  const [show, setShow] = useState(false);
  const [rowdata, setRowdata] = useState(null);

  console.log(appointments.data);
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);

    const filteredData = appointments.data.filter((appointment) => {
      const doctor = appointment.doctor || {};
      const user = doctor.user || {};

      // Combine all searchable fields into a single string
      const searchableFields = [
        user.first_name || '',
        user.last_name || '',
        appointment.id,
        appointment.appointment_date,
        doctor.tel_number || '',
        user.email || '',
      ].join(' ');

      return searchableFields.toLowerCase().includes(searchTerm);
    });

    setFilteredAppointments(filteredData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  const handleRow = (data) => {
    setRowdata(data);
    setShow(true);
  };

  useEffect(() => {
    dispatch(fetchAppointmentByPatient(patient_id));
  }, [dispatch]);

  useEffect(() => {
    if (appointments.data !== null) {
      const totalPages = calculateTotalPages(appointments.data.length, itemsPerPage);
      setTotalPages(totalPages);

      function calculateTotalPages(totalItems, itemsPerPage) {
        if (itemsPerPage === 0) {
          throw new Error('Items per page cannot be zero');
        }
        let totalPages = Math.floor(totalItems / itemsPerPage);
        if (totalItems % itemsPerPage > 0) {
          totalPages += 1;
        }
        return totalPages;
      }
    }
    setFilteredAppointments(appointments.data);
  }, [appointments.data]);

  return (
    <div className='content d-flex flex-column flex-column-fluid' id='kt_content'>
      <div className='d-flex flex-column-fluid'>
        <div className='container'>
          <div className='card card-custom gutter-b'>
            <div className='card-header flex-wrap border-0 pt-6 pb-0'>
              <div className='card-title'>
                <h3 className='card-label'>Doctor Appointment Management</h3>
              </div>
              <div className='card-toolbar'>
                <input
                  className='form-control'
                  placeholder='Search Doctor'
                  value={searchText}
                  onChange={handleSearch}
                />
                <span
                  className='text-muted'
                  style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#888' }}
                >
                  type doctor name, appointment id, date, Phone,Email
                </span>
              </div>
            </div>

            <div className='card-body'>
              <div className='datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded'>
                <table className='datatable-table' style={{ display: 'block' }}>
                  <thead className='datatable-head'>
                    <tr className='datatable-row' style={{ left: '0px' }}>
                      <th className='datatable-cell-left datatable-cell datatable-cell-sort'>
                        <span style={{ width: '40px' }}>#</span>
                      </th>
                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '150px' }}>Doctor name</span>
                      </th>
                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '100px' }}>Type</span>
                      </th>
                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '136px' }}>Date</span>
                      </th>
                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '136px' }}>Start time</span>
                      </th>

                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '136px' }}>End time</span>
                      </th>
                      <th className='datatable-cell datatable-cell-sort'>
                        <span style={{ width: '136px' }}>Followup notes</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='datatable-body'>
                    {currentItems.map((item, key) => (
                      <tr key={key} className='datatable-row' style={{ left: '0px' }}>
                        <td className='datatable-cell-left datatable-cell'>
                          <span style={{ width: '40px' }}>
                            <span className='font-weight-bolder'>{item.id}</span>
                          </span>
                        </td>
                        <td data-field='OrderID' className='datatable-cell'>
                          <span style={{ width: '150px' }}>
                            <div className='d-flex align-items-center'>
                              <div className='ml-3'>
                                <div className='text-dark-75 font-weight-bolder font-size-lg mb-0'>
                                  {item.doctor.user.first_name} {item.doctor.user.last_name}
                                </div>
                                <a
                                  href={`tel:${item.doctor.Mobile}`}
                                  className='text-muted font-weight-bold text-hover-primary'
                                >
                                  {item.doctor.tel_number}
                                </a>
                              </div>
                            </div>
                          </span>
                        </td>

                        <td className='datatable-cell'>
                          <span style={{ width: '100px' }}>
                            <div className='font-weight-bolder font-size-lg mb-0'>
                              {item.appointment_type}
                            </div>
                          </span>
                        </td>

                        <td className='datatable-cell'>
                          <span style={{ width: '136px' }}>
                            <div className='font-weight-bolder text-primary mb-0'>
                              {item.appointment_date}
                            </div>
                          </span>
                        </td>
                        <td className='datatable-cell'>
                          <span style={{ width: '136px' }}>
                            <div className='font-weight-bold text-muted'>
                              {item.time_slot.start_time}
                            </div>
                          </span>
                        </td>

                        <td className='datatable-cell'>
                          <span style={{ width: '136px' }}>
                            <div className='font-weight-bold text-muted'>
                              {item.time_slot.end_time}
                            </div>
                          </span>
                        </td>
                        <td className='datatable-cell'>
                          <span style={{ width: '136px' }}>
                            <button
                              className='btn btn-small btn-icon btn-outline-success'
                              onClick={() => handleRow(item)}
                            >
                              <i className='far fa-eye icon-nm'></i>
                            </button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='datatable-pager datatable-paging-loaded'>
                  <PaginationButtons
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />

                  <div className='datatable-pager-info my-2 mb-sm-0'>
                    <div
                      className='dropdown bootstrap-select datatable-pager-size'
                      style={{ width: '60px' }}
                    >
                      <Dropdown>
                        <Dropdown.Toggle
                          variant='outline-secondary'
                          className='dropdown bootstrap-select datatable-pager-size'
                        >
                          Select
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(5);
                              setCurrentPage(1);
                            }}
                          >
                            5
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(10);
                              setCurrentPage(1);
                            }}
                          >
                            10
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(20);
                              setCurrentPage(1);
                            }}
                          >
                            20
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(30);
                              setCurrentPage(1);
                            }}
                          >
                            30
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(50);
                              setCurrentPage(1);
                            }}
                          >
                            50
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setItemsPerPage(100);
                              setCurrentPage(1);
                            }}
                          >
                            100
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <span className='datatable-pager-detail'>
                      Showing {currentPage} - {totalPages} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {rowdata !== null ? (
        <Modal centered size='lg' show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Appointment with {rowdata.doctor.user.first_name} {rowdata.doctor.user.last_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px' }}>
            <div className='row'>
              <div className='col-12'>
                <p>
                  <strong>Follow-up notes:</strong> {rowdata.FollowupNote}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        ''
      )}
    </div>
  );
};
export default PastAppointments;
