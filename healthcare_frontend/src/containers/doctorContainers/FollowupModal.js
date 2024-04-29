import { Modal, Button, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import moment from 'moment';
import MinusSVG from '../../assets/SVGS/MinusSVG';
import PlusSVG from '../../assets/SVGS/PlusSVG';
import BlackMedicine from './BlackMedicine';
import { Fragment, useEffect, useRef, useState } from 'react';
import Creatable from 'react-select/creatable';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatient } from '../../features/patient/fetchPatients';
import { fetchSymptoms } from '../../features/prescription/SymptomsSlice';
import { fetchTests } from '../../features/prescription/TestsSlice';
import { fetchSalts } from '../../features/prescription/SaltSlice';
import { updatePrescription } from '../../features/prescription/PrescriptionSlice';


/**
 * This modal component for managing a patient's follow-up session.
 * 
 * This modal allows for the addition, removal, and update of various patient-related data including symptoms,
 * tests, vitals, diagnoses, histories, medications, advice, and follow-up plans. It integrates various interactive
 * elements like dropdowns, inputs, and badges to handle user interactions.
 *
 * Key Features:
 * - Dynamic form inputs for adding new data or updating existing data including symptoms, tests, vitals, and more.
 * - Utilises Creatable and Select components from 'react-select' for enhanced dropdown functionalities.
 * - Dispatches actions to fetch initial data and submit updates using Redux async thunks.
 * - Provides visual feedback and interactivity using badges for selectable items and react-hot-toast notifications.
 *
 *
 */


const FollowupModal = ({ item, show, onHide }) => {
  const dispatch = useDispatch();
  const now = new Date();
  const SymptomRef = useRef(null);
  const TestsRef = useRef(null);

  const genericNameRef = useRef(null);
  const drugNameRef = useRef(null);
  const symptoms = useSelector((state) => state.Symptoms);
  const tests = useSelector((state) => state.Tests);
  const salts = useSelector((state) => state.Salts);
  const MAX_DEFAULT_BADGES = 4;
  const [Tests, setTests] = useState(false);
  const [Symptoms, setSymptoms] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState('add');
  const [activeTab, setActiveTab] = useState('add');
  const [AdviceOther, setAdviceOther] = useState(false);
  const [followup, setFollowup] = useState([
    {
      id: 'F1',
      name: 'Meet after 1 month',
    },
    {
      id: 'F2',
      name: 'Meet after 2 month',
    },
    {
      id: 'F3',
      name: 'Meet after 3 month',
    },
  ]);
  const [advices, setAdvices] = useState([
    {
      id: 'A1',
      name: 'Do not smoke',
    },
    {
      id: 'A2',
      name: 'Avoid rich foods',
    },
    {
      id: 'A3',
      name: 'Walk 1 hour everyday',
    },
  ]);
  const [Drugs, setDrugs] = useState(false);
  const [activeDrugsTab, setActiveDrugsTab] = useState('add');
  const [newDrugName, setNewDrugName] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [existingSymptoms, setExistingSymptoms] = useState(item.Symptoms);
  const [selectedSymptoms, setSelectedSymptoms] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState(
    existingSymptoms.map((symptom) => ({
      id: symptom.id,
      name: symptom.name,
    })),
  );
  const [existingTests, setExistingTests] = useState(item.Tests);
  const [selectedTest, setSelectedTest] = useState(null);
  const [TestBadges, setTestBadges] = useState(
    existingTests.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  );
  const [activeAdviceTab, setActiveAdviceTab] = useState('add');
  const [activeFollowupTab, setActiveFollowupTab] = useState('add');
  const [existingVitals, setExistingVitals] = useState(item.Vitals);
  const [Diagnoses, setDiagnoses] = useState(item.Diagnoses);
  const [History, setHistory] = useState(item.Histories);
  const [newAdvice, setNewAdvice] = useState('');
  const [newFollowup, setNewFollowup] = useState('');
  const [selectedAdvices, setSelectedAdvices] = useState(item.Advices);
  const [selectedFollowups, setSelectedFollowups] = useState(item.FollowUps);
  const [selectedAdviceToRemove, setSelectedAdviceToRemove] = useState(null);
  const [FollowupOther, setFollowupOther] = useState(false);
  const [selectedFollowUpToRemove, setSelectedFollowupToRemove] = useState(null);
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [newGenericName, setNewGenericName] = useState('');
  const [drugNameOptions, setDrugNameOptions] = useState([]);
  const [existingAdvice, setExistingAdvice] = useState(item.Advices);
  const [existingfollowup, setExistingfollowup] = useState(item.FollowUps);
  const [selectedMedicine, setSelectedMedicine] = useState({
    salt: null,
    saltName: '',
    drug: null,
    drugName: '',
    dosage: ['0', '0', '0'],
    time: '',
    duration: '',
  });
  const [selectedSaltToRemove, setSelectedSaltToRemove] = useState(null);
  const [recommendedMedicines, setRecommendedMedicines] = useState([]);
  const [newSymptom, createNewSymptom] = useState(null);
  const [newTests, createNewTests] = useState(null);

  const mergeMedicines = (backendDrugs, existingRecommended) => {
    const recommendedMap = new Map(existingRecommended.map((med) => [med.medicine_id, med])); // Index for efficiency

    const mergedMedicines = backendDrugs.map((drug) => {
      const existingEntry = recommendedMap.get(drug.Medical_name.id);

      return existingEntry
        ? { ...existingEntry, dosage: parseDosage(drug.dosage) } // Update dosage if it exists
        : {
            salt_id: drug.Medical_name.salt.id,
            medicine_id: drug.Medical_name.id,
            name: drug.Medical_name.name,
            salt: drug.Medical_name.salt.name,
            dosage: parseDosage(drug.dosage),
            frequency: drug.frequency,
            duration: drug.duration,
          };
    });

    return mergedMedicines;
  };
  const parseDosage = (dosageString) => {
    if (!dosageString) return dosageString;
    return dosageString
      .split('')
      .filter((char) => char.match(/\d/))
      .map(Number);
  };

  useEffect(() => {
    dispatch(fetchPatient());
    dispatch(fetchSymptoms());
    dispatch(fetchTests());
    dispatch(fetchSalts());
  }, [dispatch]);

  useEffect(() => {
    const combinedAdviceMap = new Map(); // Use a Map for efficient lookups by ID
    existingAdvice.forEach((advice) => combinedAdviceMap.set(advice.id, advice));
    advices.forEach((advice) => {
      if (!combinedAdviceMap.has(advice.id)) {
        combinedAdviceMap.set(advice.id || combinedAdviceMap.size, advice);
      }
    });
    const combinedAdvice = Array.from(combinedAdviceMap.values());
    setAdvices(combinedAdvice);
  }, [existingAdvice]);

  useEffect(() => {
    const combinedAdviceMap = new Map(); // Use a Map for efficient lookups by ID
    existingfollowup.forEach((advice) => combinedAdviceMap.set(advice.id, advice));
    followup.forEach((advice) => {
      if (!combinedAdviceMap.has(advice.id)) {
        combinedAdviceMap.set(advice.id || combinedAdviceMap.size, advice);
      }
    });
    const combinedAdvice = Array.from(combinedAdviceMap.values());
    setFollowup(combinedAdvice);
  }, [existingfollowup]);

  useEffect(() => {
    // Assuming 'item' comes from props or state, and it might change
    if (item && item.Drug) {
      const updatedRecommendedMedicines = mergeMedicines(item.Drug, recommendedMedicines);
      setRecommendedMedicines(updatedRecommendedMedicines);
    }
  }, [item]);

  const handleAddDropdownChange = () => {
    if (newSymptom) {
      setSelectedBadges((prevBadges) => [...prevBadges, newSymptom]);
      createNewSymptom(null);
      SymptomRef.current.clearValue();
    }
  };
  const handleRemoveDropdownChange = () => {
    const badgeToRemove = selectedSymptoms;
    if (badgeToRemove) {
      setSelectedBadges(selectedBadges.filter((item) => item.id !== badgeToRemove.id));
    }
    setSelectedSymptoms(null);
  };
  const handleBadgeClick = (badge) => {
    if (selectedBadges.find((item) => item.id === badge.id)) {
      setSelectedBadges(selectedBadges.filter((item) => item.id !== badge.id));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };
  const sortedBadges = [
    ...selectedBadges.filter((item) => existingSymptoms.some((exItem) => exItem.id === item.id)),
    ...selectedBadges.filter((item) => !existingSymptoms.some((exItem) => exItem.id === item.id)),
  ];

  const handleAddDropdownTestChange = () => {
    if (newTests) {
      setTestBadges((prevBadges) => [...prevBadges, newTests]);
      createNewTests(null);
      TestsRef.current.clearValue();
    }
  };
  const handleRemoveDropdownTestChange = () => {
    const badgeToRemove = selectedTest;
    if (badgeToRemove) {
      setTestBadges(TestBadges.filter((item) => item.id !== badgeToRemove.id));
    }
    setSelectedTest(null);
  };
  const handleTestClick = (badge) => {
    if (TestBadges.find((item) => item.id === badge.id)) {
      setTestBadges(TestBadges.filter((item) => item.id !== badge.id));
    } else {
      setTestBadges([...TestBadges, badge]);
    }
  };
  const sortedTest = [
    ...TestBadges.filter((item) => existingTests.some((exItem) => exItem.id === item.id)),
    ...TestBadges.filter((item) => !existingTests.some((exItem) => exItem.id === item.id)),
  ];

  const handleAddVitals = () => {
    setExistingVitals([...existingVitals, { name: '', reading: '' }]);
  };
  const handleInputChange = (index, event) => {
    setExistingVitals((prevVitals) =>
      prevVitals.map((vital, i) =>
        i === index ? { ...vital, [event.target.name]: event.target.value } : vital,
      ),
    );
  };
  const handleRemoveVital = (index) => {
    setExistingVitals(existingVitals.filter((_, i) => i !== index));
  };

  const handleAddDiagnoses = () => {
    setDiagnoses([...Diagnoses, { name: '' }]);
  };
  const handleInputDiagnosesChange = (index, event) => {
    setDiagnoses((prevVitals) =>
      prevVitals.map((vital, i) =>
        i === index ? { ...vital, [event.target.name]: event.target.value } : vital,
      ),
    );
  };
  const handleRemoveDiagnoses = (index) => {
    setDiagnoses(Diagnoses.filter((_, i) => i !== index));
  };

  const handleAddHistory = () => {
    setHistory([...History, { name: '' }]);
  };
  const handleInputHistoryChange = (index, event) => {
    setHistory((prevVitals) =>
      prevVitals.map((vital, i) =>
        i === index ? { ...vital, [event.target.name]: event.target.value } : vital,
      ),
    );
  };
  const handleRemoveHistory = (index) => {
    setHistory(History.filter((_, i) => i !== index));
  };

  const handleSelectedAdviceChange = (e) => {
    setSelectedAdviceToRemove(e.target.value);
  };
  const handleAdviceClick = (advice) => {
    if (selectedAdvices.includes(advice)) {
      setSelectedAdvices(selectedAdvices.filter((item) => item !== advice));
    } else {
      setSelectedAdvices([...selectedAdvices, advice]);
    }
  };
  const handleAddAdvice = () => {
    const newAdviceObj = { id: now.getUTCMilliseconds(), name: newAdvice };
    setSelectedAdvices([...selectedAdvices, newAdviceObj]);
    setAdvices([...followup, newAdviceObj]);
    setNewAdvice('');
  };
  const handleRemoveAdvice = () => {
    if (selectedAdviceToRemove) {
      setSelectedAdvices(selectedAdvices.filter((item) => item.id != selectedAdviceToRemove));

      setAdvices(advices.filter((item) => item.id != selectedAdviceToRemove));
      setSelectedAdviceToRemove(null);
    }
  };

  const handleSelectedFollowupChange = (e) => {
    setSelectedFollowupToRemove(e.target.value);
  };
  const handleFollowUpClick = (followup) => {
    if (selectedFollowups.includes(followup)) {
      setSelectedFollowups(selectedFollowups.filter((item) => item !== followup));
    } else {
      setSelectedFollowups([...selectedFollowups, followup]);
    }
  };
  const handleAddFollowup = () => {
    const newAdviceObj = { id: now.getUTCMilliseconds(), name: newFollowup };
    setSelectedFollowups([...selectedFollowups, newAdviceObj]);
    setFollowup([...followup, newAdviceObj]);
    setNewFollowup('');
  };
  const handleRemoveFollowup = () => {
    if (selectedFollowUpToRemove) {
      setSelectedFollowups(selectedFollowups.filter((item) => item.id != selectedFollowUpToRemove));
      setFollowup(followup.filter((item) => item.id != selectedFollowUpToRemove));
      setSelectedFollowupToRemove(null);
    }
  };

  const modifiedSaltOptions = salts.data.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const handleChangeNewSalt = (newValue, actionMeta) => {
    setSelectedSalt(newValue ? newValue.value : null);
    if (actionMeta.action === 'select-option') {
      setSelectedMedicine({
        ...selectedMedicine,
        salt: newValue.value,
        saltName: newValue.label,
      });
    }
    if (actionMeta.action === 'create-option') {
      setNewGenericName(newValue.value);
    }
  };
  const handleChangeDrugName = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      setSelectedMedicine({
        ...selectedMedicine,
        drug: newValue.value,
        drugName: newValue.label,
      });
    }
    if (actionMeta.action === 'create-option') {
      setNewDrugName(newValue.value);
    }
  };
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
    ]);

    setSelectedMedicine({ salt: null, saltName: '', drug: null, drugName: '' });
    setNewGenericName('');
    setNewDrugName('');
    genericNameRef.current.clearValue();
    drugNameRef.current.clearValue();
  };
  const handleSaltChange = (selectedOption) => {
    setSelectedSaltToRemove(selectedOption);
  };
  const handleMedicineSelect = (salt_id, med_key, medicineName, saltName) => {
    const newMedicine = {
      salt_id: salt_id,
      medicine_id: med_key,
      name: medicineName,
      salt: saltName,
      dosage: ['0', '0', '0'],
      time: '',
      duration: '',
    };

    setRecommendedMedicines([...recommendedMedicines, newMedicine]);
  };
  const handleMedicineRemove = (index) => {
    setRecommendedMedicines(recommendedMedicines.filter((_, i) => i !== index));
  };
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
  const handleRemoveField = (medicalIndex) => {
    const updatedMedicines = [...recommendedMedicines];
    updatedMedicines[medicalIndex].dosage.pop();
    setRecommendedMedicines(updatedMedicines);
  };
  const handleAddFields = (medicalIndex) => {
    const updatedMedicines = [...recommendedMedicines];
    updatedMedicines[medicalIndex].dosage.push('0');
    setRecommendedMedicines(updatedMedicines);
  };
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

  const Submit = () => {
    const symptoms = selectedBadges;
    const tests = TestBadges;
    const vitals = existingVitals;
    const diagnoses = Diagnoses;
    const histories = History;
    const drug = recommendedMedicines;
    const advices = selectedAdvices;
    const followups = selectedFollowups;
    const patient = item.patient.id;
    const id = item.id;
    const body = {
      id,
      patient,
      symptoms,
      tests,
      vitals,
      diagnoses,
      histories,
      advices,
      followups,
      drug,
    };
    console.log(body);
    dispatch(updatePrescription(body));
  };
  const handleMedicineRemoveNonIndex = () => {
    setRecommendedMedicines(
      recommendedMedicines.filter((_, i) => i !== selectedSaltToRemove.value),
    );
    setSelectedSaltToRemove(null);
  };

  const handleChangeSymptoms = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      createNewSymptom({ id: newValue.value, name: newValue.label });
    }
    if (actionMeta.action === 'create-option') {
      createNewSymptom({ id: now.getUTCMilliseconds(), name: newValue.value });
    }
  };

  const handleChangeTests = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      createNewTests({ id: newValue.value, name: newValue.label });
    }
    if (actionMeta.action === 'create-option') {
      createNewTests({ id: now.getUTCMilliseconds(), name: newValue.value });
    }
  };

  return (
    <Modal className='modal-xlx' centered show={show} size='xl' onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {item.patient.first_name} {item.patient.last_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='card card-custom d-flex flex-grow-1'>
          {/*begin::Body*/}
          <div className='card-body flex-grow-1'>
            {/*begin::Row*/}
            <div className='row'>
              <div className='col-lg-12 patient-data' style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ marginRight: '5px' }}>
                  <span>
                    <b>ID: </b>
                  </span>
                  <span>{item.patient.id}</span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  <span>
                    <b>Name: </b>
                  </span>
                  <span>
                    {item.patient.first_name} {item.patient.last_name}
                  </span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Age: </b>
                  </span>
                  <span>{item.patient.age}</span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Mobile: </b>
                  </span>
                  <span>{item.patient.Mobile}</span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Diagnosis Date: </b>
                  </span>
                  <span>{moment(item.patient.date_of_diagnosis).format('MMM DD YY, h:mm a')}</span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Diabetes: </b>
                  </span>
                  <span>
                    {item.patient.type_of_diabetes ? item.patient.type_of_diabetes : 'N/A'}
                  </span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Sugar level: </b>
                  </span>
                  <span>
                    {item.patient.blood_sugar_level ? item.patient.blood_sugar_level : 'N/A'} /{' '}
                    {item.patient.target_blood_sugar_level
                      ? item.patient.target_blood_sugar_level
                      : 'N/A'}
                  </span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Smoking Habits: </b>
                  </span>
                  <span>{item.patient.smoking_habits ? item.patient.smoking_habits : 'N/A'}</span>
                </div>
                <div style={{ marginRight: '5px' }}>
                  {' '}
                  <span>
                    <b>Alcohol Consumption: </b>
                  </span>
                  <span>
                    {item.patient.alcohol_consumption ? item.patient.alcohol_consumption : 'N/A'}
                  </span>
                </div>
              </div>
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
                          {Symptoms ? <MinusSVG /> : <PlusSVG />}
                        </span>
                      </h6>
                    </div>

                    <div className='card mt-2' style={{ display: Symptoms ? 'flex' : 'none' }}>
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
                        selectedBadges.length > MAX_DEFAULT_BADGES ? (
                          sortedBadges
                            .filter((item) => selectedBadges.some((badge) => badge.id === item.id))
                            .map((item, key) => (
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
                          sortedBadges.slice(0, MAX_DEFAULT_BADGES).map((item, key) => (
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
                        )
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
                    <div className='card mt-2' style={{ display: Tests ? 'flex' : 'none' }}>
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
                              id='test-name-select'
                              options={tests.data
                                .filter(
                                  (item) =>
                                    !TestBadges.map((badge) => badge.name.toLowerCase()).includes(
                                      item.name.toLowerCase(),
                                    ),
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
                                  TestBadges.find((item) => item.id === parseInt(e.target.value)),
                                )
                              }
                            >
                              <option>Select item to remove</option>
                              {TestBadges.map((badgeTest) => (
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
                      {TestBadges.length > MAX_DEFAULT_BADGES
                        ? sortedTest
                            .filter((item) => TestBadges.some((test) => test.id === item.id))
                            .map((item, key) => (
                              <Badge
                                key={key}
                                onClick={() => handleTestClick(item)}
                                className='m-1 cursor-pointer'
                                pill
                                bg={
                                  TestBadges.some((test) => test.id === item.id)
                                    ? 'primary'
                                    : 'secondary'
                                }
                              >
                                {item.name}
                              </Badge>
                            ))
                        : sortedTest.slice(0, MAX_DEFAULT_BADGES).map((item, key) => (
                            <Badge
                              key={key}
                              onClick={() => handleTestClick(item)}
                              className='m-1 cursor-pointer'
                              pill
                              bg={
                                TestBadges.some((test) => test.id === item.id)
                                  ? 'primary'
                                  : 'secondary'
                              }
                            >
                              {item.name}
                            </Badge>
                          ))}
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
                    {existingVitals.length === 0 ? (
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
                      existingVitals.map((vital, index) => (
                        <div className='wrapper d-flex mb-2' key={index}>
                          {' '}
                          {/* d-flex for responsiveness */}
                          <input
                            className='form-control me-2'
                            type='text'
                            name='name'
                            placeholder='Name of vital'
                            value={vital.name}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                          <input
                            className='form-control me-2'
                            type='text'
                            name='reading'
                            placeholder='Reading of vital'
                            value={vital.reading}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                          <button className='btn svg-icon' onClick={() => handleRemoveVital(index)}>
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
                        <div className='wrapper d-flex mb-2' key={index}>
                          {' '}
                          {/* d-flex for responsiveness */}
                          <input
                            className='form-control me-2'
                            type='text'
                            name='name'
                            placeholder='Write down a dianosis here'
                            value={dia.name}
                            onChange={(event) => handleInputDiagnosesChange(index, event)}
                          />
                          <button
                            className='btn svg-icon'
                            onClick={() => handleRemoveDiagnoses(index)}
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
                        <div className='wrapper d-flex mb-2' key={index}>
                          {' '}
                          {/* d-flex for responsiveness */}
                          <input
                            className='form-control me-2'
                            type='text'
                            name='name'
                            placeholder='Write down a history here'
                            value={history.name}
                            onChange={(event) => handleInputHistoryChange(index, event)}
                          />
                          <button
                            className='btn svg-icon'
                            onClick={() => handleRemoveHistory(index)}
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
                                <div className='input-group' key={index} style={{ width: '30px' }}>
                                  <input
                                    type='text'
                                    className='form-control binary-input m-0 p-0'
                                    maxLength='1'
                                    value={field}
                                    onChange={(e) => addDosage(medicalIndex, index, e.target.value)}
                                  />
                                </div>
                              ))}
                              <div className='d-flex flex-column align-items-center mt-1 '>
                                <div className='row p-0 m-0'>
                                  <div
                                    className={
                                      medicine.dosage.length > 3 ? 'col-6 p-0 m-0' : 'col-0 p-0 m-0'
                                    }
                                  >
                                    {medicine.dosage.length > 3 && (
                                      <button
                                        onClick={() => handleRemoveField(medicalIndex)}
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
                                defaultValue={medicine.frequency !== '' ? medicine.frequency : '-1'}
                                onChange={(e) => addMedicineTime(medicalIndex, e.target.value)}
                                className='form-select'
                              >
                                <option value='-1' disabled>
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
                                defaultValue={medicine.duration !== '' ? medicine.duration : '-1'}
                                onChange={(e) => addMedicineDuration(medicalIndex, e.target.value)}
                                className='form-select'
                              >
                                <option value='-1' disabled>
                                  Select duration
                                </option>
                                <option>1 month</option>
                                <option>Continued</option>
                                <option>7 days</option>
                                <option>14 days</option>
                                <option>20 days</option>
                                <option>2 months</option>
                                <option>3 months</option>
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

                    <div className='card mt-2' style={{ display: AdviceOther ? 'flex' : 'none' }}>
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
                            <button onClick={handleAddAdvice} className='btn btn-primary mt-2'>
                              Add Advice
                            </button>
                          </div>
                        ) : (
                          <div>
                            {/* Remove dropdown */}
                            <select className='form-select' onChange={handleSelectedAdviceChange}>
                              <option>Select item to remove</option>
                              {selectedAdvices.map((advice, index) => (
                                <option key={index} value={advice.id}>
                                  {advice.name}
                                </option>
                              ))}
                            </select>
                            <button className='btn btn-danger mt-2' onClick={handleRemoveAdvice}>
                              Remove Advice
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='mt-2'>
                      {advices.map((advice, index) => (
                        <Badge
                          key={advice.id} // Using ID for the key
                          className='m-1 cursor-pointer'
                          pill
                          bg={
                            selectedAdvices.some((selected) => selected.id === advice.id)
                              ? 'primary'
                              : 'secondary'
                          }
                          onClick={() => handleAdviceClick(advice)}
                        >
                          {advice.name}
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
                            <button onClick={handleAddFollowup} className='btn btn-primary mt-2'>
                              Add followup
                            </button>
                          </div>
                        ) : (
                          <div>
                            {/* Remove dropdown */}
                            <select className='form-select' onChange={handleSelectedFollowupChange}>
                              <option>Select item to remove</option>
                              {selectedFollowups.map((advice, index) => (
                                <option key={index} value={advice.id}>
                                  {advice.name}
                                </option>
                              ))}
                            </select>
                            <button className='btn btn-danger mt-2' onClick={handleRemoveFollowup}>
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
                            selectedFollowups.some((selected) => selected.id === advice.id)
                              ? 'primary'
                              : 'secondary'
                          }
                          onClick={() => handleFollowUpClick(advice)}
                        >
                          {advice.name}
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
                                onClick={() => setActiveDrugsTab('add')}
                              >
                                Add
                              </button>
                            </li>
                            <li className='nav-item'>
                              <button
                                className={`nav-link ${activeFollowupTab === 'remove' ? 'active' : ''}`}
                                onClick={() => setActiveDrugsTab('remove')}
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

                              <button className='btn btn-primary mt-2' onClick={addMedicine}>
                                Add Medicine
                              </button>
                            </div>
                          ) : (
                            <div>
                              <Select
                                options={recommendedMedicines.map((medicine, medicalIndex) => ({
                                  value: medicalIndex,
                                  label: `${medicalIndex + 1}. ${medicine.name} ${medicine.salt}`,
                                }))}
                                onChange={handleSaltChange}
                                value={selectedSaltToRemove}
                                placeholder='Select item to remove'
                              />
                              <button
                                className='btn btn-danger mt-2'
                                onClick={handleMedicineRemoveNonIndex}
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
                              handleMedicineSelect(salt.id, med.id, med.name, salt.name)
                            }
                          >
                            {med.name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    ))}

                    {medicines.map((item, key) => (
                      <DropdownButton key={key} title={item.saltName} className='m-1'>
                        <Dropdown.Item
                          onClick={() =>
                            handleMedicineSelect(item.salt, item.drug, item.saltName, item.drugName)
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onHide}>
          Close
        </Button>
        <Button variant='outline-success' onClick={Submit}>
          Update Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowupModal;
