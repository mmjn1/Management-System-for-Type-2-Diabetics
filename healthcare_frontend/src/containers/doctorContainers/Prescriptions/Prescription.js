import Select from 'react-select';
import { Fragment, useEffect, useRef, useState } from 'react';
import BlankPatient from './BlankPatient';
import { Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import PlusSVG from '../../../assets/SVGS/PlusSVG';
import MinusSVG from '../../../assets/SVGS/MinusSVG';
import SaveSVG from '../../../assets/SVGS/SaveSVG';
import { fetchPatient } from '../../../features/patient/fetchPatients';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { fetchSymptoms } from '../../../features/prescription/SymptomsSlice';
import { fetchTests } from '../../../features/prescription/TestsSlice';
import { fetchSalts } from '../../../features/prescription/SaltSlice';
import BlackMedicine from './BlackMedicine';
import { createPrescription } from '../../../features/prescription/PrescriptionSlice';
import Creatable from 'react-select/creatable';
import { toast } from 'react-hot-toast';
import { Typography } from '@mui/material';


const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '200%',
  }),
  option: (provided, state) => ({
    ...provided,

    width: '100%',
  }),
  menu: (provided) => ({
    ...provided,
    width: '200%',
  }),
};

/**
 * The `Prescription` component enables users, specifically doctors, to create, manage,
 * and submit patient prescriptions. It connects to several Redux slices to fetch
 * necessary data such as patients, symptoms, tests, and medication salts. The component provides an interactive UI
 * for selecting a patient and specifying prescription details including symptoms, tests, vitals,
 * diagnoses, patient history, advices, follow-ups, and drugs.
 *
 * Effects:
 * - Utilizes `useEffect` hooks to fetch necessary data on component mount and to perform
 *   actions based on certain state changes.
 *
 * Critical Functions:
 * - `handleMedicineSelect`: Manages the selection of medicines for the prescription.
 * - `handleInputChange`: Handles changes to the vitals input fields.
 * - `Submit`: Compiles and dispatches the prescription data, includes validation to ensure no fields are empty.
 * - `handleChangeNewSalt`, `handleChangeDrugName`: Manage the selection and creation of new salts and drug names in the creatable select inputs.
 * - `addMedicine`: Adds a new medicine to the prescription list.
 * - `handleMedicineRemoveNonIndex`: Removes a selected medicine based on a specific identifier such as a unique ID or name.
 *
 * This component is designed for use within a doctor's dashboard, where they can efficiently manage patient prescriptions.
 */

const Prescription = () => {
  const dispatch = useDispatch();
  const now = new Date();

  const genericNameRef = useRef(null);
  const drugNameRef = useRef(null);
  const SymptomRef = useRef(null);
  const TestsRef = useRef(null);

  const Patients = useSelector((state) => state.PatientSlice);
  const symptoms = useSelector((state) => state.Symptoms);
  const tests = useSelector((state) => state.Tests);
  const salts = useSelector((state) => state.Salts);
  const [followup, setFollowup] = useState([
    'Meet after 1 month',
    'Meet after 2 month',
    'Meet after 3 month',
  ]);
  const [advices, setAdvices] = useState([
    'Do not smoke',
    'Avoid rich foods',
    'Walk 1 hour everyday',
  ]);
  const [activeTab, setActiveTab] = useState('add');
  const [activeTestTab, setActiveTestTab] = useState('add');
  const [activeAdviceTab, setActiveAdviceTab] = useState('add');
  const [activeFollowupTab, setActiveFollowupTab] = useState('add');
  const [Symptoms, setSymptoms] = useState(false);
  const [Tests, setTests] = useState(false);
  const [AdviceOther, setAdviceOther] = useState(false);
  const [FollowupOther, setFollowupOther] = useState(false);
  const [Drugs, setDrugs] = useState(false);
  const [selectPatient, setSelectPatient] = useState(null);
  const [filteredPatientData, setFilteredPatientData] = useState(null);
  const [selectedAdviceToRemove, setSelectedAdviceToRemove] = useState(null);
  const [selectedFollowUpToRemove, setSelectedFollowupToRemove] = useState(null);
  const [vitalsobject, setVitals] = useState([]);
  const [Diagnoses, setDiagnoses] = useState([]);
  const [History, setHistory] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedAdvices, setSelectedAdvices] = useState([]);
  const [selectedFollowups, setSelectedFollowups] = useState([]);
  const [newAdvice, setNewAdvice] = useState('');
  const [newFollowup, setNewFollowup] = useState('');
  const [selectedSaltToRemove, setSelectedSaltToRemove] = useState(null);
  const [recommendedMedicines, setRecommendedMedicines] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [drugNameOptions, setDrugNameOptions] = useState([]);
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState({
    salt: null,
    saltName: '',
    drug: null,
    drugName: '',
    dosage: ['0', '0', '0'],
    time: '',
    duration: '',
  });
  const [medicines, setMedicines] = useState([]);
  const [hasEmptyFields, setHasEmptyFields] = useState(false);
  const [newSymptom, createNewSymptom] = useState(null);
  const [newTests, createNewTests] = useState(null);
  const [modifiedSaltOptions, setModifiedSaltOptions] = useState(null);

  /**
   * This useEffect is responsible for fetching initial data required for the prescription form.
   * It dispatches actions to fetch lists of patients, symptoms, tests, and salts from the backend.
   * These fetch operations are essential to populate form selections and ensure the form has
   * all necessary data for a comprehensive prescription entry.
   *
   * The useEffect depends on the `dispatch` function, meaning it will re-run only if the
   * `dispatch` function changes, which typically does not change over the component's lifecycle.
   */
  useEffect(() => {
    dispatch(fetchPatient());
    dispatch(fetchSymptoms());
    dispatch(fetchTests());
    dispatch(fetchSalts());
  }, [dispatch]);

  /**
   * This useEffect listens for changes in `Patients.data` or `selectPatient` to set the filtered patient data.
   * When a patient is selected (`selectPatient`), it searches through the `Patients.data` array to find
   * a patient object whose `id` matches `selectPatient`. If found, it updates the `filteredPatientData` state
   * with this patient's data, which is used to display or process patient-specific information in the UI.
   * If no patient is selected or the patient is not found, it sets `filteredPatientData` to null.
   *
   * This hook is crucial for dynamically updating the UI based on the user's patient selection,
   * ensuring that the displayed data is always synchronized with the selected patient.
   */
  useEffect(() => {
    if (Patients.data && selectPatient) {
      const selectedData = Patients.data.find((patient) => patient.id === selectPatient);
      setFilteredPatientData(selectedData);
    } else {
      setFilteredPatientData(null);
    }
  }, [Patients.data, selectPatient]);


  /**
   * Updates `drugNameOptions` based on the selected salt.
   * 
   * This useEffect hook triggers when `selectedSalt` or `salts.data` changes. It finds the salt data
   * corresponding to `selectedSalt` and maps its medicines to dropdown options. If no salt is selected
   * or found, it sets `drugNameOptions` to an empty array.
   * 
   * This ensures the dropdown displays correct medicine options for the selected salt, improving form accuracy.
   */
  useEffect(() => {
    if (selectedSalt) {
      const saltData = salts.data.find((salt) => salt.id === selectedSalt);
      if (saltData) {
        const drugOptions = saltData.medicines.map((med) => ({
          value: med.id,
          label: med.name,
        }));
        setDrugNameOptions(drugOptions);
      } else {
        setDrugNameOptions([]);
      }
    } else {
      setDrugNameOptions([]);
    }
  }, [selectedSalt, salts.data]);


  /**
   * Handles the selection of a medicine by creating a new medicine object and adding it to the list of recommended medicines.
   * 
   * This function is triggered when a medicine is selected in the UI. It constructs a new medicine object with initial
   * default values for dosage, time, and duration, and then appends this object to the `recommendedMedicines` state array.
   * 
   * @param {string} salt_id - The ID of the salt associated with the medicine.
   * @param {string} med_key - The unique key or ID for the selected medicine.
   * @param {string} medicineName - The name of the selected medicine.
   * @param {string} saltName - The name of the salt associated with the medicine.
   */
  const handleMedicineSelect = (salt_id, med_key, medicineName, saltName) => {
    const newMedicine = {
      salt_id: salt_id,
      medicine_id: med_key,
      name: medicineName,
      salt: saltName,
      dosage: ['0', '0', '0'], // Default dosage values
      time: '', // Default time (not specified)
      duration: '', // Default duration (not specified)
    };

    setRecommendedMedicines([...recommendedMedicines, newMedicine]);
  };



  /**
   * Toggles the selection state of a badge based on its current state.
   * If the badge is already selected, it will be removed from the selectedBadges array.
   * If it is not selected, it will be added to the selectedBadges array.
   * 
   * @param {object} badge - The badge object to be toggled.
   */
  const handleBadgeClick = (badge) => {
    if (selectedBadges.find((item) => item.id === badge.id)) {
      setSelectedBadges(selectedBadges.filter((item) => item.id !== badge.id));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  /**
   * Handles the addition of a new badge from the dropdown.
   * This function adds a new badge (symptom) to the selectedBadges array and clears the dropdown input.
   */
  const handleAddDropdownChange = () => {
    const newBadge = newSymptom;
    if (newBadge) {
      setSelectedBadges([...selectedBadges, newBadge]);
      SymptomRef.current.clearValue();
    }
    createNewSymptom(null);
  };

  /**
   * Handles the removal of a badge from the dropdown.
   * This function removes a selected badge (symptom) from the selectedBadges array.
   */
  const handleRemoveDropdownChange = () => {
    const badgeToRemove = selectedSymptoms;
    if (badgeToRemove) {
      setSelectedBadges(selectedBadges.filter((item) => item.id !== badgeToRemove.id));
    }
    setSelectedSymptoms(null);
  };

  /**
   * Toggles the selection state of a test based on its current state.
   * If the test is already selected, it will be removed from the selectedTests array.
   * If it is not selected, it will be added to the selectedTests array.
   * 
   * @param {object} testdata - The test data object to be toggled.
   */
  const handleTestClick = (testdata) => {
    if (selectedTests.find((item) => item.id === testdata.id)) {
      setSelectedTests(selectedTests.filter((item) => item.id !== testdata.id));
    } else {
      setSelectedTests([...selectedTests, testdata]);
    }
  };

  /**
   * Adds a new test to the selectedTests state array from the newTests state.
   * This function is triggered when a new test is selected from the dropdown.
   * It also resets the newTests state to null after adding the test.
   */
  const handleAddDropdownTestChange = () => {
    const newTest = newTests;
    if (newTest !== null) {
      setSelectedTests([...selectedTests, newTest]);
    }
    setSelectedTest(null);
  };

  /**
   * Removes a selected test from the selectedTests state array.
   * This function is triggered when a test needs to be removed, typically from a UI interaction.
   * It filters out the test to be removed based on its id and updates the state.
   */
  const handleRemoveDropdownTestChange = () => {
    const TestToRemove = selectedTest;
    if (TestToRemove) {
      setSelectedTests(selectedTests.filter((item) => item.id !== TestToRemove.id));
    }
    setSelectedTest(null);
  };

  /**
   * Adds a new dosage field to a specific medicine entry within the recommendedMedicines array.
   * This function is called when a new dosage needs to be added to a medicine, identified by its index.
   * It updates the recommendedMedicines state with the new dosage added to the specified medicine.
   */
  const handleAddFields = (medicalIndex) => {
    const updatedMedicines = [...recommendedMedicines];
    updatedMedicines[medicalIndex].dosage.push({});
    setRecommendedMedicines(updatedMedicines);
  };

  /**
   * Removes the last dosage field from a specific medicine entry within the recommendedMedicines array.
   * This function is called when the last dosage needs to be removed from a medicine, identified by its index.
   * It updates the recommendedMedicines state by removing the last dosage from the specified medicine.
   */
  const handleRemoveField = (medicalIndex) => {
    const updatedMedicines = [...recommendedMedicines];
    updatedMedicines[medicalIndex].dosage.pop();
    setRecommendedMedicines(updatedMedicines);
  };

  /**
   * Adds a new advice to the advices state and updates the selected advices.
   * This function also resets the newAdvice state to an empty string after adding.
   */
  const handleAddAdvice = () => {
    setAdvices([...advices, newAdvice]);
    setSelectedAdvices([...selectedAdvices, newAdvice]);
    setNewAdvice('');
  };

  /**
   * Toggles the selection state of an advice.
   * If the advice is already selected, it is removed from the selectedAdvices state;
   * otherwise, it is added to the selectedAdvices state.
   * @param {string} advice - The advice to toggle in the selected advices list.
   */
  const handleAdviceClick = (advice) => {
    if (selectedAdvices.includes(advice)) {
      setSelectedAdvices(selectedAdvices.filter((item) => item !== advice));
    } else {
      setSelectedAdvices([...selectedAdvices, advice]);
    }
  };

  /**
   * Toggles the selection state of a follow-up.
   * If the follow-up is already selected, it is removed from the selectedFollowups state;
   * otherwise, it is added to the selectedFollowups state.
   * @param {string} followup - The follow-up to toggle in the selected follow-ups list.
   */
  const handleFollowUpClick = (followup) => {
    if (selectedFollowups.includes(followup)) {
      setSelectedFollowups(selectedFollowups.filter((item) => item !== followup));
    } else {
      setSelectedFollowups([...selectedFollowups, followup]);
    }
  };

  /**
   * Removes the currently selected advice from both the advices and selectedAdvices states.
   */
  const handleRemoveAdvice = () => {
    setSelectedAdvices(selectedAdvices.filter((item) => item !== selectedAdviceToRemove));
    setAdvices(advices.filter((item) => item !== selectedAdviceToRemove));
  };

  /**
   * Updates the state of selectedAdviceToRemove based on user input from a form element.
   * @param {object} e - The event object from the form input.
   */
  const handleSelectedAdviceChange = (e) => {
    setSelectedAdviceToRemove(e.target.value);
  };

  const handleAddFollowup = () => {
    setFollowup([...followup, newFollowup]);
    setSelectedFollowups([...selectedFollowups, newFollowup]);
    setNewFollowup('');
  };

  /**
   * Removes a follow-up from both the selectedFollowups and followup states.
   * This function identifies the follow-up to be removed by using the value stored in selectedFollowUpToRemove.
   */
  const handleRemoveFollowup = () => {
    setSelectedFollowups(selectedFollowups.filter((item) => item !== selectedFollowUpToRemove));
    setFollowup(followup.filter((item) => item !== selectedFollowUpToRemove));
  };

  /**
   * Updates the state of selectedFollowupToRemove based on user input from a form element.
   * This function captures the value from an event object and sets it as the new value for selectedFollowupToRemove.
   * @param {object} e - The event object from the form input.
   */
  const handleSelectedFollowupChange = (e) => {
    setSelectedFollowupToRemove(e.target.value);
  };

  /**
   * Removes a specific medicine from the recommendedMedicines state based on its index.
   * This function filters out the medicine at the specified index, effectively removing it from the list.
   * @param {number} index - The index of the medicine to remove from the recommendedMedicines list.
   */
  const handleMedicineRemove = (index) => {
    setRecommendedMedicines(recommendedMedicines.filter((_, i) => i !== index));
  };

  /**
   * Updates the dosage for a specific medicine in the recommended medicines list.
   * 
   * This function takes the index of the medicine in the recommended medicines list,
   * the specific dosage index to update, and the new dosage value. It then updates the
   * dosage array for that specific medicine without altering other properties or other medicines.
   *
   * @param {number} medicalIndex - The index of the medicine in the recommended medicines list.
   * @param {number} index - The index of the dosage in the medicine's dosage array to update.
   * @param {string} value - The new dosage value to set at the specified index.
   */
  const addDosage = (medicalIndex, index, value) => {
    setRecommendedMedicines((prevMeds) =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          const updatedDosage = [...medicine.dosage];
          updatedDosage[index] = value;
          return { ...medicine, dosage: updatedDosage };
        } else {
          return medicine;
        }
      }),
    );
  };

  /**
   * Updates the time of administration for a specific medicine in the recommended medicines list.
   * 
   * This function takes the index of the medicine in the recommended medicines list and the new time
   * value. It updates the 'time' property of the specified medicine to the new value provided,
   * without altering other properties or other medicines in the list.
   *
   * @param {number} medicalIndex - The index of the medicine in the recommended medicines list.
   * @param {string} value - The new time value to set for the medicine.
   */
  const addMedicineTime = (medicalIndex, value) => {
    setRecommendedMedicines((prevMeds) =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          return { ...medicine, time: value };
        } else {
          return medicine;
        }
      }),
    );
  };

  /**
   * Updates the duration of medication for a specific medicine in the recommended medicines list.
   * 
   * This function takes the index of the medicine in the recommended medicines list (`medicalIndex`)
   * and the new duration value (`value`). It updates the 'duration' property of the specified medicine
   * to the new value provided, without altering other properties or other medicines in the list.
   *
   * @param {number} medicalIndex - The index of the medicine in the recommended medicines list.
   * @param {string} value - The new duration value to set for the medicine.
   */
  const addMedicineDuration = (medicalIndex, value) => {
    setRecommendedMedicines((prevMeds) =>
      prevMeds.map((medicine, medIndex) => {
        if (medIndex === medicalIndex) {
          return { ...medicine, duration: value };
        } else {
          return medicine;
        }
      }),
    );
  };

  /**
   * Submits the prescription form data to the backend.
   * 
   * This function gathers all the prescription-related information from the state,
   * constructs a payload, and dispatches an action to create a prescription in the backend.
   * 
   * It checks for any empty required fields (except 'patient') and displays an error if any are found.
   * If all required fields are filled, it proceeds to dispatch the prescription creation action.
   */
  const Submit = () => {
    const patient = selectPatient;
    const symptoms = selectedBadges;
    const tests = selectedTests;
    const advices = selectedAdvices;
    const followups = selectedFollowups;
    const drug = recommendedMedicines;

    const body = {
      patient,
      symptoms,
      tests,
      advices,
      followups,
      drug,
    };

    // This function checks if any of the fields in the 'body' object (except for 'patient')
    // are arrays and are empty.
    const isEmpty = Object.entries(body).some(([key, value]) => {
      return key !== 'patient' && Array.isArray(value) && value.length === 0;
    });

    if (isEmpty) {
      setHasEmptyFields(true);
      toast.error('Please fill in all required fields.');
      return;
    }

    setHasEmptyFields(false);

    dispatch(createPrescription(body));
  };

  /**
   * useEffect hook to transform salts data into a format suitable for a select input component.
   * 
   * This hook listens for changes in `salts.data` and updates `modifiedSaltOptions` state.
   * Each salt item is transformed into an object with `value` and `label` properties,
   * which are used by select input components for display and selection tracking.
   * 
   * This transformation is necessary to interface the raw salt data from the Redux store
   * with a third-party select component that expects items in a specific format.
   */
  useEffect(() => {
    const modifiedSaltOptions = salts.data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setModifiedSaltOptions(modifiedSaltOptions);
  }, [salts.data]);




  /**
   * Handles changes in the symptoms selection. It creates a new symptom entry based on the user's selection or input.
   * If the user selects an existing symptom, it creates a symptom with an ID and name.
   * If the user inputs a new symptom (not in the list), it creates a symptom with just the name.
   */
  const handleChangeSymptoms = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      createNewSymptom({ id: newValue.value, name: newValue.label });
    }
    if (actionMeta.action === 'create-option') {
      createNewSymptom({ name: newValue.value });
    }
  };

  /**
   * Handles changes in the tests selection similar to symptoms. It creates a new test entry based on the user's selection or input.
   * If the user selects an existing test, it creates a test with an ID and name.
   * If the user inputs a new test (not in the list), it creates a test with just the name.
   */
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
                          <Typography variant="h5" gutterBottom>
                            Prescriptions

                          </Typography>

                          {/*end::Info*/}
                          {/*begin::Users*/}
                          <div className='symbol-group symbol-hover py-2'>
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
                              onChange={(e) => setSelectPatient(e.value)}
                              isLoading={Patients.status === 'loading'}
                              options={Patients.data.map((arr) => ({
                                value: arr.id,
                                label: arr.first_name + ' ' + arr.last_name,
                              }))}
                            />
                          </div>
                          {/*end::Info*/}
                          {/*begin::Users*/}
                          <div className='symbol-group symbol-hover py-2'>
                            <button className='btn btn-outline-warning' onClick={() => Submit()}>
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
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Age: </b>
                                      </span>
                                      <span>{filteredPatientData.age}</span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Mobile: </b>
                                      </span>
                                      <span>{filteredPatientData.Mobile}</span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Diagnosis Date: </b>
                                      </span>
                                      <span>
                                        {moment(filteredPatientData.date_of_diagnosis).format(
                                          'MMM DD YYYY, h:mm:ss a',
                                        )}
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Diabetes: </b>
                                      </span>
                                      <span>{filteredPatientData.type_of_diabetes}</span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Sugar level: </b>
                                      </span>
                                      <span>
                                        {filteredPatientData.blood_sugar_level} /{' '}
                                        {filteredPatientData.target_blood_sugar_level}
                                      </span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Smoking Habits: </b>
                                      </span>
                                      <span>{filteredPatientData.smoking_habits}</span>
                                    </div>
                                    <div style={{ marginRight: '5px' }}>
                                      {' '}
                                      <span>
                                        <b>Alcohol Consumption: </b>
                                      </span>
                                      <span>{filteredPatientData.alcohol_consumption}</span>
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
                                            onClick={() => setActiveTab('remove')}
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
                                                (item) =>
                                                  !selectedBadges
                                                    .map((badge) => badge.name.toLowerCase())
                                                    .includes(item.name.toLowerCase()),
                                              )
                                              .map((item) => ({
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
                                            onChange={(e) =>
                                              setSelectedSymptoms(
                                                selectedBadges.find(
                                                  (badge) => badge.id === parseInt(e.target.value),
                                                ),
                                              )
                                            }
                                          >
                                            <option>Select item to remove</option>
                                            {selectedBadges.map((badge) => (
                                              <option key={badge.id} value={badge.id}>
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
                                            selectedBadges.some((badge) => badge.id === item.id)
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
                                            onClick={() => setActiveTestTab('add')}
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeTestTab === 'remove' ? 'active' : ''}`}
                                            onClick={() => setActiveTestTab('remove')}
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
                                                (item) =>
                                                  !selectedTests
                                                    .map((badge) => badge.name.toLowerCase())
                                                    .includes(item.name.toLowerCase()),
                                              )
                                              .map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                              }))}
                                            onChange={handleChangeTests}
                                            ref={TestsRef}
                                            placeholder='Test name'
                                          />
                                          <button
                                            onClick={handleAddDropdownTestChange}
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
                                            onChange={(e) =>
                                              setSelectedTest(
                                                selectedTests.find(
                                                  (item) => item.id === parseInt(e.target.value),
                                                ),
                                              )
                                            }
                                          >
                                            <option>Select item to remove</option>
                                            {selectedTests.map((badgeTest) => (
                                              <option key={badgeTest.id} value={badgeTest.id}>
                                                {badgeTest.name}
                                              </option>
                                            ))}
                                          </select>
                                          <button
                                            onClick={handleRemoveDropdownTestChange}
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
                                            selectedTests.some((badge) => badge.id === item.id)
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
                             
                       
                            </div>
                            <div className='col-12 col-md-6 col-lg-6'>
                              {/*start: Medications*/}
                              <div className='row my-4'>
                                <div className='col-12'>
                                  <h6 className='font-weight-boldest'>Medications</h6>
                                  {recommendedMedicines.length === 0 ? (
                                    <BlackMedicine />
                                  ) : (
                                    recommendedMedicines.map((medicine, medicalIndex) => (
                                      <div className='medical-row' key={medicalIndex}>
                                        <div>
                                          <div className='d-flex justify-content-between'>
                                            <div id='medicine-name' className='float-right'>
                                              {medicalIndex + 1}. {medicine.name} ({medicine.salt})
                                            </div>
                                            <div
                                              id='remove-id'
                                              className='svg-icon my-plus-button ml-auto text-right'
                                              style={{ cursor: 'pointer' }}
                                              title='remove medication'
                                              onClick={() => handleMedicineRemove(medicalIndex)}
                                            >
                                              <MinusSVG />
                                            </div>
                                          </div>
                                        </div>

                                        <div className='binary-input-container'>
                                          <div className='d-flex flex-nowrap align-items-center'>
                                            {medicine.dosage.map((field, index) => (
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
                                                  onChange={(e) =>
                                                    addDosage(medicalIndex, index, e.target.value)
                                                  }
                                                />
                                              </div>
                                            ))}
                                            <div className='d-flex flex-column align-items-center mt-1 '>
                                              <div className='row p-0 m-0'>
                                                <div
                                                  className={
                                                    medicine.dosage.length > 3
                                                      ? 'col-6 p-0 m-0'
                                                      : 'col-0 p-0 m-0'
                                                  }
                                                >
                                                  {medicine.dosage.length > 3 && (
                                                    <button
                                                      onClick={() =>
                                                        handleRemoveField(medicalIndex)
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
                                                  {medicine.dosage.length < 6 && (
                                                    <button
                                                      onClick={() => handleAddFields(medicalIndex)}
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
                                              onChange={(e) =>
                                                addMedicineTime(medicalIndex, e.target.value)
                                              }
                                              className='form-select'
                                            >
                                              <option value='-1' disabled selected>
                                                Select time
                                              </option>
                                              <option>After meal</option>
                                              <option>30 minutes after meal</option>
                                              <option>30 minutes before meal</option>
                                              <option>Before meal</option>
                                              <option>anytime</option>
                                            </select>
                                          </div>
                                          <div className='mt-2'>
                                            <select
                                              onChange={(e) => addMedicineDuration(medicalIndex, e.target.value)}
                                              className='form-select'
                                            >
                                              <option value='' disabled selected>Select duration</option>
                                              <option value='30'>1 month</option>
                                              <option value='7'>7 days</option>
                                              <option value='14'>14 days</option>
                                              <option value='20'>20 days</option>
                                              <option value='28'>4 weeks</option>
                                              <option value='42'>6 weeks</option>
                                              <option value='60'>2 months</option>
                                              <option value='90'>3 months</option>
                                              <option value='180'>6 months</option>
                                              <option value='365'>1 year</option>
                                              <option value='9999'>Continued</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                              {/*end: Medications*/}
                              {/*start: Advices & Follow-up*/}
                              <div className='row my-4'>
                                <div className='col-12 col-md-6 col-lg-6'>
                                  <h6 className='font-weight-boldest'>
                                    <span>Advices</span>
                                    <span
                                      onClick={() => setAdviceOther(!AdviceOther)}
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
                                            onClick={() => setActiveAdviceTab('add')}
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeAdviceTab === 'remove' ? 'active' : ''}`}
                                            onClick={() => setActiveAdviceTab('remove')}
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
                                            onChange={(e) => setNewAdvice(e.target.value)}
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
                                            onChange={handleSelectedAdviceChange}
                                          >
                                            <option>Select item to remove</option>
                                            {selectedAdvices.map((advice, index) => (
                                              <option key={index} value={advice}>
                                                {advice}
                                              </option>
                                            ))}
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
                                          selectedAdvices.includes(advice) ? 'primary' : 'secondary'
                                        }
                                        onClick={() => handleAdviceClick(advice)}
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
                                      onClick={() => setFollowupOther(!FollowupOther)}
                                      className='ml-5 svg-icon my-plus-button'
                                      title='Add or remove followup'
                                    >
                                      {FollowupOther ? <MinusSVG /> : <PlusSVG />}
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
                                            onClick={() => setActiveFollowupTab('add')}
                                          >
                                            Add
                                          </button>
                                        </li>
                                        <li className='nav-item'>
                                          <button
                                            className={`nav-link ${activeFollowupTab === 'remove' ? 'active' : ''}`}
                                            onClick={() => setActiveFollowupTab('remove')}
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
                                            onChange={(e) => setNewFollowup(e.target.value)}
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
                                            onChange={handleSelectedFollowupChange}
                                          >
                                            <option>Select item to remove</option>
                                            {selectedFollowups.map((advice, index) => (
                                              <option key={index} value={advice}>
                                                {advice}
                                              </option>
                                            ))}
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
                                        onClick={() => handleFollowUpClick(advice)}
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

                                      >

                                      </span>
                                    </h6>
                                    <div
                                      className='card mt-5'
                                      style={{
                                        display: Drugs ? 'flex' : 'none',
                                      }}
                                    >
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
                                      drop='up-centered'
                                      key={key}
                                      title={item.saltName}
                                      className='m-1'
                                    >
                                      {item.drugs.map((drug, drug_key) => (
                                        <Dropdown.Item
                                          key={drug_key}
                                          onClick={() =>
                                            handleMedicineSelect(
                                              item.salt,
                                              drug.drug,
                                              drug.drugName,
                                              item.saltName,
                                            )
                                          }
                                        >
                                          {drug.drugName}
                                        </Dropdown.Item>
                                      ))}
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
  );
};

export default Prescription;