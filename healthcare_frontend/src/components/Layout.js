import { useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet";
import MainNavbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { user, selectUser, logoutUser } from "../features/user";
import { BounceLoader } from "react-spinners";

import { NavProfile } from "../components/navbars/NavProfile";

import { ScrollTop } from 'primereact/scrolltop';


const Layout = () => {
    const [smallDesktopScreen, setSmallDesktopScreen] = useState(false);
    const [smallTabletScreen, setSmallTabletScreen] = useState(false);
    const [smallMobileScreen, setSmallMobileScreen] = useState(false);


    // Desktop screen size
    useLayoutEffect(() => {
        const updateSize = () =>
            setSmallDesktopScreen(
                window.innerWidth <= 1024 && window.innerWidth > 768
            );
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Tablet the navbar
    useLayoutEffect(() => {
        const updateSize = () =>
            setSmallTabletScreen(window.innerWidth <= 768 && window.innerWidth > 576);
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Mobile screen size
    useLayoutEffect(() => {
        const updateSize = () => setSmallMobileScreen(window.innerWidth <= 576);
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const user = useSelector(selectUser);

    // console.log("Layout, user: ", !isAuthenticated && user ? true : false);

    const [activeNavItem, setActiveNavItem] = useState("dashboard");

    const [hover, setHover] = useState({
        dashboard: false,
        placement: false,
        profile: false,
        logout: false,
        notifications: false,
    });




    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleMouseEnter = (buttonName) => {
        setHover((prevState) => ({
            ...prevState,
            [buttonName]: true,
        }));
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
    };

    const handlerForLogout = () => {
        dispatch(logoutUser())
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    const publicNavbar = (
        <>
            <MainNavbar
                smallDesktopScreen={smallDesktopScreen}
                smallTabletScreen={smallTabletScreen}
                smallMobileScreen={smallMobileScreen}
                setSmallMobileScreen={setSmallMobileScreen}
                setSmallTabletScreen={setSmallTabletScreen}
                setSmallDesktopScreen={setSmallDesktopScreen}
            />
            <Outlet />
        </>
    );

    const privateNavbar = (
        <div>
            <div className=" bg-light">
                <div
                    className={
                        " d-flex " +
                        (smallMobileScreen
                            ? "  flex-column"
                            : smallTabletScreen
                                ? " "
                                : smallDesktopScreen
                                    ? "  "
                                    : " ")
                    }
                >
                    <MainNavbar
                        smallDesktopScreen={smallDesktopScreen}
                        smallTabletScreen={smallTabletScreen}
                        smallMobileScreen={smallMobileScreen}
                        setSmallMobileScreen={setSmallMobileScreen}
                        setSmallTabletScreen={setSmallTabletScreen}
                        setSmallDesktopScreen={setSmallDesktopScreen}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleNavItemClick={handleNavItemClick}
                        handlerForLogout={handlerForLogout}
                        activeNavItem={activeNavItem}
                        hover={hover}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        loading={loading}
                    />
                    <div
                        className={
                            "bg-light " +
                            (smallMobileScreen
                                ? " "
                                : smallTabletScreen
                                    ? " col-10"
                                    : smallDesktopScreen
                                        ? "  col-10"
                                        : " col-10")
                        }
                    >
                        <div className="">
                            <div
                                className={
                                    " my-2 mx-3"
                                    // +
                                    // (smallMobileScreen ? " d-flex " :
                                    //     smallTabletScreen ? " col-10" :
                                    //         smallDesktopScreen ? "  d-inline-block" : " d-inline-block")
                                }
                            >
                                {/* // nav profile component */}
                                <NavProfile
                                    smallDesktopScreen={smallDesktopScreen}
                                    smallTabletScreen={smallTabletScreen}
                                    smallMobileScreen={smallMobileScreen}
                                    handleMouseEnter={handleMouseEnter}
                                    handleMouseLeave={handleMouseLeave}
                                    handleNavItemClick={handleNavItemClick}
                                    handlerForLogout={handlerForLogout}
                                    user={user}
                                    loading={loading}
                                    hover={hover}
                                />

                                {/* // All the childer components */}
                                <Outlet />
                                <ScrollTop />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const isAuthUser = isAuthenticated && user ? true : false;

    console.log("isAuthUser: ", isAuthUser);

    // if loading true then set a 2 sec loading screen
    const [loadingScreen, setLoadingScreen] = useState(true);
    setTimeout(() => {
        setLoadingScreen(false);
    }, 100);

    const loader = loadingScreen || loading;

    return loader ? (
        <>
            <div className="vh-100 d-flex justify-content-center align-items-center">
                {/* <BounceLoader color={'#123abc'} loading={loader} size={50} /> */}
                Loading....
            </div>
        </>
    ) : isAuthUser ? (
        privateNavbar
    ) : (
        publicNavbar
    );
};

export default Layout;