import React from 'react';
import Sidebar from '../../components/PatientSidebar';
import Navbar from '../../components/PostLoginNavigation';
import "../../sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const ProgressTracker = () => {
    return (   
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    Track your progress here

                </div>
            </div>
        </div>
    );
}

export default ProgressTracker;