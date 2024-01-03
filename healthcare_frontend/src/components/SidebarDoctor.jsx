import "../sass/DoctorDashboard.scss";
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import LocalLibraryIcon from '@mui/icons-material/LocalLibraryOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';


const DoctorSidebar = () => {
    return (
        <div className="sidebar">
            <div className="top"> 
                <span className="logo"> Doctor</span> 
            </div>
            <hr     />
            <div className="centre"> 
                <ul>
                        <li>
                        <DashboardIcon className="icon"/>
                            <span> Doctor Dashboard </span>
                        </li>

                        <p className="title"> Patient Monitoring</p>


                        <li>
                        <ListOutlinedIcon className="icon"/>
                            <span> Patient List </span>
                        </li>

                        <li>
                        <HistoryOutlinedIcon className="icon"/>
                            <span> Patient History </span>
                        </li>

                        <li>
                        <QueryStatsOutlinedIcon className="icon"/>
                            <span> Blood Sugar Trends </span>
                        </li>

                
                    <p className="title"> Scheduling and Appointments </p>
                        <li>
                            <CalendarMonthIcon className="icon"/>
                            <span> Appointment Calendar </span>
                        </li>
                           

                    
                    <p className="title"> Communication </p>
                        <li>
                        <ChatIcon className="icon"/>
                            <span> Messages  </span>
                        </li>

                        <li>
                            <NotificationsOutlinedIcon className="icon"/>
                            <span> Notifications </span>
                        </li>

                    <p className="title"> Surgery & Care Team </p>
                        <li>
                            <MedicationIcon className="icon"/>
                            <span> My Care Team </span>
                        </li>

                        <li>
                            <LocalHospitalIcon className="icon"/>
                            <span> Surgery Information </span>
                        </li>



                    <p className="title"> Medications & Resources </p>
                    <li>
                        <LocalLibraryIcon className="icon"/>
                            <span> Medical Library </span>
                        </li>

                        <li>
                            <MedicationIcon className="icon"/>
                            <span> Prescriptions Management </span>
                        </li>


                    <p className="title"> Personal Account </p>
                        <li>
                            <AccountCircleOutlinedIcon className="icon"/>
                            <span> Profile </span>
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

export default DoctorSidebar;