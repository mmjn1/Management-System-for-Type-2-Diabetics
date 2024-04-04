import React from 'react'

import { Nav, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import far from '@fortawesome/fontawesome-free-regular'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faBell, faEnvelope } from '@fortawesome/free-regular-svg-icons'



export const NavProfile = (props) => {

    const {
        user,

        smallMobileScreen,
        smallTabletScreen,
        smallDesktopScreen,
        handlerForLogout,

        handleMouseEnter,
        handleMouseLeave,
        hover,
        isAuthenticated,
        loading,
        activeNavItem,
        handleNavItemClick,

    } = props

    const firstName = user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
    const middleName = user.middle_name ? user.middle_name.charAt(0).toUpperCase() + user.middle_name.slice(1) : "";
    const lastName = user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);

    const fullName = firstName + " " + middleName + " " + lastName;


    const firstNameInitial = user.first_name.charAt(0).toUpperCase();
    const lastNameInitial = user.last_name.charAt(0).toUpperCase();


    return (
        <>
            <Nav className={
                "w-100 d-flex justify-content-end   "
                +
                (smallMobileScreen ? " d-none" :
                    smallTabletScreen ? " " :
                        smallDesktopScreen ? " " : " ")
            }
            >
                {/* // dowp up profile uodisde */}

                {
                    (
                        !smallMobileScreen && !smallTabletScreen && !smallDesktopScreen ? " " :
                            <style type="text/css">

                                {
                                    `.dropdown-toggle::after {
                                        display: none;
                                        }`
                                }

                            </style>
                    )
                }

                {/* profile and notifications */}

                {/* // add notifications icon with badge */}
                {/* <Nav.Link href="/notifications" onMouseEnter={() => handleMouseEnter('notifications')} onMouseLeave={() => handleMouseLeave('notifications')}
                    className={
                        " d-flex align-items-center rounded-4 border " + (
                            hover.notifications ?
                                "hover hover-primary text-primary " : "")

                    }
                >
                    {
                        hover.notifications ?
                            <FontAwesomeIcon icon={fas.faBell} className="fa-fw fs-5" /> :
                            <FontAwesomeIcon icon={far.faBell} className="fa-fw fs-5" />
                    }
                </Nav.Link> */}
                <NavDropdown
                    menuRole="Profile Menu"
                    title={
                        <div className={
                            "d-inline-block " +
                                smallMobileScreen ? " justify-content-center mx-auto d-inline-block " :
                                smallTabletScreen ? " justify-content-center me-3" :
                                    smallDesktopScreen ? " justify-content-center" : " "
                        }

                        >
                            <div className={

                                "d-inline-block rounded-circle bg-primary text-light text-center " +

                                (


                                    smallMobileScreen ? " justify-content-center mx-auto" :
                                        smallTabletScreen ? " justify-content-center mx-auto" :
                                            smallDesktopScreen ? " justify-content-center mx-auto text-light" : " me-2"
                                )
                            }

                                style={
                                    {
                                        width: "2.5rem",
                                        height: "2.5rem",
                                        lineHeight: "2.5rem"

                                    }
                                }

                            >
                                {firstNameInitial + lastNameInitial}
                            </div>
                            {
                                smallMobileScreen ? " " :
                                    smallTabletScreen ? " " :
                                        smallDesktopScreen ? " " :
                                            <span className="d-inline-block">
                                                <span className="text-dark">{fullName}</span>
                                            </span>
                            }
                        </div>
                    }

                    id="basic-nav-dropdown" flip>

                    <NavDropdown.Item
                        href="/profile" onMouseEnter={() => handleMouseEnter('profile')} onMouseLeave={() => handleMouseLeave('profile')}
                        className={
                            hover.profile ?
                                "hover hover-primary  px-3 text-primary" : ""
                        }
                    >
                        <span className="me-2">
                            {
                                hover.profile ?
                                    <i className="fa-solid fa-user"></i> :
                                    <i className="fa-regular fa-user"></i>
                            }
                        </span>
                        Profile
                    </NavDropdown.Item>

                    {/* <NavDropdown.Item href="/notifications" onMouseEnter={() => handleMouseEnter('notifications')} onMouseLeave={() => handleMouseLeave('notifications')}
                        className={
                            hover.notifications ?
                                "hover hover-primary  px-3 text-primary" : ""
                        }
                    >
                        {
                            hover.notifications ?
                                <FontAwesomeIcon icon={fas.faBell} className="me-2" /> :
                                <FontAwesomeIcon icon={far.faBell} className="me-2" />
                        }
                        Notifications
                    </NavDropdown.Item> */}
                    {/* <NavDropdown.Item href="/messages" onMouseEnter={() => handleMouseEnter('messages')} onMouseLeave={() => handleMouseLeave('messages')}
                        className={
                            hover.messages ?
                                "hover hover-primary  px-3 text-primary" : ""
                        }
                    >
                        {
                            hover.messages ?
                                <FontAwesomeIcon icon={fas.faEnvelope} className="me-2" /> :
                                <FontAwesomeIcon icon={far.faEnvelope} className="me-2" />
                        }
                        Messages
                    </NavDropdown.Item> */}
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#!" onMouseEnter={() => handleMouseEnter('logout')} onMouseLeave={() => handleMouseLeave('logout')}
                        onClick={
                            handlerForLogout
                        }

                        className={
                            hover.logout ?
                                "hover hover-primary  px-3 text-primary" : ""
                        }
                    >
                        <span className="me-2">
                            {
                                hover.logout ?
                                    <i className="fa-solid fa-right-from-bracket"></i> :
                                    <i className="fa-regular fa-right-from-bracket"></i> // fa-solid fa-sign-out-alt
                            }
                        </span>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>

            </Nav>
        </>
    )
}

export default NavProfile