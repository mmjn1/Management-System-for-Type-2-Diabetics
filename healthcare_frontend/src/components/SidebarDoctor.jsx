import "../assets/patientcss/sidebar.css";
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';


const SidebarDoctor = () =>{
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/doctor/dashboard" className="link">
            <li className="sidebarListItem active">
              <DashboardIcon className="sidebarIcon" />
              Doctor Dashboard
            </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Patient Monitoring</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <ListOutlinedIcon className="sidebarIcon" />
                Patient Records
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Appointments</h3>
          <ul className="sidebarList">

            <Link to="/doctor/appointments" className="link">
            <li className="sidebarListItem">
              <CalendarMonthOutlinedIcon className="sidebarIcon" />
              Appointment Calendar
            </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Communications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <ChatIcon className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Care Management</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem">
              <Diversity3OutlinedIcon className="sidebarIcon" />
              My Care Team
            </li>
            </Link>

            <Link to="/" className="link">
            <li className="sidebarListItem">
              <MedicationOutlinedIcon className="sidebarIcon" />
              Surgery Information
            </li>
            </Link>
          </ul>

        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Medications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MedicationOutlinedIcon className="sidebarIcon" />
              Prescriptions Management
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Personal Account </h3>
          <ul className="sidebarList">
            <Link to="/doctor/profile" className="link">
            <li className="sidebarListItem">
              <AccountCircleOutlinedIcon className="sidebarIcon" />
              Profile
            </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> System </h3>
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

export default SidebarDoctor;