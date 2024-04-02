import React, { useEffect, useState } from 'react';
import "../../assets/patientcss/profile.css";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../features/api/Userdetails";

import AccountInformation from "./DoctorProfileModals/AccountInformation";
import ProfessionalInformation from "./DoctorProfileModals/Professional";
import PracticeDetails from "./DoctorProfileModals/Practice";

const DoctorProfile = () => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state.userDetails)
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showProfessionalModal, setShowProfessionalModal] = useState(false);
    const [showPracticeModal, setShowPracticeModal] = useState(false);

    useEffect(() => {
        dispatch(userDetails())
    }, []);

    const handleAccountModal = () => {
        setShowAccountModal(true);
    }

    const hideAccountModal = () => {
        setShowAccountModal(false);
    }

    const handleProfessionalModal = () => {
        setShowProfessionalModal(true);
    }

    const hideProfessionalModal = () => {
        setShowProfessionalModal(false);
    }

    const handlePracticeModal = () => {
        setShowPracticeModal(true);
    }

    const hidePracticeModal = () => {
        setShowPracticeModal(false);
    }

    const onUpdateSuccess = () => {
        dispatch(userDetails())
    }


    return (
        <div className="profile">
            <div className="profileTitleContainer">
                <h1 className="profileTitle">Profile</h1>
            </div>
            <div className="profileTitleContainer"></div>
            <div className="patientContainer">
                <div className="profileShow">
                    <div className="profileShowTop">
                        <div className="profileShowTopTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="profileShowSectionTitle"> Account Information: </span>
                            <button className="updateProfileButton" onClick={handleAccountModal} >Update Account Info</button>
                        </div>
                        {showAccountModal && <AccountInformation showModal={showAccountModal} handleClose={hideAccountModal} details={details} onUpdateSuccess={onUpdateSuccess} />}
                    </div>
                    {details.status === 'succeeded' ?
                        <>
                            <div className="profileShowBottom">
                                {/* Account Information Section */}
                                {/* ... First Name, Last Name, Email, Password fields */}
                                <div className="profileInputField">
                                    <label>Email</label>
                                    <input className="profileInput" type="email" value={details.data.user.email} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label>First Name</label>
                                    <input className="profileInput" type="text" value={details.data.user.first_name} readOnly />
                                </div>

                                <div className="profileInputField">
                                    <label>Last Name</label>
                                    <input className="profileInput" type="text" value={details.data.user.last_name} readOnly /> <br /> <br />
                                </div>
                            </div>

                            <div className="profileShowTop">
                                <div className="profileShowTopTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="profileShowSectionTitle"> Professional Information: </span>
                                    <button className="updateProfileButton" onClick={handleProfessionalModal} >Update Professional Info</button>
                                </div>
                                {showProfessionalModal && <ProfessionalInformation showModal={showProfessionalModal} handleClose={hideProfessionalModal} details={details} onUpdateSuccess={onUpdateSuccess} />}
                            </div>
                            <div className="profileShowBottom">
                                {/* Health Information Section */}
                                {/* ... Type of Diabetes, Date of Diagnosis, etc. */}
                                <div className="profileInputField">
                                    <label> Speciality</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.speciality} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Years of Experience - (To maintain the accuracy of our records, years of experience cannot be updated directly.
                                        If you need to update this information, please contact GlucoCare support.)
                                    </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.years_of_experience} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Medical License Number - (This is your unique medical license identifier and cannot be changed,
                                        Please contact the General Medical Council regarding this.)</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.license_number} readOnly />
                                </div>

                                <div className="profileInputField">
                                    <label> Year of Issue - (Your license issue year is a crucial verification detail and cannot be changed without review. For corrections, please contact GlucoCare support) </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.year_of_issue} readOnly />
                                </div>

                                <div className="profileInputField">
                                    <label> Diabetes Management Experience </label>
                                    <textarea
                                        className="profileTextarea"
                                        value={details.data.information.diabetes_management_experience}
                                        readOnly>
                                    </textarea> <br /> <br />
                                </div>

                            </div>

                            {/* Lifestyle and Medical History */}
                            <div className="profileShowTopTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="profileShowSectionTitle"> Practice Details: </span>
                                <button className="updateProfileButton" onClick={handlePracticeModal} >Update Practice Info</button>
                            </div>
                            {showPracticeModal && <PracticeDetails showModal={showPracticeModal} handleClose={hidePracticeModal} details={details} onUpdateSuccess={onUpdateSuccess} />}

                            <div className="profileShowBottom">
                                {/* Lifestyle and Medical History Section */}

                                <div className="profileInputField">
                                    <label> Contact Hours </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.contact_hours} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Telephone Number </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.tel_number} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Emergency Consultations Availability </label>
                                    <input
                                        type="text"
                                        className="profileInput"
                                        value={details.data.information.emergency_consultations || ''}
                                        readOnly />
                                </div>

                                <div className="profileInputField">
                                    <label> Treatment Approach </label>
                                    <textarea
                                        className="profileTextarea"
                                        value={details.data.information.treatment_approach}
                                        readOnly>
                                    </textarea>
                                </div>
                            </div>
                        </>
                        : 'Loading'}
                </div>
            </div>
        </div >
    );
}

export default DoctorProfile;