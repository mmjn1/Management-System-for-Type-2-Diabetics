import "../sass/navbar.scss";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const Navbar = () => {
    return (
        <div className="navbar"> 
            <div className="wrapper"> 
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchOutlinedIcon className="icon" />
                </div>
                <div className="items">

                    <div className="item">
                        <NotificationsNoneOutlinedIcon className="icon"/>
                    </div>
                  
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon"/>
                    </div>
        
                    <div className="item">
                        <img
                            src="https://www.clipartmax.com/png/small/290-2909705_patient-profile-patient-profile.png" 
                            alt="Patient Profile - Patient Profile @clipartmax.com"
                            className="avatar"/>
                            Mr Mukhtar
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;