import React from 'react';
import { Link } from 'react-router-dom';
import "../../assets/patientcss/profile.css";

const DoctorProfile = () => {
  return (
      <div className="profile">
          <div className="profileTitleContainer">
              <h1 className="profileTitle"> Profile </h1>
          </div>
          <div className="profileTitleContainer"></div>
          <div className="patientContainer">
              <div className="profileShow">
                  <div className="profileShowTop">
                      <div className="profileShowTopTitle">
                          <span className="profileShowSectionTitle"> Account Information </span> 
                      </div>
                  </div>
                  <div className="profileShowBottom">
                      {/* Account Information Section */}
                      {/* ... First Name, Last Name, Email, Password fields */}
                      <div className="profileInputField">
                          <label >Email</label>
                          <input className="profileInput" type="email"   />
                      </div>
                      <div className="profileInputField">
                          <label >First Name</label>
                          <input className="profileInput" type="text"  />
                      </div>
                      <div className="profileInputField">
                          <label >Last Name</label>
                          <input className="profileInput" type="text" />
                      </div>
                      <div className="profileInputField">
                          <label >Password</label>
                          <input className="profileInput" type="password"  /> <br/> 
                      </div>

                  </div>

                  <div className="profileShowTop">
                      <div className="profileShowTopTitle">
                          <span className="profileShowSectionTitle"> Professional Information: </span> 
                      </div>
                  </div>
                  <div className="profileShowBottom">
                      {/* Health Information Section */}
                      {/* ... Type of Diabetes, Date of Diagnosis, etc. */}
                      <div className="profileInputField">
                          <label > Speciality</label>
                          <input className="profileInput" type="text"  />
                      </div>
                      <div className="profileInputField">
                          <label > Years of Experience</label>
                          <input className="profileInput" type="date" />
                      </div>
                      <div className="profileInputField">
                          <label> Medical License Number</label>
                          <input className="profileInput" type="text" />
                      </div>
                      <div className="profileInputField">
                          <label> Country of Issue </label>
                          <input className="profileInput" type="text"  />
                      </div>
                      <div className="profileInputField">
                          <label > Year of Issue </label>
                          <input className="profileInput" type="text"  /> 
                      </div>

                      <div className="profileInputField">
                          <label > Diabetes Management Experience </label>
                          <textarea className="profileTextarea" ></textarea>
                      </div>

                  </div>

                  {/* Lifestyle and Medical History */}
                      <div className="profileShowTopTitle">
                          <span className="profileShowSectionTitle"> Practice Details </span> 
                      </div>
                  
                  <div className="profileShowBottom">
                      {/* Lifestyle and Medical History Section */}
                      <div className="profileInputField">
                          <label > Treatement Approach </label>
                          <textarea className="profileTextarea"></textarea>
                      </div>
                      <div className="profileInputField">
                          <label> Contact Hours </label>
                          <input className="profileInput" type="text"/> 
                      </div>
                      <div className="profileInputField">
                          <label > Telephone Number </label>
                          <input className="profileInput" type="text"/> 
                      </div>
                      <div className="profileInputField">
                          <label > Emergency Consultations Availability  </label>
                          <textarea className="profileTextarea" ></textarea>
                      </div>            
                  </div>                 
              </div>
          </div>                
      </div>
  );
}

export default DoctorProfile;