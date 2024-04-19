import "../assets/patientcss/sidebar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/api/userslice";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { useEffect } from "react";
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';


const PatientSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const loginstatus = useSelector((state) => state.user);

  useEffect(() => {
    if (loginstatus.token === null) {
      const redirectPath = '/'
      navigate(redirectPath);
    }
  }, [loginstatus, navigate]);
  const logoutfun = () => {
    dispatch(logout())
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <HomeOutlined className="sidebarIcon" />
                Home
              </li>
            </Link>
            <Link to="/patient/dashboard" className="link">
              <li className={`sidebarListItem ${location.pathname === "/patient/dashboard" ? "active" : ""}`}>
                <DashboardOutlinedIcon className="sidebarIcon" />
                Patient Dashboard
              </li>
            </Link>

          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Health Monitoring</h3>
          <ul className="sidebarList">
            <Link to="/patient/bloodsugar" className="link">
              <li className={`sidebarListItem ${location.pathname === "/patient/bloodsugar" ? "active" : ""}`}>
                <BloodtypeOutlinedIcon className="sidebarIcon" />
                Blood Sugar Level
              </li>
            </Link>

            <Link to='/patient/prescription' className='link'>
              <li
                className={`sidebarListItem ${location.pathname === '/patient/prescription' ? 'active' : ''}`}
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
                My Prescriptions
              </li>
            </Link>


          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Consultations & Care</h3>
          <ul className="sidebarList">

            <Link to="/patient/appointments" className="link">
              <li className={`sidebarListItem ${location.pathname === "/patient/appointments" ? "active" : ""}`}>
                <CalendarMonthOutlinedIcon className="sidebarIcon" />
                Appointments
              </li>
            </Link>

            <Link to="/patient/chat" className="link">
              <li className={`sidebarListItem ${location.pathname === "/patient/chat" ? "active" : ""}`}>
                <ChatOutlinedIcon className="sidebarIcon" />
                Chat with Doctor
              </li>
            </Link>

            <Link to="/myrecords" className="link">
              <li className={`sidebarListItem ${location.pathname === "/myrecords" ? "active" : ""}`}>
                <LibraryBooksOutlinedIcon className="sidebarIcon" />
                My Records
              </li>
            </Link>

            <Link to='/diet' className="link">
              <li className={`sidebarListItem ${location.pathname === "/diet" ? "active" : ""}`}>
                <DiningOutlinedIcon className="sidebarIcon" />
                Dietary Habits
              </li>
            </Link>

            <Link to="/resources" className="link">
              <li className={`sidebarListItem ${location.pathname === "/resources" ? "active" : ""}`}>
                <LocalLibraryOutlinedIcon className="sidebarIcon" />
                NHS Type 2 Diabetes Guide
              </li>
            </Link>

          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> Personal Account</h3>
          <ul className="sidebarList">

            <Link to="/patient/profile" className="link">
              <li className={`sidebarListItem ${location.pathname === "/patient/profile" ? "active" : ""}`}>
                <AccountCircleOutlinedIcon className="sidebarIcon" />
                Profile
              </li>
            </Link>

            {/* <Link to="/payments" className="link">
              <li className={`sidebarListItem ${location.pathname === "/payments" ? "active" : ""}`}>
                <PaymentsOutlinedIcon className="sidebarIcon" />
                Payments
              </li>
            </Link> */}


          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"> System</h3>
          <ul className="sidebarList">

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
}

export default PatientSidebar;
