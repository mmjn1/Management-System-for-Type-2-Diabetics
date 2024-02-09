import "../assets/patientcss/sidebar.css";
import { Link } from "react-router-dom";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


const PatientSidebar = () =>{
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/patient/dashboard" className="link">
            <li className="sidebarListItem active">
              <DashboardOutlinedIcon className="sidebarIcon" />
              Patient Dashboard
            </li>
            </Link>

          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Health Monitoring</h3>
          <ul className="sidebarList">
            <Link to="/bloodsugar" className="link">
              <li className="sidebarListItem">
                <BloodtypeOutlinedIcon className="sidebarIcon" />
                Blood Sugar Level

              </li>
            </Link>
            <Link to="/progresstracker" className="link">
              <li className="sidebarListItem">
                <AddTaskOutlinedIcon className="sidebarIcon" />
                Progress Tracker
              </li>
            </Link>
            <Link to="/prescriptions" className="link">
            <li className="sidebarListItem">
              <MedicationOutlinedIcon className="sidebarIcon" />
                Prescriptions
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Consultations & Care</h3>
          <ul className="sidebarList">

            <Link to="/appointments" className="link">
            <li className="sidebarListItem">
              <CalendarMonthOutlinedIcon className="sidebarIcon" />
              Appointments
            </li>
            </Link>

            <li className="sidebarListItem">
              <ChatOutlinedIcon className="sidebarIcon" />
              Chat with Doctor
            </li>
            <li className="sidebarListItem">
              <Diversity3OutlinedIcon className="sidebarIcon" />
              My Care Team
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Nutrition & Diet</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <DiningOutlinedIcon className="sidebarIcon" />
              Dietary Habits
            </li>
            <li className="sidebarListItem">
              <LibraryBooksOutlinedIcon className="sidebarIcon" />
              Educational Resources
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Personal Account</h3>
          <ul className="sidebarList">

            <Link to="/patient/profile" className="link">
            <li className="sidebarListItem">
              <AccountCircleOutlinedIcon className="sidebarIcon" />
              Profile
            </li>
            </Link>

            <Link to="/payments" className="link">
            <li className="sidebarListItem">
              <PaymentsOutlinedIcon className="sidebarIcon" />
              Payments
            </li>
            </Link>

          
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> System</h3>
          <ul className="sidebarList">

          <Link to="/" className="link">
            <li className="sidebarListItem">
              <LogoutOutlinedIcon className="sidebarIcon" />
              Logout
            </li>
            </Link>

         
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default PatientSidebar;