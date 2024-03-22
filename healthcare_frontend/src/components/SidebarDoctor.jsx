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
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

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
    <div className="sidebar">
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
            <Link to="/" className="link">
              <li className="sidebarListItem">
                <AssignmentOutlinedIcon className="sidebarIcon" />
                Patient Records
              </li>
            </Link>

            <Link to="/doctor/appointments" className="link">
              <li className={`sidebarListItem ${location.pathname === "/doctor/appointments" ? "active" : ""}`}>
                <CalendarMonthOutlinedIcon className="sidebarIcon" />
                Appointment Calendar
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
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MedicationOutlinedIcon className="sidebarIcon" />
              Prescription Requests
            </li>

            <li className="sidebarListItem">
              <LocalLibraryOutlinedIcon className="sidebarIcon" />
              Medication Library
            </li>

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
