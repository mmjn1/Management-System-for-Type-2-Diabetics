import React from 'react';
import Sidebar from '../../components/PatientSidebar';
import Navbar from '../../components/PostLoginNavigation';
import "../../assets/sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const DietaryHabits = () => {
    return (   
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    Track your dietary intake here with recommendations
                    to improve your diet.

                </div>
            </div>
        </div>
    );
}

export default DietaryHabits;