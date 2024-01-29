import React from 'react';
// import navbar from './components/navbar.js';


const Layout = (props) => (
    <div>
        <navbar />
        {props.children}
    </div>
)

export default Layout;
