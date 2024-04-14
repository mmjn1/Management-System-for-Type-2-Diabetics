import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';


/**
 * Shows a detailed view of a form.
 * 
 * This component fetches from PI and shows the details of a specific form (like the ones doctors create) based on an ID.
 *  
 * It handles different kinds of questions in the form, such as text boxes, password fields, dropdown menus, and checklists. 
 * Each part of the form is shown in its own section, with the questions displayed in a way that fits their type. 
 * If the form's details aren't ready yet, a loading message is displayed.
 * 
 *
 */

const FormDetail = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState(() => {
    try {
      const savedFormData = localStorage.getItem(`formData-${formId}`);
      return savedFormData ? JSON.parse(savedFormData) : {};
    } catch (error) {
      console.error('Error parsing saved form data:', error);
      return {};
    }
    
  });

  useEffect(() => {
    axios
      .get(`/api/forms/${formId}/`)
      .then((response) => setForm(response.data))
      .catch((error) => console.error(error));
  }, [formId]);

  useEffect(() => {
    localStorage.setItem(`formData-${formId}`, JSON.stringify(formData));
  }, [formData, formId]);

  console.log(form);



  const handleInputChange = (sectionId, fieldId, value, isCheckbox) => {
    const key = `${sectionId}-${fieldId}`;
    setFormData(prevFormData => {
      if (isCheckbox) {
        const updatedValues = prevFormData[key] ? [...prevFormData[key]] : [];
        if (updatedValues.includes(value)) {

          return { ...prevFormData, [key]: updatedValues.filter(item => item !== value) };
        } else {

          return { ...prevFormData, [key]: [...updatedValues, value] };
        }
      } else {

        return { ...prevFormData, [key]: value };
      }
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const responses = form.sections.flatMap(section =>
      section.form_fields.map(field => {
        const key = `${section.id}-${field.id}`;
        let value = formData[key] || '';
        if (field.field_type === 'checkbox') {
          value = formData[key] || [];
        }
        return {
          field: field.id.toString(),
          value: value
        };
      })
    );

    const submissionData = {
      responses: responses,
      patient_id: form.patient
    };
    try {
      const method = formId ? 'put' : 'post';
      const endpoint = formId ? `/api/forms/${formId}/responses/update/` : '/api/create-form/';
      const response = await axios[method](
        endpoint,
        { ...submissionData },
        { headers: { Authorization: `Token ${token}` } }
      );
      toast.success('Form submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit form');
    }
  };


  if (!form) return <div className="text-center"><strong>Loading...</strong></div>;

  return (
    <form onSubmit={handleSubmit} className="container my-5">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-4">{form.name}</h1>
            <Link to={"/doctor/custom-forms"} className="btn btn-primary">
              View all Forms
            </Link>
          </div>
          {form.sections.map((section) => (
            <div className="card mb-3" key={section.id}>
              <div className="card-header bg-primary text-white" id={`section-${section.id}`}>
                <h3 className="mb-0">{section.name}</h3>
              </div>
              <div className="card-body">
                {section.form_fields.map((field) => {
                  const fieldKey = `field-${section.id}-${field.id}`;
                  switch (field.field_type) {
                    case "text":
                      return (
                        <div key={field.id} className="mb-3">
                          <label className="form-label">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={formData[`${section.id}-${field.id}`] || ''}
                            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      );
                    case "password":
                      return (
                        <div key={field.id} className="mb-3">
                          <label htmlFor={fieldKey} className="form-label">
                            {field.label}
                          </label>
                          <input
                            type={field.field_type}
                            id={fieldKey}
                            name={fieldKey}
                            value={formData[fieldKey] || ''}
                            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      );
                    case "select":
                      return (
                        <div key={field.id} className="mb-3">
                          <label htmlFor={fieldKey} className="form-label">
                            {field.label}
                          </label>
                          <select
                            name={fieldKey}
                            id={fieldKey}
                            value={formData[`${section.id}-${field.id}`] || ''}
                            onChange={(e) => handleInputChange(section.id, field.id, e.target.value, false)}
                            className="form-select"
                          >
                            <option value="">Select an option</option>
                            {field.choices.map((choice) => (
                              <option key={choice.id} value={choice.choice_text}>
                                {choice.choice_text}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    case "radio":
                      return (
                        <div key={field.id} className="mb-3">
                          <label className="form-label d-block">
                            {field.label}
                          </label>
                          {field.choices.map((choice, index) => {
                            const choiceId = `${fieldKey}-radio-${index}`;
                            const radioGroupName = `${section.id}-${field.id}`;

                            return (
                              <div className="form-check form-check-inline" key={choiceId}>
                                <input
                                  type="radio"
                                  id={choiceId}
                                  name={radioGroupName}
                                  value={choice.choice_text}
                                  checked={formData[radioGroupName] === choice.choice_text}
                                  onChange={(e) => handleInputChange(section.id, field.id, e.target.value, false)}
                                  className="form-check-input"
                                />
                                <label htmlFor={choiceId} className="form-check-label">
                                  {choice.choice_text}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      );

                    case "checkbox":
                      return (
                        <div key={field.id} className="mb-3">
                          <label className="form-label d-block">
                            {field.label}
                          </label>

                          {field.choices.map((choice, index) => {
                            const choiceId = `${fieldKey}-checkbox-${index}`;
                            return (
                              <div className="form-check form-check-inline" key={choiceId}>
                                <input
                                  type="checkbox"
                                  id={choiceId}
                                  name={fieldKey}
                                  value={choice.choice_text}
                                  checked={formData[fieldKey] && formData[fieldKey].includes(choice.choice_text)}
                                  onChange={(e) => handleInputChange(section.id, field.id, e.target.value, true)}
                                  className="form-check-input"
                                />
                                <label htmlFor={choiceId} className="form-check-label">
                                  {choice.choice_text}
                                </label>
                              </div>
                            );
                          })}


                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-success">Submit Form</button>
        </div>
      </div>
    </form>
  );
};

export default FormDetail;

