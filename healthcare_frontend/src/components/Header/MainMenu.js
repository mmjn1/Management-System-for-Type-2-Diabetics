import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const MainMenu = () => {
    const [activeItem, setActiveItem] = useState('home'); // default active item

    const handleSetActive = (itemName) => {
        setActiveItem(itemName); // Set the active item state
    };

    return (
        <nav id="navbar" className="navbar order-last order-lg-0">

            <ul>
                <li className={activeItem === 'why-us' ? 'home active' : 'home'} onClick={() => handleSetActive('why-us')}>
                    <HashLink 
                       to="/#why-us" 
                       scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                       className='nav-link scrollto'
                       style={{ fontSize: '16px' }}>  {/* Add this line */}

                        <i></i>
                        <span> Home </span>
                    </HashLink>
                </li>
               
                <li className={activeItem === 'services' ? 'home active' : 'home'} onClick={() => handleSetActive('services')}>
                    <HashLink 
                       to="/#services" 
                       scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                       className='nav-link scrollto'
                        style={{ fontSize: '16px' }}>  {/* Add this line */}
                        <i></i>
                        <span> Services</span>
                    </HashLink>
                </li>
           

                <li className={activeItem === 'about' ? 'home active' : 'home'} onClick={() => handleSetActive('about')}>
                    <HashLink 
                       to="/#about" 
                       scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                       className='nav-link scrollto'
                       style={{ fontSize: '16px' }}>  {/* Add this line */}
                        <i></i>
                        <span>  Data Privacy</span>
                    </HashLink>
                </li>

                <li className={activeItem === 'faq' ? 'home active' : 'home'} onClick={() => handleSetActive('faq')}>
                    <HashLink 
                       to="/#faq" 
                       scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                       className='nav-link scrollto'
                        style={{ fontSize: '16px' }}>  {/* Add this line */}

                        <i></i>
                        <span>  FAQs </span>
                    </HashLink>
                </li>

                <li className={activeItem === 'contact' ? 'home active' : 'home'} onClick={() => handleSetActive('contact')}>
                    <HashLink 
                       to="/#contact" 
                       scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                       className='nav-link scrollto'
                        style={{ fontSize: '16px' }}>  {/* Add this line */}

                        <i></i>
                        <span>  Contact </span>
                    </HashLink>
                </li>               
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
    )
        ;
};

export default MainMenu;
