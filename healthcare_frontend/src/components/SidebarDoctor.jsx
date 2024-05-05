import "../assets/patientcss/sidebar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/api/userslice";
import { useEffect } from "react";
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

const SidebarDoctor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const loginstatus = useSelector((state) => state.user);

  useEffect(() => {
    if (loginstatus.token === null) {
      const redirectPath = "/";
      navigate(redirectPath);
    }
  }, [loginstatus, navigate]);
  const logoutfun = () => {
    dispatch(logout());
  };
  return (
    <div className="sidebar"> {/* Adjust the width as needed */}
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Dashboard Overview </h3>

          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <HomeOutlined className="sidebarIcon" />
                Home
              </li>
            </Link>
            <Link to="/doctor/dashboard" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/dashboard" ? "active" : ""}`}>
                <DashboardIcon className="sidebarIcon" />
                Doctor Dashboard
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Patient Monitoring</h3>
          <ul className="sidebarList">
            <Link to="/doctor/patient-records" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/patient-records" ? "active" : ""}`}>
                <DifferenceOutlinedIcon className="sidebarIcon" />
                Patient Records
              </li>
            </Link>

            <Link to="/doctor/custom-forms" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/custom-forms" ? "active" : ""}`}>
                <AssignmentOutlinedIcon className="sidebarIcon" />
                Custom Forms
              </li>
            </Link>
            <Link to="/doctor/appointments" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/appointments" ? "active" : ""}`}>
                <CalendarMonthOutlinedIcon className="sidebarIcon" />
                Appointment Calendar
              </li>
            </Link>

            <Link to='/doctor/appointments-list' className='link'>
              <li className={`sidebarListItem ${location.pathname === '/doctor/appointments-list' ? 'active' : ''}`}>
                <BookOnlineIcon className='sidebarIcon' />
                Past Appointments
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Communications</h3>
          <ul className="sidebarList">
            <Link to="/doctor/chat" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/chat" ? "active" : ""}`}>
                <ChatIcon className="sidebarIcon" />
                Messages
              </li>
            </Link>
          </ul>
        </div>


        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Medical Management </h3>
          <ul className='sidebarList'>
            <Link to='/doctor/prescription' className='link'>
              <li
                className={`sidebarListItem ${location.pathname === '/doctor/prescription' ? 'active' : ''}`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  xmlnsXlink='http://www.w3.org/1999/xlink'
                  aria-hidden='true'
                  role='img'
                  className='MuiBox-root css-1t9pz9x iconify iconify--mdi'
                  width='2em'
                  height='2em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M4 4v10h2v-4h2l5.41 5.41L9.83 19l1.41 1.41l3.59-3.58l3.58 3.58L19.82 19l-3.58-3.59l3.58-3.58l-1.41-1.42L14.83 14l-4-4H11a3 3 0 0 0 3-3a3 3 0 0 0-3-3zm2 2h5a1 1 0 0 1 1 1a1 1 0 0 1-1 1H6z'
                  />
                </svg>
                Medications & Refills
              </li>
            </Link>
            <Link to='/doctor/prescription-management' className='link'>
              <li
                className={`sidebarListItem ${location.pathname === '/doctor/prescription-management' ? 'active' : ''}`}
              >
                <MedicationOutlinedIcon className='sidebarIcon' />
                Prescriptions Management
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Personal Account </h3>
          <ul className="sidebarList">
            <Link to="/doctor/profile" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/profile" ? "active" : ""}`}>
                <AccountCircleOutlinedIcon className="sidebarIcon" />
                Profile
              </li>
            </Link>

            <Link onClick={() => logoutfun()} className="link">
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
};

export default SidebarDoctor;
