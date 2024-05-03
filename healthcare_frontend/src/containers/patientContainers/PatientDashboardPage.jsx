import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../features/api/Userdetails";
import "../../assets/patientcss/dashboard.css";

const PatientDashboardPage = () => {
  const dispatch = useDispatch();
  const patientDetails = useSelector((state) => state.userDetails.data.user); 
  const welcomeMessage = "Taking care of your health today gives you a better hope for tomorrow.";
  useEffect(() => {
    dispatch(userDetails()); 
  }, [dispatch]);

  return (
    <div>
      <div className="containers">
        <div className="welcome-container" style={{ marginTop: '20px' }}>
          <h1>Welcome Back {patientDetails ? `${patientDetails.first_name} ${patientDetails.last_name}` : 'Loading...'}</h1>
          <p>{welcomeMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboardPage;