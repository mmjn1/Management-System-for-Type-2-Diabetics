import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../features/api/Userdetails";
import "../../assets/patientcss/dashboard.css";

const DoctorDashboardPage = () => {
  const dispatch = useDispatch();
  const doctorDetails = useSelector((state) => state.userDetails.data.user);
  const welcomeMessage = "The good physician treats the disease; the great physician treats the patient who has the disease. — William Osler";

  useEffect(() => {
    dispatch(userDetails());
  }, [dispatch]);

  return (
    <div>
      <div className="containers">
        <div className="welcome-container" style={{ marginTop: '20px' }}>
          <h1>Welcome Back Dr. {doctorDetails ? `${doctorDetails.first_name} ${doctorDetails.last_name}` : 'Loading...'}</h1>
          <p>{welcomeMessage}</p>
        </div>
      </div>
    </div>

  );
}

export default DoctorDashboardPage;