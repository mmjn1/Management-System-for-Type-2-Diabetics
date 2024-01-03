import "../sass/sidebar.scss";
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import BloodtypeIcon from '@mui/icons-material/BloodtypeOutlined';
import LocalLibraryIcon from '@mui/icons-material/LocalLibraryOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { Link } from "@mui/material";
import { Link as RouterLink} from 'react-router-dom';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="top"> 
                <span className="logo"> PatientUser </span> 
            </div>
            <hr     />
            <div className="centre"> 
                <ul>

                <li>
                    <NavLink to="/patient/dashboard" end activeClassName="active" style={{ textDecoration: 'none'}}>
                        <DashboardIcon className="icon"/>
                            <span> Patient Dashboard </span>
                    </NavLink>
                </li>

                <p className="title"> Health Tracking </p>

                    <li>
                        <NavLink to="/bloodsugar" end activeClassName="active" style={{ textDecoration: 'none'}}>
                        <BloodtypeIcon className="icon"/>
                            <span> Blood Sugar Level </span>
                        </NavLink> 
                    </li>

                    <li>
                        <NavLink to="/progress" end activeClassName="active" style={{ textDecoration: 'none'}}>
                        <PublishedWithChangesOutlinedIcon className="icon"/>
                            <span> Progress Tracker </span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/prescriptions" end activeClassName="active" style={{ textDecoration: 'none'}}>
                            <MedicationIcon className="icon"/>
                                <span> Prescriptions </span>
                        </NavLink>
                    </li>

                    <p className="title"> Consulations & Care </p>


                    <li>
                        <NavLink to="/appointments" end activeClassName="active" style={{ textDecoration: 'none'}}>
                        <CalendarMonthIcon className="icon"/>
                            <span> Appointments </span>
                        </NavLink>
                        </li>
                    
                    <li>
                        <ChatIcon className="icon"/>
                            <span> Chat with Doctor </span>
                        </li>

                        
                    

                <p className="title"> Nutrition & Diet </p>
                        <li>
                            <NavLink to="/diet" end activeClassName="active" style={{ textDecoration: 'none'}}>
                            <DiningOutlinedIcon className="icon"/>
                            <span> Dietary Habits </span>
                            </NavLink>
                        </li>
                           

                        <li>
                            <NavLink to="/resources" end activeClassName="active" style={{ textDecoration: 'none'}}>
                            <LocalLibraryIcon className="icon"/>
                            <span> Educational Resources </span>
                            </NavLink>
                        </li>

               

                <p className="title"> Surgery & Care Team </p>
                        <li>
                            <MedicationIcon className="icon"/>
                            <span> My Care Team </span>
                        </li>

                        <li>
                            <NavLink to="/surgery" end activeClassName="active" style={{ textDecoration: 'none'}}>
                            <LocalHospitalIcon className="icon"/>
                            <span> Surgery Information </span>
                            </NavLink>
                        </li>
                        

                <p className="title"> Personal Account </p>
                        <li>
                            <NavLink to="/profile" end activeClassName="active" style={{ textDecoration: 'none'}}>
                                <AccountCircleOutlinedIcon className="icon"/>
                                <span> Profile </span>
                            </NavLink>
                        </li>

                        <li>
                            <NotificationsOutlinedIcon className="icon"/>
                            <span> Notifications </span>
                        </li>

                        <li>
                            <PaymentOutlinedIcon className="icon"/>
                            <span> Payments </span>
                        </li>

                        <li>
                            <SettingsApplicationsOutlinedIcon className="icon"/>
                            <span> Settings </span>
                        </li>


                <p className="title"> System </p>
                    <li>
                        <LogoutOutlinedIcon className="icon"/>
                        <span> Logout </span>
                    </li>

                </ul>
            </div>
            <div className="bottom">  
                <div className="colorOption"> </div>
                <div className="colorOption"> </div>
            </div>

        </div>
    );


};

export default Sidebar;