import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, getIn } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { toast } from 'react-hot-toast';
import Select from 'react-select';


/**
 * A component for creating or editing forms.
 * 
 * This component lets users build or update forms, like questionnaires doctors might use. It allows adding multiple sections with various types of questions, including text inputs, passwords, choices (like dropdowns, checkboxes, or radio buttons), and more. Users can set up questions and choices as needed. The form setup is flexible, supporting an array of sections and questions, each customizable for different needs.
 * 
 * For editing, the component fetches existing form details using a form ID from the URL and fills in the form for modifications. When saving, it handles both creating new forms or updating existing ones, ensuring data is correctly formatted for the backend. It also provides navigation back to the forms list and feedback through toast messages on successful saves or errors.
 * 
 * To use, simply navigate to the component route with or without a form ID. The interface guides through adding or editing form details, with validation to ensure required fields are completed before submission.
 * 
 */


const formValidationSchema = Yup.object().shape({
  formName: Yup.string().required('Form name is required'),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Section name is required'),
        form_fields: Yup.array()
          .of(
            Yup.object().shape({
              label: Yup.string().required('Field label is required'),
              field_type: Yup.string().required('Field type is required'),
              choices: Yup.array().when('field_type', (field_type, schema) => {
                return ['radio', 'checkbox', 'select'].includes(field_type)
                  ? schema.of(Yup.string().required('Choice option is required')).min(1, 'At least one choice is required')
                  : schema.nullable().notRequired();
              }),
            })
          )
          .min(1, 'At least one field is required'),
      })
    )
    .min(1, 'At least one section is required'),
});


const CreateForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [initialValues, setInitialValues] = useState({
    formName: '',
    sections: [{
      name: '',
      form_fields: [{
        label: '',
        field_type: '',
        choices: [],
      }],
    }],
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/patients/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setPatients(response.data.map(patient => ({
          value: patient.id,
          label: `${patient.first_name} ${patient.last_name}`,
        })));
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const { formId } = useParams();
  useEffect(() => {

    const getFormData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`/api/forms/${formId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const { name, sections, patient } = response.data;

        // Transform sections to fit into the form structure
        const transformedSections = sections.map(section => ({
          name: section.name,
          form_fields: section.form_fields.map(field => ({
            label: field.label,
            field_type: field.field_type,
            choices: field.choices ? field.choices.map(choice => choice.choice_text) : [],
          })),
        }));

        setInitialValues({
          formName: name,
          sections: transformedSections,
        });

        // Fetch the patient details if a patient ID is present in the form data
        if (patient) {
          const patientResponse = await axios.get(`/api/patient-records/${patient}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // Set the selected patient's state which will be used by the Select component
          setSelectedPatient({
            value: patientResponse.data.id,
            label: `${patientResponse.data.first_name} ${patientResponse.data.last_name}`,
          });
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    if (formId) {
      getFormData();
    }
  }, [formId]);




  const handleSubmit = (values) => {
    const doctorId = localStorage.getItem('id');


    const formattedSections = values.sections.map(section => ({
      ...section,
      form_fields: section.form_fields.map(field => {
        if (['radio', 'checkbox', 'select', 'text', 'password',].includes(field.field_type)) {
          let formattedChoices = [];
          if (Array.isArray(field.choices) && field.choices.length) {
            formattedChoices = field.choices.map(choice => ({
              choice_text: choice
            }));
          }
          return {
            ...field,
            choices: formattedChoices,
          };
        }
        const { choices, ...fieldWithoutChoices } = field;
        return fieldWithoutChoices;
      }),
    }));

    const data = {
      name: values.formName,
      doctor: doctorId,
      patient: selectedPatient?.value, 
      sections: formattedSections,
    };

    if (formId) {
      axios.put(`/api/forms/${formId}/`, data).then((response) => {
        toast.success('Form Updated Successfully');
        navigate("/doctor/custom-forms");
      });

    } else {
      axios.post(`/api/forms/`, data).then((response) => {
        toast.success('Form Created Successfully');
        navigate("/doctor/custom-forms");

      }).catch((error) => {
        console.error("Error creating form:", error.response ? error.response.data : error);
        toast.error('Error creating form');
      });
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex">
        <div className="me-auto">
          <h1>{formId ? "Edit Form" : "Create Form"}</h1> <br />
        </div>
        <div className="">
          <Link to={"/doctor/custom-forms"} className="btn btn-outline-primary">
            View all Forms
          </Link>
        </div>
      </div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, touched, errors }) => (
          <Form onSubmit={handleSubmit}>

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="patientSelect">Select Patient</label>
                <Select
                  id="patientSelect"
                  options={patients}
                  value={selectedPatient}
                  onChange={setSelectedPatient}
                  getOptionValue={option => option.value}
                  getOptionLabel={option => option.label}
                  className="basic-single"
                  classNamePrefix="select"
                /> <br />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="formName">Form Name</label>
                  <Field
                    type="text"
                    name="formName"
                    id="formName"
                    placeholder="Enter form name"
                    className={`form-control ${touched.formName && errors.formName ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="formName" component="div" className="invalid-feedback" />
                </div>
              </div>
            </div>
            <hr />
            {values.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="d-flex py-1">
                  <div className="me-auto">
                    <h3>{`Section ${sectionIndex + 1}`}</h3>
                  </div>
                  <div className="">
                    <button
                      className="btn btn-sm btn-danger"
                      type="button"
                      onClick={() => {
                        values.sections.splice(sectionIndex, 1);
                        setFieldValue('sections', values.sections);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor={`sectionName${sectionIndex}`}>
                        Section name
                      </label>
                      <Field
                        type="text"
                        name={`sections[${sectionIndex}].name`}
                        id={`sectionName${sectionIndex}`}
                        placeholder="Enter Section Name"
                        className={`form-control ${touched.sections?.[sectionIndex]?.name && errors.sections?.[sectionIndex]?.name ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name={`sections[${sectionIndex}].name`} component="div" className="invalid-feedback" />
                    </div>
                  </div>
                </div>
                <ul className="list-group my-2">
                  {section.form_fields.map((field, fieldIndex) => (
                    <li className="list-group-item" key={fieldIndex}>
                      <div className="row">
                        <div className="col-3">
                          <div className="input-group">
                            <span className="input-group-text">Label</span>
                            <Field
                              type="text"
                              name={`sections[${sectionIndex}].form_fields[${fieldIndex}].label`}
                              className={`form-control ${touched.sections?.[sectionIndex]?.form_fields?.[fieldIndex]?.label && errors.sections?.[sectionIndex]?.form_fields?.[fieldIndex]?.label ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name={`sections[${sectionIndex}].form_fields[${fieldIndex}].label`} component="div" className="invalid-feedback" />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group">
                            <span className="input-group-text">Type</span>
                            <Field as="select"
                              name={`sections[${sectionIndex}].form_fields[${fieldIndex}].field_type`}
                              className={`form-select ${touched.sections?.[sectionIndex]?.form_fields?.[fieldIndex]?.field_type && errors.sections?.[sectionIndex]?.form_fields?.[fieldIndex]?.field_type ? 'is-invalid' : ''}`}
                            >
                              <option value="">Select Field Type</option>
                              <option value="text">Text</option>
                              <option value="password">Password</option>
                              <option value="radio">Radio</option>
                              <option value="checkbox">Checkbox</option>
                              <option value="select">Select</option>
                            </Field>
                            <ErrorMessage name={`sections[${sectionIndex}].form_fields[${fieldIndex}].field_type`} component="div" className="invalid-feedback" />
                          </div>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => {
                              values.sections[sectionIndex].form_fields.splice(fieldIndex, 1);
                              setFieldValue('sections', values.sections);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {['radio', 'checkbox', 'select'].includes(field.field_type) && (
                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              const choicesPath = `sections[${sectionIndex}].form_fields[${fieldIndex}].choices`;
                              const updatedChoices = [...(getIn(values, choicesPath) || []), ''];
                              setFieldValue(choicesPath, updatedChoices);
                            }}
                          >
                            Add Choice
                          </button>
                          {getIn(values, `sections[${sectionIndex}].form_fields[${fieldIndex}].choices`)?.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="input-group mt-2">
                              <Field
                                type="text"
                                name={`sections[${sectionIndex}].form_fields[${fieldIndex}].choices[${choiceIndex}]`}
                                className="form-control"
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  const choicesPath = `sections[${sectionIndex}].form_fields[${fieldIndex}].choices`;
                                  const updatedChoices = getIn(values, choicesPath).filter((_, idx) => idx !== choiceIndex);
                                  setFieldValue(choicesPath, updatedChoices);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="d-flex">
                  <button
                    className="btn btn-outline-primary w-100"
                    type="button"
                    onClick={() => {
                      values.sections[sectionIndex].form_fields.push({ label: "", field_type: "", choices: [] });
                      setFieldValue('sections', values.sections);
                    }}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            ))}
            <div className="d-flex">
              <div className="me-auto p-2">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    values.sections.push({ name: "", form_fields: [] });
                    setFieldValue('sections', values.sections);
                  }}
                >
                  Add Section
                </button>
              </div>
              <div className="p-2">
                <button type="submit" className="btn btn-primary">
                  {formId ? "Update Form" : "Create Form"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateForm;
