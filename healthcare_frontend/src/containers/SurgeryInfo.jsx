import React from 'react';
import Sidebar from '../components/PatientSidebar';
import Navbar from '../components/PostLoginNavigation';
import "../sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const SurgeryInfo = () => {
    return (   
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    Surgery Information

                </div>
            </div>
        </div>
    );
}

export default SurgeryInfo;