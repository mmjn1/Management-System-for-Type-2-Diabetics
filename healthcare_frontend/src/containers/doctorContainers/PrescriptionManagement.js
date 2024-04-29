import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deletePrescription,
  fetchPrescriptionsDoctor,
} from '../../features/prescription/PrescriptionSlice'
import moment from 'moment'
import { Modal, Button, Dropdown } from 'react-bootstrap'
import PaginationButtons from './PaginationButtons'
import * as PropTypes from 'prop-types'
import { sendEmail } from '../../features/prescription/EmailSlice'
import FollowupModal from './FollowupModal'

 /**
   * This component is for managing prescriptions for Doctors. 
   * This component provides a interface for both viewing and managing patient prescriptions.
   * 
   * It includes functionality for:
   * - Displaying a list of prescriptions with details such as patient ID, name, prescription date,
   *   and current blood sugar levels.
   * - Emailing prescriptions directly from the interface.
   * - Editing and deleting prescriptions through modal forms.
   * - Filtering and searching through the list of prescriptions.
   * 
   * 
   * Key Features:
   * - **Email Prescription**: Allows sending prescriptions directly via email through a form in the sidebar.
   * - **View and Edit**: Each prescription can be viewed in detail, and necessary adjustments can be made.
   * - **Delete Prescription**: Prescriptions can be deleted with confirmation prompts to prevent accidental deletions.
   * - **Pagination and Search**: Supports pagination and has a search feature to easily find specific prescriptions.
   * 
   */


function DropdownPageSize(props) {
  return null
}

DropdownPageSize.propTypes = {
  itemsPerPage: PropTypes.number,
  setCurrentPage: PropTypes.any,
  setItemsPerPage: PropTypes.func,
}
const PrescriptionManagement = () => {
  const dispatch = useDispatch()
  const [Followupbool, setFollowupbool] = useState(false)
  const [DeleteModal, setDeleteModal] = useState(false)
  const [ViewModal, setViewModal] = useState(false)
  const [DeleteId, setDeleteID] = useState(null)
  const [row, setRow] = useState(null)
  const [row1, setRow1] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isOpen, setIsOpen] = useState(false)
  const [primaryEmail, setPrimaryEmail] = useState('')
  const [RowEdit, setRowEdit] = useState(null)
  const [emailError, setEmailError] = useState('')
  const Prescriptions = useSelector(state => state.Prescription)

  useEffect(() => {
    dispatch(fetchPrescriptionsDoctor(localStorage.getItem('doctor_id')))
  }, [dispatch])

  const deleteModal = id => {
    setDeleteID(id)
    setDeleteModal(true)
  }
  const DeletePrescription = () => {
    setDeleteModal(false)
    dispatch(deletePrescription(DeleteId))
    setDeleteID(null)
  }
  const viewModal = data => {
    setRow(data)
    setViewModal(true)
  }
  const openEmail = data => {
    setRow1(data)
    setIsOpen(true)
  }
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = Prescriptions.Prescriptions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )
  const totalPages = calculateTotalPages(
    Prescriptions.Prescriptions.length,
    itemsPerPage,
  )
  const openEdit = item => {
    setRowEdit(item)
    setFollowupbool(true)
  }

  function calculateTotalPages(totalItems, itemsPerPage) {
    if (itemsPerPage === 0) {
      throw new Error('Items per page cannot be zero')
    }
    let totalPages = Math.floor(totalItems / itemsPerPage)
    if (totalItems % itemsPerPage > 0) {
      totalPages += 1
    }
    return totalPages
  }

  const handlePrimaryEmailChange = event => {
    setPrimaryEmail(event.target.value)
    if (emailError) setEmailError('') // Clears error when user starts typing
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }


  const sendEmaillocal = e => {
    e.preventDefault()
    if (!primaryEmail) {
      setEmailError('Email is required')
      return
    }
    if (!validateEmail(primaryEmail)) {
      setEmailError('Please enter a valid email address')
      return
    } const body = {
      primaryEmail: primaryEmail,
      prescription: row1.id,
    }
    dispatch(sendEmail(body))
    setIsOpen(false)
    setPrimaryEmail('')
  }

  return (
    <div className='d-flex flex-column flex-root'>
      <div id='wrapper' className={isOpen ? 'toggled' : ''}>
        {/* Sidebar */}
        <div id='sidebar-wrapper'>
          <button
            className='btn btn-sm btn-icon btn-outline-secondary float-right'
            onClick={() => setIsOpen(false)}
          >
            <i className='far fa-arrow-alt-circle-right'></i>
          </button>
          <div className='sidebar-header'>
            <span className='sidebar-brand'>Email Prescription</span>
          </div>

          <div className='sidebar-content'>
            {row1 !== null ? (
              <div className='form-group'>
                <label htmlFor='patientId'>Patient ID:</label>
                <b> {row1.patient.id}</b>
                <br />
                <label htmlFor='patientId'>Patient Name:</label>
                <b>
                  {row1.patient.first_name} {row1.patient.last_name}
                </b>
                <br />
                <label htmlFor='patientId'>Prescription Date:</label>
                <span>
                  <b> {moment(row1.start_date).format('Do MMM YY, h:mm: a')}</b>
                </span>
              </div>
            ) : (
              ''
            )}
            <form>
              <div className='form-group'>
                <input
                  type='email'
                  className='form-control'
                  id='primaryEmail'
                  name='primaryEmail'
                  placeholder='Primary email'
                  value={primaryEmail}
                  onChange={handlePrimaryEmailChange}
                  required
                />
                {emailError && <div style={{ color: 'red' }}>{emailError}</div>}
              </div>

              <button
                className='btn btn-primary btn-block'
                type='submit'
                onClick={e => sendEmaillocal(e)}
              >
                <i className='far fa-paper-plane'></i>Send
              </button>
            </form>
          </div>
        </div>
        {/* /#sidebar-wrapper */}
        {/* Page Content */}
        <div id='page-content-wrapper'>
          <div className='container-fluid'>
            <div className='d-flex flex-row flex-column-fluid page'>
              <div className='d-flex flex-column flex-row-fluid wrapper'>
                <div className='content d-flex flex-column flex-column-fluid'>
                  <div className='d-flex flex-column-fluid'>
                    {/*begin::Container*/}
                    <div className=''>
                      <div className='d-flex flex-row'>
                        {/*begin::List*/}
                        <div className='flex-row-fluid d-flex flex-column'>
                          <div className='d-flex flex-column flex-grow-1'>
                            {/*begin::Head*/}
                            <div className='gutter-b'>
                              {/*begin::Body*/}
                              <div className='d-flex align-items-center justify-content-between flex-wrap py-3'>
                                {/*begin::Info*/}
                                <div className='d-flex align-items-center mr-2 py-2'>
                                  <h3 className='font-weight-bold mb-0 mr-10'>
                                    Prescriptions Management
                                  </h3>
                                </div>
                                {/*end::Info*/}
                              </div>
                              {/*end::Body*/}
                            </div>
                            {/*end::Head*/}
                            {/*begin::Card*/}
                            <div className='card card-custom d-flex flex-grow-1'>
                              {/*begin::Body*/}
                              <div className='card-body'>
                                {/*begin: Datatable*/}
                                <div className='datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded'>
                                  <table
                                    className='datatable-table'
                                    style={{ display: 'block' }}
                                  >
                                    <thead className='datatable-head'>
                                      <tr
                                        className='datatable-row'
                                        style={{ left: '0px' }}
                                      >
                                        <th className='datatable-cell-left datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '20px' }}>
                                            #
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '80px' }}>
                                            Patient ID
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '147px' }}>
                                            Name
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '80px' }}>
                                            Date of Diagnosis
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '147px' }}>
                                            Current Blood Sugar Level (mg/dL):
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '147px' }}>
                                            Target Blood Sugar Level (mg/dL):
                                          </span>
                                        </th>
                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span
                                            style={{ width: '147px' }}
                                          ></span>
                                          Visit date
                                        </th>

                                        <th className='datatable-cell datatable-cell-sort'>
                                          <span style={{ width: '130px' }}>
                                            Actions
                                          </span>
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody className='datatable-body'>
                                      {currentItems.map((item, key) => (
                                        <tr
                                          className='datatable-row'
                                          key={key}
                                          style={{ left: '0px' }}
                                        >
                                          <td className='datatable-cell-left datatable-cell'>
                                            <span style={{ width: '20px' }}>
                                              <span className='font-weight-bolder'>
                                                {item.id}
                                              </span>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '80px' }}>
                                              <div className='d-flex align-items-center'>
                                                <div className='ml-4'>
                                                  <div className='text-dark-75 font-weight-bolder font-size-lg mb-0'>
                                                    {item.patient.id}
                                                  </div>
                                                </div>
                                              </div>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '147px' }}>
                                              <div className='font-weight-bolder font-size-lg mb-0'>
                                                {item.patient.first_name}{' '}
                                                {item.patient.last_name}
                                              </div>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '80px' }}>
                                              <div className='font-weight-bolder font-size-lg mb-0'>
                                                {item.patient.date_of_diagnosis}
                                              </div>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '147px' }}>
                                              <div className='font-weight-bolder text-primary mb-0'>
                                                {item.patient.blood_sugar_level
                                                  ? item.patient.blood_sugar_level
                                                  : 'N/A'}
                                              </div>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '147px' }}>
                                              <div className='font-weight-bolder text-primary mb-0'>
                                                {item.patient.target_blood_sugar_level
                                                  ? item.patient.target_blood_sugar_level
                                                  : 'N/A'}
                                              </div>
                                            </span>
                                          </td>
                                          <td className='datatable-cell'>
                                            <span style={{ width: '147px' }}>
                                              <div className='font-weight-bold text-muted'>
                                                {moment(item.start_date).format(
                                                  'Do MMM YY, h:mma',
                                                )}
                                              </div>
                                            </span>
                                          </td>
                                          {/* <td className='datatable-cell-sorted datatable-cell'>
                                            <span style={{ width: '50px' }}>
                                              <span className='label label-lg font-weight-bold  label-light-primary label-inline'>
                                                {item.patient.age
                                                  ? item.patient.age
                                                  : 'N/A'}
                                              </span>
                                            </span>
                                          </td> */}
                                          <td className='datatable-cell'>
                                            <span
                                              style={{
                                                overflow: 'visible',
                                                position: 'relative',
                                                width: '130px',
                                              }}
                                            >
                                              <button
                                                onClick={() => openEdit(item)}
                                                className='btn btn-sm btn-outline-secondary btn-text-primary btn-hover-primary btn-icon mr-2'
                                                title='Follow Up'
                                              >
                                                {' '}
                                                <span className='svg-icon svg-icon-md'>
                                                  <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                                    aria-hidden='true'
                                                    role='img'
                                                    className='MuiBox-root css-a6775w iconify iconify--ri'
                                                    aria-label='Follow up'
                                                    width='1em'
                                                    height='1em'
                                                    viewBox='0 0 24 24'
                                                  >
                                                    <path
                                                      fill='#637381'
                                                      d='M21 3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1zm-1 2H4v13.385L5.763 17H20zm-3 2v8h-2V7zm-6 1v1.999L13 10v2l-2-.001V14H9v-2.001L7 12v-2l2-.001V8z'
                                                    />
                                                  </svg>
                                                </span>{' '}
                                              </button>{' '}
                                              <Dropdown style={{ position: 'relative !important' }}>
                                                <Dropdown.Toggle
                                                  variant='outline-primary'
                                                  className='btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2'
                                                  title='More'
                                                >
                                                  <span className='svg-icon svg-icon-md'>
                                                    <svg
                                                      width='800px'
                                                      height='800px'
                                                      viewBox='0 0 24 24'
                                                      fill='none'
                                                      xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                      <g
                                                        id='SVGRepo_bgCarrier'
                                                        strokeWidth={0}
                                                      />
                                                      <g
                                                        id='SVGRepo_tracerCarrier'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                      />
                                                      <g id='SVGRepo_iconCarrier'>
                                                        {' '}
                                                        <path
                                                          opacity='0.1'
                                                          d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                                                          fill='#637381'
                                                        />{' '}
                                                        <path
                                                          d='M12.0049 16.005L12.0049 15.995'
                                                          stroke='#637381'
                                                          strokeWidth={2}
                                                          strokeLinecap='round'
                                                          strokeLinejoin='round'
                                                        />{' '}
                                                        <path
                                                          d='M12.0049 12.005L12.0049 11.995'
                                                          stroke='#637381'
                                                          strokeWidth={2}
                                                          strokeLinecap='round'
                                                          strokeLinejoin='round'
                                                        />{' '}
                                                        <path
                                                          d='M12.0049 8.005L12.0049 7.995'
                                                          stroke='#637381'
                                                          strokeWidth={2}
                                                          strokeLinecap='round'
                                                          strokeLinejoin='round'
                                                        />{' '}
                                                        <path
                                                          d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                                                          stroke='#637381'
                                                          strokeWidth={2}
                                                        />{' '}
                                                      </g>
                                                    </svg>
                                                  </span>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      openEmail(item)
                                                    }
                                                  >
                                                    <div>
                                                      <span className='navi-icon'>
                                                        <i className='fa fa-envelope'></i>
                                                      </span>{' '}
                                                      <span className='navi-text'>
                                                        Email prescription
                                                      </span>
                                                    </div>
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      viewModal(item)
                                                    }
                                                  >
                                                    <div>
                                                      <span className='navi-icon'>
                                                        <i className='far fa-eye'></i>
                                                      </span>{' '}
                                                      <span className='navi-text'>
                                                        View patient
                                                      </span>
                                                    </div>
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    onClick={() =>
                                                      deleteModal(item.id)
                                                    }
                                                  >
                                                    <div>
                                                      <span className='navi-icon'>
                                                        <i className='fas fa-trash'></i>
                                                      </span>
                                                      <span className='navi-text'>
                                                        Delete prescription
                                                      </span>
                                                    </div>
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
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
                                                setItemsPerPage(5)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              5
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setItemsPerPage(10)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              10
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setItemsPerPage(20)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              20
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setItemsPerPage(30)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              30
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setItemsPerPage(50)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              50
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => {
                                                setItemsPerPage(100)
                                                setCurrentPage(1)
                                              }}
                                            >
                                              100
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                      <span className='datatable-pager-detail'>
                                        Showing {currentPage} - {totalPages} of{' '}
                                        {totalPages}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /#page-content-wrapper */}
      </div>

      {RowEdit !== null && (
        <FollowupModal
          item={RowEdit}
          show={Followupbool}
          onHide={() => {
            setFollowupbool(false)
            setRowEdit(null)
          }}
        />
      )}

      <Modal centered show={DeleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title> Confirm Deletion </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Prescription?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeleteModal(false)}>
            Close
          </Button>
          <Button variant='outline-danger' onClick={() => DeletePrescription()}>
            Delete Prescription
          </Button>
        </Modal.Footer>
      </Modal>
      {row === null ? (
        ''
      ) : (
        <Modal
          show={ViewModal}
          onHide={() => setViewModal(false)}
          size='lg'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Patient Record: {row.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
              <div className='col-6'>
                <div className='MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-md-5 MuiGrid2-grid-lg-5 css-r5at59'>
                  <div className='d-flex align-items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      xmlnsXlink='http://www.w3.org/1999/xlink'
                      aria-hidden='true'
                      role='img'
                      className='MuiBox-root css-1t9pz9x iconify iconify--mdi'
                      width='1.5em'
                      height='1.5em'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        d='M12 10c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2m6.39 8.56C16.71 11.7 14.53 11 12 11s-4.71.7-6.39 1.56A2.97 2.97 0 0 0 4 15.22V22h2v-6.78c0-.38.2-.72.5-.88C7.71 13.73 9.63 13 12 13c.76 0 1.47.07 2.13.2l-1.55 3.3H9.75C8.23 16.5 7 17.73 7 19.25S8.23 22 9.75 22H18c1.1 0 2-.9 2-2v-4.78c0-1.12-.61-2.15-1.61-2.66M10.94 20H9.75c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1.89zM18 20h-4.85l2.94-6.27c.54.2 1.01.41 1.41.61c.3.16.5.5.5.88z'
                      />
                    </svg>
                    <h6 className='ml-1 mt-4'>Demographic</h6>
                  </div>
                  <div className=''>
                    <p className=''>
                      Name: {row.patient.first_name} {row.patient.last_name}
                    </p>
                    <p className=''>Current Blood Sugar Level (mg/dL): {row.patient.blood_sugar_level}</p>

                    <p className=''>
                      Target Blood Sugar Level (mg/dL): {row.patient.target_blood_sugar_level ? row.patient.target_blood_sugar_level : 'N/A'}
                    </p>

                    <p className=''>
                      Date of diagnosis:{' '}
                      {moment(row.patient.date_of_diagnosis).format(
                        'Do MMM YYYY',
                      )}
                    </p>

                    <p className=''>
                      Smoking habits: {row.patient.smoking_habits}
                    </p>
                    <p className=''>
                      Alcohol consumption: {row.patient.alcohol_consumption}
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <div>
                  <div>
                    <div className='d-flex align-items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        aria-hidden='true'
                        role='img'
                        className='MuiBox-root css-1t9pz9x iconify iconify--material-symbols-light'
                        width='1.5em'
                        height='1.5em'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fill='currentColor'
                          d='M8.5 17.73h7v-1h-7zm0-2.615h7v-1h-7zm3.5-2.834q1.535-1.385 2.517-2.24q.983-.854.983-2.072q0-.707-.496-1.204q-.496-.496-1.204-.496q-.679 0-1.041.309q-.363.309-.759.799q-.396-.49-.759-.8T10.2 6.27q-.708 0-1.204.496T8.5 7.97q0 1.218.945 2.035q.945.817 2.555 2.277M17.385 21H6.615q-.69 0-1.152-.462Q5 20.075 5 19.385V4.615q0-.69.463-1.152Q5.925 3 6.615 3h10.77q.69 0 1.152.463q.463.462.463 1.152v14.77q0 .69-.462 1.152q-.463.463-1.153.463m-10.77-1h10.77q.269 0 .442-.173t.173-.442V4.615q0-.269-.173-.442T17.385 4H6.615q-.269 0-.442.173T6 4.615v14.77q0 .269.173.442t.442.173M6 20V4z'
                        />
                      </svg>
                      <h6 className='ml-1 mt-4'>Diagnoses</h6>
                    </div>
                    <div>
                      {row.Diagnoses.map((item, key) => (
                        <p key={key}>
                          {key + 1}. {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className=''>
                    <div className='d-flex align-items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        aria-hidden='true'
                        role='img'
                        className='MuiBox-root css-1t9pz9x iconify iconify--uil'
                        width='1.5em'
                        height='1.5em'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fill='currentColor'
                          d='M14 14h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2m6-5.06a1.31 1.31 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3Z'
                        />
                      </svg>
                      <h6 className='ml-1 mt-4'>Histories</h6>
                    </div>
                    <div className=''>
                      {row.Histories.map((item, key) => (
                        <p key={key}>
                          {key + 1}. {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className=''>
                    <div className='d-flex align-items-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        aria-hidden='true'
                        role='img'
                        className='MuiBox-root css-1t9pz9x iconify iconify--material-symbols'
                        width='1.5em'
                        height='1.5em'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fill='currentColor'
                          d='M3 5V3h12v2zm4.5 12.5h3V15H13v-3h-2.5V9.5h-3V12H5v3h2.5zM4 21q-.825 0-1.412-.587T2 19V8q0-.825.588-1.412T4 6h10q.825 0 1.413.588T16 8v11q0 .825-.587 1.413T14 21zm0-2h10V8H4zm15-5.25q-.875-.425-1.437-1.412T17 10q0-1.7.863-2.85T20 6q1.275 0 2.138 1.15T23 10q0 1.35-.562 2.338T21 13.75V20q0 .425-.288.713T20 21q-.425 0-.712-.288T19 20zM20 12q.3 0 .65-.537T21 10q0-.925-.35-1.463T20 8q-.3 0-.65.538T19 10q0 .925.35 1.463T20 12m0-2'
                        />
                      </svg>
                      <h6 className='ml-1 mt-4'>Medications</h6>
                    </div>
                    <div className=''>
                      {row.Drug.map((item, key) => (
                        <div className='' key={key}>
                          <p className=''>
                            {key + 1}. {item.Medical_name.name} (
                            {item.Medical_name.salt.name})
                          </p>
                          <span className='css-u4p24i'>
                            <p className=''>
                              {item.dosage
                                .replace(/\[|\]/g, '')
                                .split(',')
                                .map(
                                  (dosePart, doseIndex) =>
                                    !dosePart.includes('{') && (
                                      <span
                                        className='badge bg-light me-1'
                                        key={doseIndex}
                                      >
                                        <span style={{ color: 'black' }}>
                                          {dosePart.replace(/['"]+/g, '')}
                                        </span>
                                      </span>
                                    ),
                                )}
                              <span className=''>
                                {item.frequency} / {item.duration}
                              </span>
                            </p>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}
export default PrescriptionManagement;
