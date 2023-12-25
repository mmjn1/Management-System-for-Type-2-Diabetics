import React from 'react';
//import Navbar from './components/Navbar.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div>
            {/* <Navbar/> */}
            <h1> Welcome to Sugarcaree </h1>
        </div>
    );
};

export default WelcomePage;