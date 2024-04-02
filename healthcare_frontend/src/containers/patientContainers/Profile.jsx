import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userDetails } from "../../features/api/Userdetails";
import moment from "moment";
import AccountInfo from './Modals/AccountInfo';
import HealthInfo from './Modals/HealthInfo';
import LifeStyleMedModal from './Modals/Lifestyle&MedModal';
import "../../assets/patientcss/profile.css";

const Profile = () => {
    const dispatch = useDispatch();
    const details = useSelector((state) => state.userDetails);
    const [isAccountInfoModalVisible, setIsAccountInfoModalVisible] = useState(false);
    const [isHealthInfoModalVisible, setIsHealthInfoModalVisible] = useState(false);
    const [isLifeStyleMedModalVisible, setIsLifeStyleMedModalVisible] = useState(false);

    useEffect(() => {
        dispatch(userDetails());
    }, [dispatch]);

    const showAccountInfoModal = () => {
        setIsAccountInfoModalVisible(true);
    };
    
    const hideAccountInfoModal = () => {
        setIsAccountInfoModalVisible(false);
    };

    const showHealthInfoModal = () => {
        setIsHealthInfoModalVisible(true);
    };

    const hideHealthInfoModal = () => {
        setIsHealthInfoModalVisible(false);
    };

    const showLifeStyleMedModal = () => {
        setIsLifeStyleMedModalVisible(true);
    };

    const hideLifeStyleMedModal = () => {
        setIsLifeStyleMedModalVisible(false);
    };

    const onUpdateSuccess = () => {
        dispatch(userDetails()); 
    };

    return (
        <div className="profile">
            <div className="profileTitleContainer">
                <h1 className="profileTitle"> Profile </h1>
            </div>
            <div className="profileTitleContainer"></div>
            <div className="patientContainer">
                <div className="profileShow">
                    <div className="profileShowTop">
                        <div className="profileShowTopTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="profileShowSectionTitle"> Account Information: </span>
                            <button className="updateProfileButton" onClick={showAccountInfoModal} >Update Account Info</button>
                        </div>
                        {isAccountInfoModalVisible && <AccountInfo showModal={isAccountInfoModalVisible} handleClose={hideAccountInfoModal} details={details}  onUpdateSuccess={onUpdateSuccess} />}
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
                                    <span className="profileShowSectionTitle"> Health Information: </span>
                                    <button className="updateProfileButton" onClick={showHealthInfoModal} >Update Health Information Info </button>
                                </div>
                                {isHealthInfoModalVisible && <HealthInfo showModal={isHealthInfoModalVisible} handleClose={hideHealthInfoModal} details={details} onUpdateSuccess={onUpdateSuccess}/>}

                            </div>
                            <div className="profileShowBottom">
                                {/* Health Information Section */}
                                {/* ... Type of Diabetes, Date of Diagnosis, etc. */}
                                <div className="profileInputField">
                                    <label>Type of Diabetes</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.type_of_diabetes} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label>Date of Diagnosis</label>
                                    <input className="profileInput" type="date" value={moment(details.data.information.date_of_diagnosis).format("YYYY-MM-DD")} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label>Current Blood Sugar Level (mg/dL)</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.blood_sugar_level} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label>Target Blood Sugar Level (mg/dL)</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.target_blood_sugar_level} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Current Doctor (if you would like to change your doctor, please contact GlucoCare support on the homepage through our contact form.)</label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.primary_doctor ? details.data.information.primary_doctor.map(doctor => `Dr. ${doctor.full_name}`).join(', ') : ''} readOnly /> <br /> <br />
                                </div>
                            </div>

                            <div className="profileShowTopTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="profileShowSectionTitle"> Lifestyle and Medical History: </span>
                                <button className="updateProfileButton" onClick={showLifeStyleMedModal} >Update Lifestyle and Medical History Info</button>
                            </div>
                            {isLifeStyleMedModalVisible && <LifeStyleMedModal showModal={isLifeStyleMedModalVisible} handleClose={hideLifeStyleMedModal} details={details} onUpdateSuccess={onUpdateSuccess}/>}


                            <div className="profileShowBottom">
                                <div className="profileInputField">
                                    <label> Dietary Habits </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.dietary_habits} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Physical Activity Level </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.physical_activity_level} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Smoking Habits </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.smoking_habits} readOnly />
                                </div>
                                <div className="profileInputField">
                                    <label> Alcohol Consumption </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.alcohol_consumption} readOnly />
                                </div>

                                <div className="profileInputField">
                                    <label> Medication Adherence </label>
                                    <input className="profileInput" type="text"
                                        value={details.data.information.medication_adherence} readOnly /> <br />
                                </div>

                                <div className="profileInputField">
                                    <label> Current Medications </label>
                                    <textarea
                                        className="profileTextarea"
                                        value={details.data.information.current_diabetes_medication} readOnly></textarea>
                                </div>

                                <div className="profileInputField">
                                    <label> Family History </label>
                                    <textarea
                                        className="profileTextarea"
                                        value={details.data.information.family_medical_history} readOnly></textarea>
                                </div>

                                <div className="profileInputField">
                                    <label> Medical History </label>
                                    <textarea
                                        className="profileTextarea"
                                        value={details.data.information.medical_history} readOnly></textarea>
                                </div>
                            </div>
                        </>
                        : 'loading'}

                </div>
            </div>
        </div>
    );
}

export default Profile;
