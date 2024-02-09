import React from 'react';
import { Link } from 'react-router-dom';
import "../../assets/patientcss/profile.css";

const Profile = () => {
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
                          <input className="profileInput" type="email"/>
                      </div>
                      <div className="profileInputField">
                          <label >First Name</label>
                          <input className="profileInput" type="text" />
                      </div>
                      <div className="profileInputField">
                          <label >Last Name</label>
                          <input className="profileInput" type="text" />
                      </div>
                      <div className="profileInputField">
                          <label >Password</label>
                          <input className="profileInput" type="password" /> <br/> <br/>
                      </div>

                  </div>

                  <div className="profileShowTop">
                      <div className="profileShowTopTitle">
                          <span className="profileShowSectionTitle"> Health Information </span> 
                      </div>
                  </div>
                  <div className="profileShowBottom">
                      {/* Health Information Section */}
                      {/* ... Type of Diabetes, Date of Diagnosis, etc. */}
                      <div className="profileInputField">
                          <label >Type of Diabetes</label>
                          <input className="profileInput" type="text"  />
                      </div>
                      <div className="profileInputField">
                          <label >Date of Diagnosis</label>
                          <input className="profileInput" type="date" />
                      </div>
                      <div className="profileInputField">
                          <label>Current Blood Sugar Level</label>
                          <input className="profileInput" type="text"/>
                      </div>
                      <div className="profileInputField">
                          <label >Target Blood Sugar Level</label>
                          <input className="profileInput" type="text" />
                      </div>
                      <div className="profileInputField">
                          <label > Primary Doctor </label>
                          <input className="profileInput" type="text"/> <br/>  
                      </div>
                  </div>

                  {/* Lifestyle and Medical History */}
                      <div className="profileShowTopTitle">
                          <span className="profileShowSectionTitle"> Lifestyle and Medical History </span> 
                      </div>
                  
                  <div className="profileShowBottom">
                      {/* Lifestyle and Medical History Section */}
                      <div className="profileInputField">
                          <label > Dietary Habits </label>
                          <input className="profileInput" type="text"/> 
                      </div>
                      <div className="profileInputField">
                          <label> Physical Activity Level </label>
                          <input className="profileInput" type="text"/> 
                      </div>
                      <div className="profileInputField">
                          <label > Smoking Habits: </label>
                          <input className="profileInput" type="text"/> 
                      </div>
                      <div className="profileInputField">
                          <label > Alcohol Consumption </label>
                          <input className="profileInput" type="text"/> 
                      </div>

                      <div className="profileInputField">
                          <label > Current Medications </label>
                          <textarea className="profileTextarea"></textarea>
                      </div>

                      <div className="profileInputField">
                          <label> Medical History </label>
                          <textarea className="profileTextarea"></textarea>
                      </div>

                      
                  </div>                 
              </div>
          </div>                
      </div>
  );
}

export default Profile;