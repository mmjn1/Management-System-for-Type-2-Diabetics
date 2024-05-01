import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchPatientAppointment } from '../../features/appointments/PatientAppointment';
import PaginationButtons from './PaginationButtons';
import { Button, Dropdown, Modal } from 'react-bootstrap';


/**
 * `AppointmentList` is a React component that renders a list of patient appointments for a doctor.
 * It provides functionalities such as pagination, searching, and viewing detailed information about each appointment.
 *
 * Features:
 * - Fetches appointments from a Redux store using the `fetchPatientAppointment` action.
 * - Allows users to search through appointments based on patient name, appointment ID, date, phone number, and email.
 * - Implements pagination to manage the display of appointments in a tabular format.
 * - Provides a modal view for detailed appointment information when a row is clicked.
 *
 * State Management:
 * - Uses local state for managing current page, items per page, search text, filtered appointments, modal visibility, and selected row data.
 * - Utilizes Redux for state management related to fetching and storing appointment data.
 *
 * Effects:
 * - Fetches appointment data on component mount and whenever the doctor ID changes.
 * - Filters appointments based on search input.
 * - Calculates total pages for pagination based on the number of appointments and items per page.
 *
 * The component is designed to be used within a doctor's dashboard where they can manage their appointments efficiently.
 */

const AppointmentList = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.PatientAppointmentSlice);

  const doctor_id = localStorage.getItem('doctor_id');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(appointments.data);
  const [show, setShow] = useState(false);
  const [rowdata, setRowdata] = useState(null);

  useEffect(() => {
    dispatch(fetchPatientAppointment(doctor_id));
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

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);

    const filteredData = appointments.data.filter((appointment) => {
      const patient = appointment.patient || {};
      const user = patient.user || {};

      // Combine all searchable fields into a single string
      const searchableFields = [
        user.first_name || '',
        user.last_name || '',
        appointment.id,
        appointment.appointment_date,
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
  return (
    <div className='content d-flex flex-column flex-column-fluid' id='kt_content'>
      <div className='d-flex flex-column-fluid'>
        <div className='container'>
          <div className='card card-custom gutter-b'>
            <div className='card-header flex-wrap border-0 pt-6 pb-0'>
              <div className='card-title'>
                <h3 className='card-label'>Patient Appointment Management</h3>
              </div>
              <div className='card-toolbar'>
                <input
                  className='form-control'
                  placeholder='Search Patient'
                  value={searchText}
                  onChange={handleSearch}
                />
                <span
                  className='text-muted'
                  style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#888' }}
                >
                  type patient name, appointment id, date, Phone,
                </span>
                {/*end::Dropdown*/}
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
                        <span style={{ width: '150px' }}>Patient name</span>
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
                                  {item.patient.user.first_name} {item.patient.user.last_name}
                                </div>
                                {/* <a
                                  href={`tel:${item.patient.Mobile}`}
                                  className='text-muted font-weight-bold text-hover-primary'
                                >
                                  {item.patient.Mobile}
                                </a> */}
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
            <Modal.Title>Appointment with {rowdata.patient.user.first_name} {rowdata.patient.user.last_name}</Modal.Title>
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

export default AppointmentList;