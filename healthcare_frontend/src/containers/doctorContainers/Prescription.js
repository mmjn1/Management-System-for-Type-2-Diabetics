import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { Fragment, useEffect, useRef, useState } from 'react'
import Creatable from 'react-select/creatable'
import { toast } from 'react-hot-toast'
import BlankPatient from '../../containers/doctorContainers/BlankPatient'
import { Badge, Dropdown, DropdownButton } from 'react-bootstrap'
import PlusSVG from '../../assets/SVGS/PlusSVG'
import MinusSVG from '../../assets/SVGS/MinusSVG'
import SaveSVG from '../../assets/SVGS/SaveSVG'
import { fetchPatient } from '../../features/patient/fetchPatients'
import moment from 'moment/moment'
import { fetchSymptoms } from '../../features/prescription/SymptomsSlice'
import { fetchTests } from '../../features/prescription/TestsSlice'
import { fetchSalts } from '../../features/prescription/SaltSlice'
import BlackMedicine from '../../containers/doctorContainers/BlackMedicine'
import { createPrescription } from '../../features/prescription/PrescriptionSlice'

const customStyles = {
  control: provided => ({
    ...provided,
    width: '200%',
  }),
  option: (provided, state) => ({
    ...provided,

    width: '100%',
  }),
  menu: provided => ({
    ...provided,
    width: '200%',
  }),
}

/**
 * `Prescription` component enables users, specifically doctors, to create, manage,
 * and submit patient prescriptions. The component connects to several Redux slices for fetching
 * necessary data like patients, symptoms, tests, and medication salts. It provides an interactive UI
 * for selecting a patient and specifying prescription details such as symptoms, tests, vitals,
 * diagnoses, patient history, advices, follow-ups, and drugs.
 *
 * Usage:
 * <Prescription />
 *
 * State Variables:
 * - Various `useState` hooks manage the state of the form inputs, selections, and toggles for different sections.
 *
 * Effects:
 * - `useEffect` hooks are utilized to fetch necessary data on component mount and to perform
 *   actions based on certain state changes.
 *
 * Critical Functions:
 * - `handleMedicineSelect`: Handles the selection of a medicine for the prescription.
 * - `handleInputChange`: Manages changes to the vitals input fields.
 * - `Submit`: Compiles and dispatches the prescription data, performs validation to ensure no fields are empty.
 * - `handleChangeNewSalt`, `handleChangeDrugName`: Handle the selection and creation of new salts and drug names in the creatable select inputs.
 * - `addMedicine`: Adds a new medicine to the prescription list.
 * - `handleMedicineRemoveNonIndex`: Removes a selected medicine based on a non-index identifier.
 *
 * The component is designed to be used within a doctor's dashboard where they have the ability to manage patient prescriptions efficiently.
 */



const Prescription = () => {
  const dispatch = useDispatch()
  const now = new Date()

  const genericNameRef = useRef(null)
  const drugNameRef = useRef(null)
  const SymptomRef = useRef(null)
  const TestsRef = useRef(null)

  const Patients = useSelector(state => state.PatientSlice)
  const symptoms = useSelector(state => state.Symptoms)
  const tests = useSelector(state => state.Tests)
  const salts = useSelector(state => state.Salts)
  const [followup, setFollowup] = useState([
    'Meet after 1 month',
    'Meet after 2 month',
    'Meet after 3 month',
  ])
  const [advices, setAdvices] = useState([
    'Do not smoke',
    'Avoid rich foods high in simple sugars.',
    'Walk for at least 1 hour every day',
  ])
  const [activeTab, setActiveTab] = useState('add')
  const [activeTestTab, setActiveTestTab] = useState('add')
  const [activeAdviceTab, setActiveAdviceTab] = useState('add')
  const [activeFollowupTab, setActiveFollowupTab] = useState('add')
  const [activeDrugsTab, setActiveDrugsTab] = useState('add')
  const [Symptoms, setSymptoms] = useState(false)
  const [Tests, setTests] = useState(false)
  const [AdviceOther, setAdviceOther] = useState(false)
  const [FollowupOther, setFollowupOther] = useState(false)
  const [Drugs, setDrugs] = useState(false)
  const [selectPatient, setSelectPatient] = useState(null)
  const [filteredPatientData, setFilteredPatientData] = useState(null)
  const [selectedAdviceToRemove, setSelectedAdviceToRemove] = useState(null)
  const [selectedFollowUpToRemove, setSelectedFollowupToRemove] = useState(null)
  const [vitalsobject, setVitals] = useState([])
  const [Diagnoses, setDiagnoses] = useState([])
  const [History, setHistory] = useState([])
  const [selectedBadges, setSelectedBadges] = useState([])
  const [selectedTests, setSelectedTests] = useState([])
  const [selectedAdvices, setSelectedAdvices] = useState([])
  const [selectedFollowups, setSelectedFollowups] = useState([])
  const [newAdvice, setNewAdvice] = useState('')
  const [newFollowup, setNewFollowup] = useState('')
  const [selectedSaltToRemove, setSelectedSaltToRemove] = useState(null)
  const [recommendedMedicines, setRecommendedMedicines] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [drugNameOptions, setDrugNameOptions] = useState([])
  const [selectedSalt, setSelectedSalt] = useState(null)
  const [newGenericName, setNewGenericName] = useState('')
  const [newDrugName, setNewDrugName] = useState('')
  const [selectedMedicine, setSelectedMedicine] = useState({
    salt: null,
    saltName: '',
    drug: null,
    drugName: '',
    dosage: ['0', '0', '0'],
    time: '',
    duration: '',
  })
  const [medicines, setMedicines] = useState([])
  const [hasEmptyFields, setHasEmptyFields] = useState(false)
  const [newSymptom, createNewSymptom] = useState(null)
  const [newTests, createNewTests] = useState(null)

  useEffect(() => {
    dispatch(fetchPatient())
    dispatch(fetchSymptoms())
    dispatch(fetchTests())
    dispatch(fetchSalts())
  }, [dispatch])

  useEffect(() => {
    if (Patients.data && selectPatient) {
      const selectedData = Patients.data.find(
        patient => patient.id === selectPatient,
      )
      setFilteredPatientData(selectedData)
    } else {
      setFilteredPatientData(null)
    }
  }, [Patients.data, selectPatient])

  useEffect(() => {
    if (selectedSalt) {
      const saltData = salts.data.find(salt => salt.id === selectedSalt)
      if (saltData) {
        const drugOptions = saltData.medicines.map(med => ({
          value: med.id,
          label: med.name,
        }))
        setDrugNameOptions(drugOptions)
      } else {
        setDrugNameOptions([])
      }
    } else {
      setDrugNameOptions([])
    }
  }, [selectedSalt, salts.data])

  const handleMedicineSelect = (salt_id, med_key, medicineName, saltName) => {
    const newMedicine = {
      salt_id: salt_id,
      medicine_id: med_key,
      name: medicineName,
      salt: saltName,
      dosage: ['0', '0', '0'],
      time: '',
      duration: '',
    }

    setRecommendedMedicines([...recommendedMedicines, newMedicine])
  }
  const handleSaltChange = selectedOption => {
    setSelectedSaltToRemove(selectedOption)
  }
  const handleBadgeClick = badge => {
    if (selectedBadges.find(item => item.id === badge.id)) {
      setSelectedBadges(selectedBadges.filter(item => item.id !== badge.id))
    } else {
      setSelectedBadges([...selectedBadges, badge])
    }
  }
  const handleAddDropdownChange = () => {
    const newBadge = newSymptom
    if (newBadge) {
      setSelectedBadges([...selectedBadges, newBadge])
      SymptomRef.current.clearValue()
    }
    createNewSymptom(null)
  }
  const handleRemoveDropdownChange = () => {
    const badgeToRemove = selectedSymptoms
    if (badgeToRemove) {
      setSelectedBadges(
        selectedBadges.filter(item => item.id !== badgeToRemove.id),
      )
    }
    setSelectedSymptoms(null)
  }
  const handleTestClick = testdata => {
    if (selectedTests.find(item => item.id === testdata.id)) {
      setSelectedTests(selectedTests.filter(item => item.id !== testdata.id))
    } else {
      setSelectedTests([...selectedTests, testdata])
    }
  }
  const handleAddDropdownTestChange = () => {
    const newTest = newTests
    if (newTest !== null) {
      setSelectedTests([...selectedTests, newTest])
    }
    setSelectedTest(null)
  }
  const handleRemoveDropdownTestChange = () => {
    const TestToRemove = selectedTest
    if (TestToRemove) {
      setSelectedTests(
        selectedTests.filter(item => item.id !== TestToRemove.id),
      )
    }
    setSelectedTest(null)
  }
  const handleAddFields = medicalIndex => {
    const updatedMedicines = [...recommendedMedicines]
    updatedMedicines[medicalIndex].dosage.push({})
    setRecommendedMedicines(updatedMedicines)
  }
  const handleRemoveField = medicalIndex => {
    const updatedMedicines = [...recommendedMedicines]
    updatedMedicines[medicalIndex].dosage.pop()
    setRecommendedMedicines(updatedMedicines)
  }
  const handleAddVitals = () => {
    setVitals([...vitalsobject, { name: '', reading: '' }])
  }
  const handleInputChange = (index, event) => {
    const newVitals = [...vitalsobject]
    newVitals[index][event.target.name] = event.target.value
    setVitals(newVitals)
  }
  const handleRemoveVital = index => {
    setVitals(vitalsobject.filter((_, i) => i !== index))
  }
  const handleAddDiagnoses = () => {
    setDiagnoses([...Diagnoses, { name: '' }])
  }
  const handleInputDiagnosesChange = (index, event) => {
    const newDiagonses = [...Diagnoses]
    newDiagonses[index][event.target.name] = event.target.value
    setDiagnoses(newDiagonses)
  }
  const handleRemoveDiagnoses = index => {
    setDiagnoses(Diagnoses.filter((_, i) => i !== index))
  }
  const handleAddHistory = () => {
    setHistory([...History, { name: '' }])
  }
  const handleInputHistoryChange = (index, event) => {
    const newHistory = [...History]
    newHistory[index][event.target.name] = event.target.value
    setHistory(newHistory)
  }
  const handleRemoveHistory = index => {
    setHistory(History.filter((_, i) => i !== index))
  }
  const handleAddAdvice = () => {
    setAdvices([...advices, newAdvice])
    setSelectedAdvices([...selectedAdvices, newAdvice])
    setNewAdvice('')
  }
  const handleAdviceClick = advice => {
    if (selectedAdvices.includes(advice)) {
      setSelectedAdvices(selectedAdvices.filter(item => item !== advice))
    } else {
      setSelectedAdvices([...selectedAdvices, advice])
    }
  }
  const handleFollowUpClick = followup => {
    if (selectedFollowups.includes(followup)) {
      setSelectedFollowups(selectedFollowups.filter(item => item !== followup))
    } else {
      setSelectedFollowups([...selectedFollowups, followup])
    }
  }
  const handleRemoveAdvice = () => {
    setSelectedAdvices(
      selectedAdvices.filter(item => item !== selectedAdviceToRemove),
    )

    setAdvices(advices.filter(item => item !== selectedAdviceToRemove))
  }
  const handleSelectedAdviceChange = e => {
    setSelectedAdviceToRemove(e.target.value)
  }
  const handleAddFollowup = () => {
    setFollowup([...followup, newFollowup])
    setSelectedFollowups([...selectedFollowups, newFollowup])
    setNewFollowup('')
  }
  const handleRemoveFollowup = () => {
    setSelectedFollowups(
      selectedFollowups.filter(item => item !== selectedFollowUpToRemove),
    )

    setFollowup(followup.filter(item => item !== selectedFollowUpToRemove))
  }
  const handleSelectedFollowupChange = e => {
    setSelectedFollowupToRemove(e.target.value)
  }
  const handleMedicineRemove = index => {
    setRecommendedMedicines(recommendedMedicines.filter((_, i) => i !== index))
  }
  const addDosage = (medicalIndex, index, value) => {
    setRecommendedMedicines(prevMeds =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          const updatedDosage = [...medicine.dosage]
          updatedDosage[index] = value
          return { ...medicine, dosage: updatedDosage }
        } else {
          return medicine
        }
      }),
    )
  }
  const addMedicineTime = (medicalIndex, value) => {
    setRecommendedMedicines(prevMeds =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          return { ...medicine, time: value }
        } else {
          return medicine
        }
      }),
    )
  }
  const addMedicineDuration = (medicalIndex, value) => {
    setRecommendedMedicines(prevMeds =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          return { ...medicine, duration: value }
        } else {
          return medicine
        }
      }),
    )
  }
  const Submit = () => {
    const patient = selectPatient
    const symptoms = selectedBadges
    const tests = selectedTests
    const vitals = vitalsobject
    const diagnoses = Diagnoses
    const histories = History
    const advices = selectedAdvices
    const followups = selectedFollowups
    const drug = recommendedMedicines

    const body = {
      patient,
      symptoms,
      tests,
      vitals,
      diagnoses,
      histories,
      advices,
      followups,
      drug,
    }

    const isEmpty = Object.entries(body).some(([key, value]) => {
      return key !== 'patient' && Array.isArray(value) && value.length === 0
    })

    if (isEmpty) {
      setHasEmptyFields(true)
      toast.error('Please fill in all required fields.')
      return
    }

    setHasEmptyFields(false)

    dispatch(createPrescription(body))
  }

  const modifiedSaltOptions = salts.data.map(item => ({
    value: item.id,
    label: item.name,
  }))

  const handleChangeNewSalt = (newValue, actionMeta) => {
    setSelectedSalt(newValue ? newValue.value : null)
    if (actionMeta.action === 'select-option') {
      setSelectedMedicine({
        ...selectedMedicine,
        salt: newValue.value,
        saltName: newValue.label,
      })
    }
    if (actionMeta.action === 'create-option') {
      setNewGenericName(newValue.value)
    }
  }

  const handleChangeDrugName = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      setSelectedMedicine({
        ...selectedMedicine,
        drug: newValue.value,
        drugName: newValue.label,
      })
    }
    if (actionMeta.action === 'create-option') {
      setNewDrugName(newValue.value)
    }
  }
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now(),
        salt: 'temp_id' || selectedMedicine.salt,
        saltName: newGenericName ? newGenericName : selectedMedicine.saltName,
        drug: 'temp_id' || selectedMedicine.drug,
        drugName: newDrugName ? newDrugName : selectedMedicine.drugName,
      },
    ])

    setSelectedMedicine({ salt: null, saltName: '', drug: null, drugName: '' })



    setNewGenericName('')
    setNewDrugName('')
    genericNameRef.current.clearValue()
    drugNameRef.current.clearValue()
  }
  const handleMedicineRemoveNonIndex = () => {
    setRecommendedMedicines(
      recommendedMedicines.filter((_, i) => i !== selectedSaltToRemove.value),
    )
    setSelectedSaltToRemove(null)
  }

  const handleChangeSymptoms = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      createNewSymptom({ id: newValue.value, name: newValue.label });
    }
    if (actionMeta.action === 'create-option') {
      createNewSymptom({ name: newValue.value });
    }
  };

  const handleChangeTests = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      createNewTests({ id: newValue.value, name: newValue.label });
    }
    if (actionMeta.action === 'create-option') {
      createNewTests({ name: newValue.value });
    }
  };

  return (
    <div className='d-flex flex-column flex-root'>
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
                              Prescriptions
                            </h3>
                          </div>
                          {/*end::Info*/}
                          {/*begin::Users*/}
                          <div className='symbol-group symbol-hover py-2'>
                            <button className='btn btn-primary'>
                              <span className='svg-icon mb-5'>
                                <PlusSVG />
                              </span>
                              New Prescription
                            </button>
                          </div>
                          {/*end::Users*/}
                        </div>
                        {/*end::Body*/}
                      </div>
                      {/*end::Head*/}
                      <div className='gutter-b'>
                        {/*begin::Body*/}
                        <div className='d-flex align-items-center justify-content-between flex-wrap py-3'>
                          {/*begin::Info*/}
                          <div className='d-flex align-items-center mr-2 py-2'>
                            <Select
                              styles={customStyles}
                              id='select-react'
                              class='form-control'
                              placeholder='Select Patient'
                              onChange={e => setSelectPatient(e.value)}
                              isLoading={Patients.status === 'loading'}
                              options={Patients.data.map(arr => ({
                                value: arr.id,
                                label: arr.first_name + ' ' + arr.last_name,
                              }))}
                            />
                          </div>
                          {/*end::Info*/}
                          {/*begin::Users*/}
                          <div className='symbol-group symbol-hover py-2'>
                            <button
                              className='btn btn-outline-warning'
                              onClick={() => Submit()}
                            >
                              <span className='svg-icon'>
                                <SaveSVG />
                              </span>
                              Save
                            </button>
                          </div>
                          {/*end::Users*/}
                        </div>
                        <div className='d-flex align-items-center justify-content-between flex-wrap'>
                          {/*begin::Info*/}

                          {/*end::Info*/}
                          {/*end::Users*/}
                        </div>
                        {/*end::Body*/}
                      </div>
                      {/*begin::Card*/}
                      <div className='card card-custom d-flex flex-grow-1'>
                        {/*begin::Body*/}
                        <div className='card-body flex-grow-1'>
                          {/*begin::Row*/}
                          <div className='row'>
                            <div
                              className='col-lg-12 patient-data'
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                              }}
                            >
                              {selectPatient === null ? (
                                <BlankPatient />
                              ) : (
                                filteredPatientData && (
                                  <>
                                    <div style={{ marginRight: '5px' }}>
                                      <span>
                                        <b>ID: </b>
                                      </span>
                                      <span>{filteredPatientData.id}</span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      <span>
                                        <b>Name: </b>
                                      </span>
                                      <span>
                                        {filteredPatientData.first_name}{' '}
                                        {filteredPatientData.last_name}
                                      </span>
                                    </div>
                                    {/* <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Age: </b>
                                      </span>
                                      <span>{filteredPatientData.age}</span>
                                    </div> */}
                                    {/* <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Mobile: </b>
                                      </span>
                                      <span>{filteredPatientData.Mobile}</span>
                                    </div> */}
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Diagnosis Date: </b>
                                      </span>
                                      <span>
                                        {moment(
                                          filteredPatientData.date_of_diagnosis,
                                        ).format('MMM DD YYYY, h:mm:a')}
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Diabetes: </b>
                                      </span>
                                      <span>
                                        {filteredPatientData.type_of_diabetes}
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Sugar level: </b>
                                      </span>
                                      <span>
                                        {filteredPatientData.blood_sugar_level}{' '}
                                        /{' '}
                                        {
                                          filteredPatientData.target_blood_sugar_level
                                        }
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Smoking Habits: </b>
                                      </span>
                                      <span>
                                        {filteredPatientData.smoking_habits}
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Alcohol Consumption: </b>
                                      </span>
                                      <span>
                                        {
                                          filteredPatientData.alcohol_consumption
                                        }
                                      </span>
                                    </div>
                                  </>
                                )
                              )}
                            </div>
                            {/*end::Col*/}
                          </div>
                          {/*end::Row*/}
                          <div className='row mt-5'>
                            <div className='col-12 col-md-6 col-lg-6'>
                              {/*start: symptoms*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <div>
                                    <h6 className='font-weight-boldest'>
                                      <span>Symptoms</span>
                                      <span
                                        onClick={() => setSymptoms(!Symptoms)}
                                        className='ml-5 svg-icon my-plus-button'
                                        title='Add or remove Symptoms'
                                      >
                                        {Symptoms ? (
                                          <span>
                                            <MinusSVG />
                                          </span>
                                        ) : (
                                          <PlusSVG />
                                        )}
                                      </span>
                                    </h6>
                                  </div>

                                  <div
                                    className='card mt-2'
                                    style={{
                                      display: Symptoms ? 'flex' : 'none',
                                    }}
                                  >
                                    <div className='card-header'>
                                      <ul className='nav nav-tabs card-header-tabs'>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('add')}
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeTab === 'remove' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveTab('remove')
                                            }
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div className='card-body'>
                                      {activeTab === 'add' ? (
                                        <div>
                                          <Creatable
                                            isClearable={true}
                                            id='Symptons-name-select'
                                            options={symptoms.data
                                              .filter(
                                                item =>
                                                  !selectedBadges
                                                    .map(badge =>
                                                      badge.name.toLowerCase(),
                                                    )
                                                    .includes(
                                                      item.name.toLowerCase(),
                                                    ),
                                              )
                                              .map(item => ({
                                                value: item.id,
                                                label: item.name,
                                              }))}
                                            onChange={handleChangeSymptoms}
                                            ref={SymptomRef}
                                            placeholder='Symptons name'
                                          />

                                          <button
                                            onClick={handleAddDropdownChange}
                                            className='btn btn-primary mt-2'
                                          >
                                            Add Symptoms
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {/* Remove dropdown */}
                                          <select
                                            className='form-select'
                                            onChange={e =>
                                              setSelectedSymptoms(
                                                selectedBadges.find(
                                                  badge =>
                                                    badge.id ===
                                                    parseInt(e.target.value),
                                                ),
                                              )
                                            }
                                          >
                                            <option>
                                              Select item to remove
                                            </option>
                                            {selectedBadges.map(badge => (
                                              <option
                                                key={badge.id}
                                                value={badge.id}
                                              >
                                                {badge.name}
                                              </option>
                                            ))}
                                          </select>
                                          <button
                                            onClick={handleRemoveDropdownChange}
                                            className='btn btn-danger mt-2'
                                          >
                                            Remove Symptoms
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className='mt-2'>
                                    {selectedBadges.length !== 0 ? (
                                      selectedBadges.map((item, key) => (
                                        <Badge
                                          key={key}
                                          onClick={() => handleBadgeClick(item)}
                                          className='m-1 cursor-pointer'
                                          pill
                                          bg={
                                            selectedBadges.some(
                                              badge => badge.id === item.id,
                                            )
                                              ? 'primary'
                                              : 'secondary'
                                          }
                                        >
                                          {item.name}
                                        </Badge>
                                      ))
                                    ) : (
                                      <div className='css-kmutc5'>
                                        <span
                                          className='MuiSkeleton-root MuiSkeleton-rounded css-2igmjn'
                                          style={{
                                            width: '20%',
                                            height: '10px',
                                          }}
                                        />
                                        <span
                                          className='MuiSkeleton-root MuiSkeleton-rounded css-2igmjn'
                                          style={{
                                            width: '10%',
                                            height: '10px',
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/*end: symptoms*/}
                              {/*start: Tests*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Tests</span>
                                    <span
                                      onClick={() => setTests(!Tests)}
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add or remove Symptoms'
                                    >
                                      {Tests ? <MinusSVG /> : <PlusSVG />}
                                    </span>
                                  </h6>
                                  <div
                                    className='card mt-2'
                                    style={{ display: Tests ? 'flex' : 'none' }}
                                  >
                                    <div className='card-header'>
                                      <ul className='nav nav-tabs card-header-tabs'>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeTestTab === 'add' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveTestTab('add')
                                            }
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeTestTab === 'remove' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveTestTab('remove')
                                            }
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div className='card-body'>
                                      {activeTestTab === 'add' ? (
                                        <div>
                                          <Creatable
                                            isClearable={true}
                                            id='Test-name-select'
                                            options={tests.data
                                              .filter(
                                                item =>
                                                  !selectedTests
                                                    .map(badge =>
                                                      badge.name.toLowerCase(),
                                                    )
                                                    .includes(
                                                      item.name.toLowerCase(),
                                                    ),
                                              )
                                              .map(item => ({
                                                value: item.id,
                                                label: item.name,
                                              }))}
                                            onChange={handleChangeTests}
                                            ref={TestsRef}
                                            placeholder='Test name'
                                          />
                                          <button
                                            onClick={
                                              handleAddDropdownTestChange
                                            }
                                            className='btn btn-primary mt-2'
                                          >
                                            Add Test
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {/* Remove dropdown */}
                                          <select
                                            className='form-select'
                                            onChange={e =>
                                              setSelectedTest(
                                                selectedTests.find(
                                                  item =>
                                                    item.id ===
                                                    parseInt(e.target.value),
                                                ),
                                              )
                                            }
                                          >
                                            <option>
                                              Select item to remove
                                            </option>
                                            {selectedTests.map(badgeTest => (
                                              <option
                                                key={badgeTest.id}
                                                value={badgeTest.id}
                                              >
                                                {badgeTest.name}
                                              </option>
                                            ))}
                                          </select>
                                          <button
                                            onClick={
                                              handleRemoveDropdownTestChange
                                            }
                                            className='btn btn-danger mt-2'
                                          >
                                            Remove Test
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className='mt-2'>
                                    {selectedTests.length !== 0 ? (
                                      selectedTests.map((item, key) => (
                                        <Badge
                                          key={key}
                                          onClick={() => handleTestClick(item)}
                                          className='m-1 cursor-pointer'
                                          pill
                                          bg={
                                            selectedTests.some(
                                              badge => badge.id === item.id,
                                            )
                                              ? 'primary'
                                              : 'secondary'
                                          }
                                        >
                                          {item.name}
                                        </Badge>
                                      ))
                                    ) : (
                                      <div className='css-kmutc5'>
                                        <span
                                          className='MuiSkeleton-root MuiSkeleton-rounded css-2igmjn'
                                          style={{
                                            width: '20%',
                                            height: '10px',
                                          }}
                                        />
                                        <span
                                          className='MuiSkeleton-root MuiSkeleton-rounded css-2igmjn'
                                          style={{
                                            width: '10%',
                                            height: '10px',
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/*end: Tests*/}
                              {/*start: Vitals*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Vitals</span>
                                    <span
                                      onClick={handleAddVitals}
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add Vitals'
                                    >
                                      <PlusSVG />
                                    </span>
                                  </h6>
                                  {vitalsobject.length === 0 ? (
                                    <div className='MuiBox-root css-0'>
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '80%', height: '10px' }}
                                      />
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '60%', height: '10px' }}
                                      />
                                    </div>
                                  ) : (
                                    vitalsobject.map((vital, index) => (
                                      <div
                                        className='wrapper d-flex mb-2'
                                        key={index}
                                      >
                                        {' '}
                                        {/* d-flex for responsiveness */}
                                        <input
                                          className='form-control me-2'
                                          type='text'
                                          name='name'
                                          placeholder='Name of vital'
                                          value={vital.name}
                                          onChange={event =>
                                            handleInputChange(index, event)
                                          }
                                        />
                                        <input
                                          className='form-control me-2'
                                          type='text'
                                          name='reading'
                                          placeholder='Reading of vital'
                                          value={vital.reading}
                                          onChange={event =>
                                            handleInputChange(index, event)
                                          }
                                        />
                                        <button
                                          className='btn svg-icon'
                                          onClick={() =>
                                            handleRemoveVital(index)
                                          }
                                        >
                                          <MinusSVG />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                              {/*end: Vitals*/}
                              {/*start: Diagnoses*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Diagnoses</span>
                                    <span
                                      onClick={handleAddDiagnoses}
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add Diagnoses'
                                    >
                                      <PlusSVG />
                                    </span>
                                  </h6>
                                  {Diagnoses.length === 0 ? (
                                    <div className='MuiBox-root css-0'>
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '80%', height: '10px' }}
                                      />
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '60%', height: '10px' }}
                                      />
                                    </div>
                                  ) : (
                                    Diagnoses.map((dia, index) => (
                                      <div
                                        className='wrapper d-flex mb-2'
                                        key={index}
                                      >
                                        {' '}
                                        {/* d-flex for responsiveness */}
                                        <input
                                          className='form-control me-2'
                                          type='text'
                                          name='name'
                                          placeholder='Write down a dianosis here'
                                          value={dia.name}
                                          onChange={event =>
                                            handleInputDiagnosesChange(
                                              index,
                                              event,
                                            )
                                          }
                                        />
                                        <button
                                          className='btn svg-icon'
                                          onClick={() =>
                                            handleRemoveDiagnoses(index)
                                          }
                                        >
                                          <MinusSVG />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                              {/*end: Diagnoses*/}
                              {/*start: Histories*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Histories</span>
                                    <span
                                      onClick={handleAddHistory}
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add History'
                                    >
                                      <PlusSVG />
                                    </span>
                                  </h6>
                                  {History.length === 0 ? (
                                    <div className='MuiBox-root css-0'>
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '80%', height: '10px' }}
                                      />
                                      <span
                                        className='MuiSkeleton-root MuiSkeleton-text css-gwx6oe'
                                        style={{ width: '60%', height: '10px' }}
                                      />
                                    </div>
                                  ) : (
                                    History.map((history, index) => (
                                      <div
                                        className='wrapper d-flex mb-2'
                                        key={index}
                                      >
                                        {' '}
                                        {/* d-flex for responsiveness */}
                                        <input
                                          className='form-control me-2'
                                          type='text'
                                          name='name'
                                          placeholder='Write down a history here'
                                          value={history.name}
                                          onChange={event =>
                                            handleInputHistoryChange(
                                              index,
                                              event,
                                            )
                                          }
                                        />
                                        <button
                                          className='btn svg-icon'
                                          onClick={() =>
                                            handleRemoveHistory(index)
                                          }
                                        >
                                          <MinusSVG />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                              {/*end: Histories*/}
                            </div>
                            <div className='col-12 col-md-6 col-lg-6'>
                              {/*start: Medications*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>
                                    Medications
                                  </h6>
                                  {recommendedMedicines.length === 0 ? (
                                    <BlackMedicine />
                                  ) : (
                                    recommendedMedicines.map(
                                      (medicine, medicalIndex) => (
                                        <div
                                          className='medical-row'
                                          key={medicalIndex}
                                        >
                                          <div>
                                            <div className='d-flex justify-content-between'>
                                              <div
                                                id='medicine-name'
                                                className='float-right'
                                              >
                                                {medicalIndex + 1}.{' '}
                                                {medicine.name} ({medicine.salt}
                                                )
                                              </div>
                                              <div
                                                id='remove-id'
                                                className='svg-icon my-plus-button ml-auto text-right'
                                                style={{ cursor: 'pointer' }}
                                                title='remove medication'
                                                onClick={() =>
                                                  handleMedicineRemove(
                                                    medicalIndex,
                                                  )
                                                }
                                              >
                                                <MinusSVG />
                                              </div>
                                            </div>
                                          </div>

                                          <div className='binary-input-container'>
                                            <div className='d-flex flex-nowrap align-items-center'>
                                              {medicine.dosage.map(
                                                (field, index) => (
                                                  <div
                                                    className='input-group'
                                                    key={index}
                                                    style={{ width: '30px' }}
                                                  >
                                                    <input
                                                      type='text'
                                                      className='form-control binary-input m-0 p-0'
                                                      maxLength='1'
                                                      placeholder='0'
                                                      onChange={e =>
                                                        addDosage(
                                                          medicalIndex,
                                                          index,
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                ),
                                              )}
                                              <div className='d-flex flex-column align-items-center mt-1 '>
                                                <div className='row p-0 m-0'>
                                                  <div
                                                    className={
                                                      medicine.dosage.length > 3
                                                        ? 'col-6 p-0 m-0'
                                                        : 'col-0 p-0 m-0'
                                                    }
                                                  >
                                                    {medicine.dosage.length >
                                                      3 && (
                                                        <button
                                                          onClick={() =>
                                                            handleRemoveField(
                                                              medicalIndex,
                                                            )
                                                          }
                                                          className='btn svg-icon my-plus-button m-0 p-0'
                                                          title='remove dose'
                                                        >
                                                          <MinusSVG />
                                                        </button>
                                                      )}
                                                  </div>
                                                  <div
                                                    className={
                                                      medicine.dosage.length > 3
                                                        ? 'col-6 p-0 m-0'
                                                        : 'col-12 p-0 m-0'
                                                    }
                                                  >
                                                    {medicine.dosage.length <
                                                      6 && (
                                                        <button
                                                          onClick={() =>
                                                            handleAddFields(
                                                              medicalIndex,
                                                            )
                                                          }
                                                          className='btn svg-icon my-plus-button m-0 p-0'
                                                          title='add dosge'
                                                        >
                                                          <PlusSVG />
                                                        </button>
                                                      )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className='mt-2'>
                                              <select
                                                onChange={e =>
                                                  addMedicineTime(
                                                    medicalIndex,
                                                    e.target.value,
                                                  )
                                                }
                                                className='form-select'
                                              >
                                                <option
                                                  value='-1'
                                                  disabled
                                                  selected
                                                >
                                                  Select time
                                                </option>
                                                <option>After meal</option>
                                                <option>
                                                  30 minutes after meal
                                                </option>
                                                <option>
                                                  30 minutes before meal
                                                </option>
                                                <option>Before meal</option>
                                                <option>Anytime</option>
                                                <option> With a meal</option>
                                              </select>
                                            </div>
                                            <div className='mt-2'>
                                              <select
                                                onChange={e =>
                                                  addMedicineDuration(
                                                    medicalIndex,
                                                    e.target.value,
                                                  )
                                                }
                                                className='form-select'
                                              >
                                                <option
                                                  value='-1'
                                                  disabled
                                                  selected
                                                >
                                                  Select duration
                                                </option>
                                                <option>1 month</option>
                                                <option>Continued</option>
                                                <option>7 days</option>
                                                <option>10 days</option>
                                                <option>14 days</option>
                                                <option>15 days</option>
                                                <option>20 days</option>
                                                <option>21 days</option>
                                                <option>30 days</option>
                                                <option>2 months</option>
                                                <option>3 months</option>
                                                <option>6 months</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )
                                  )}
                                </div>
                              </div>
                              {/*end: Medications*/}
                              {/*start: Advices & Follow-up*/}
                              <div className='row my-4'>
                                <div className='col-12 col-md-6 col-lg-6'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Advice</span>
                                    <span
                                      onClick={() =>
                                        setAdviceOther(!AdviceOther)
                                      }
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add or remove Symptoms'
                                    >
                                      {AdviceOther ? <MinusSVG /> : <PlusSVG />}
                                    </span>
                                  </h6>

                                  <div
                                    className='card mt-2'
                                    style={{
                                      display: AdviceOther ? 'flex' : 'none',
                                    }}
                                  >
                                    <div className='card-header'>
                                      <ul className='nav nav-tabs card-header-tabs'>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeAdviceTab === 'add' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveAdviceTab('add')
                                            }
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeAdviceTab === 'remove' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveAdviceTab('remove')
                                            }
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div className='card-body'>
                                      {activeAdviceTab === 'add' ? (
                                        <div>
                                          {/* Add option form */}
                                          <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Add Item'
                                            value={newAdvice}
                                            onChange={e =>
                                              setNewAdvice(e.target.value)
                                            }
                                          />
                                          <button
                                            onClick={handleAddAdvice}
                                            className='btn btn-primary mt-2'
                                          >
                                            Add Advice
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {/* Remove dropdown */}
                                          <select
                                            className='form-select'
                                            onChange={
                                              handleSelectedAdviceChange
                                            }
                                          >
                                            <option>
                                              Select item to remove
                                            </option>
                                            {selectedAdvices.map(
                                              (advice, index) => (
                                                <option
                                                  key={index}
                                                  value={advice}
                                                >
                                                  {advice}
                                                </option>
                                              ),
                                            )}
                                          </select>
                                          <button
                                            className='btn btn-danger mt-2'
                                            onClick={handleRemoveAdvice}
                                          >
                                            Remove Advice
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className='mt-2'>
                                    {advices.map((advice, index) => (
                                      <Badge
                                        key={index}
                                        className='m-1 cursor-pointer'
                                        pill
                                        bg={
                                          selectedAdvices.includes(advice)
                                            ? 'primary'
                                            : 'secondary'
                                        }
                                        onClick={() =>
                                          handleAdviceClick(advice)
                                        }
                                      >
                                        {advice}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className='col-12 col-lg-6 col-lg-6'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Follow-up</span>
                                    <span
                                      onClick={() =>
                                        setFollowupOther(!FollowupOther)
                                      }
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add or remove followup'
                                    >
                                      {FollowupOther ? (
                                        <MinusSVG />
                                      ) : (
                                        <PlusSVG />
                                      )}
                                    </span>
                                  </h6>

                                  <div
                                    className='card mt-2'
                                    style={{
                                      display: FollowupOther ? 'flex' : 'none',
                                    }}
                                  >
                                    <div className='card-header'>
                                      <ul className='nav nav-tabs card-header-tabs'>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeFollowupTab === 'add' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveFollowupTab('add')
                                            }
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeFollowupTab === 'remove' ? 'active' : ''}`}
                                            onClick={() =>
                                              setActiveFollowupTab('remove')
                                            }
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      </ul>
                                    </div>

                                    <div className='card-body'>
                                      {activeFollowupTab === 'add' ? (
                                        <div>
                                          {/* Add option form */}
                                          <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Add Item'
                                            value={newFollowup}
                                            onChange={e =>
                                              setNewFollowup(e.target.value)
                                            }
                                          />
                                          <button
                                            onClick={handleAddFollowup}
                                            className='btn btn-primary mt-2'
                                          >
                                            Add followup
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          {/* Remove dropdown */}
                                          <select
                                            className='form-select'
                                            onChange={
                                              handleSelectedFollowupChange
                                            }
                                          >
                                            <option>
                                              Select item to remove
                                            </option>
                                            {selectedFollowups.map(
                                              (advice, index) => (
                                                <option
                                                  key={index}
                                                  value={advice}
                                                >
                                                  {advice}
                                                </option>
                                              ),
                                            )}
                                          </select>
                                          <button
                                            className='btn btn-danger mt-2'
                                            onClick={handleRemoveFollowup}
                                          >
                                            Remove followup
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className='mt-2'>
                                    {followup.map((advice, index) => (
                                      <Badge
                                        key={index}
                                        className='m-1 cursor-pointer'
                                        pill
                                        bg={
                                          selectedFollowups.includes(advice)
                                            ? 'primary'
                                            : 'secondary'
                                        }
                                        onClick={() =>
                                          handleFollowUpClick(advice)
                                        }
                                      >
                                        {advice}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/*end: Advices*/}
                              {/*start: Drugs*/}
                              <Fragment>
                                <div className='row my-4'>
                                  <div className='col-12'>
                                    <h6 className='font-weight-boldest'>
                                      <span>Drugs</span>
                                      <span
                                        onClick={() => setDrugs(!Drugs)}
                                        className='ml-5 svg-icon my-plus-button'
                                        title='Add or remove Symptoms'
                                      >
                                        {Drugs ? <MinusSVG /> : <PlusSVG />}
                                      </span>
                                    </h6>
                                    <div
                                      className='card mt-5'
                                      style={{
                                        display: Drugs ? 'flex' : 'none',
                                      }}
                                    >
                                      <div className='card-header'>
                                        <ul className='nav nav-tabs card-header-tabs'>
                                          <li className='nav-item'>
                                            <button
                                              className={`nav-link ${activeDrugsTab === 'add' ? 'active' : ''}`}
                                              onClick={() =>
                                                setActiveDrugsTab('add')
                                              }
                                            >
                                              Add
                                            </button>
                                          </li>
                                          <li className='nav-item'>
                                            <button
                                              className={`nav-link ${activeFollowupTab === 'remove' ? 'active' : ''}`}
                                              onClick={() =>
                                                setActiveDrugsTab('remove')
                                              }
                                            >
                                              Remove
                                            </button>
                                          </li>
                                        </ul>
                                      </div>

                                      <div className='card-body'>
                                        {activeDrugsTab === 'add' ? (
                                          <div>
                                            <Creatable
                                              isClearable={true}
                                              id='Generic-name-select'
                                              options={modifiedSaltOptions}
                                              onChange={handleChangeNewSalt}
                                              ref={genericNameRef}
                                              placeholder='Generic name'
                                            />

                                            <Creatable
                                              isClearable={true}
                                              id='Drug-name-select'
                                              options={drugNameOptions}
                                              onChange={handleChangeDrugName}
                                              ref={drugNameRef}
                                              placeholder='Drug name'
                                              className='my-2'
                                            />

                                            <button
                                              className='btn btn-primary mt-2'
                                              onClick={addMedicine}
                                            >
                                              Add Medicine
                                            </button>
                                          </div>
                                        ) : (
                                          <div>
                                            <Select
                                              options={recommendedMedicines.map(
                                                (medicine, medicalIndex) => ({
                                                  value: medicalIndex,
                                                  label: `${medicalIndex + 1}. ${medicine.name} ${medicine.salt}`,
                                                }),
                                              )}
                                              onChange={handleSaltChange}
                                              value={selectedSaltToRemove}
                                              placeholder='Select item to remove'
                                            />
                                            <button
                                              className='btn btn-danger mt-2'
                                              onClick={
                                                handleMedicineRemoveNonIndex
                                              }
                                            >
                                              Remove Medicine
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className='d-flex flex-wrap'>
                                  {salts.data.slice(0, 4).map((salt, key) => (
                                    <DropdownButton
                                      key={key}
                                      title={salt.name}
                                      className='m-1'
                                      variant='outline-primary'
                                    >
                                      {salt.medicines.map((med, med_key) => (
                                        <Dropdown.Item
                                          key={med_key}
                                          onClick={() =>
                                            handleMedicineSelect(
                                              salt.id,
                                              med.id,
                                              med.name,
                                              salt.name,
                                            )
                                          }
                                        >
                                          {med.name}
                                        </Dropdown.Item>
                                      ))}
                                    </DropdownButton>
                                  ))}

                                  {medicines.map((item, key) => (
                                    <DropdownButton
                                      key={key}
                                      title={item.saltName}
                                      className='m-1'
                                    >
                                      <Dropdown.Item
                                        onClick={() =>
                                          handleMedicineSelect(
                                            item.salt,
                                            item.drug,
                                            item.saltName,
                                            item.drugName,
                                          )
                                        }
                                      >
                                        {item.drugName}
                                      </Dropdown.Item>
                                    </DropdownButton>
                                  ))}
                                </div>
                              </Fragment>
                              {/*end: Drugs*/}
                            </div>
                          </div>
                        </div>
                        {/*end::Body*/}
                      </div>
                      {/*end::Card*/}
                    </div>
                  </div>
                  {/*end::List*/}
                </div>
              </div>
              {/*end::Container*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Prescription;