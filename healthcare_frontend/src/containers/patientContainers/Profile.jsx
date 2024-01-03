import React from 'react';
import Sidebar from '../../components/PatientSidebar';
import Navbar from '../../components/PostLoginNavigation';
import "../../sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const Profile = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    {/* Your profile page content goes here */}
                    Profile Page

                </div>
            </div>
        </div>
    );
}

export default Profile;