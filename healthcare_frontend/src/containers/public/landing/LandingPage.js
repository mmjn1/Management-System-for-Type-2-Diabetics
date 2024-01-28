import React from "react";
import Footer from "../../../components/Footer/FooterPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from 'react-router-hash-link';


const LandingHome = () => {
    return (
        <>
            <section id="hero" className="d-flex align-items-center">
            <div className="container">
                <h1>Welcome to GlucoCare!</h1>
                <h2> Empower your health, empower your life...</h2>
                <HashLink 
                    to="/auth/register" 
                    className="btn-get-started scrollto"
                    scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>

                    Get Started
                </HashLink>
            </div>
        </section>
            <main id="main">
                <section id="why-us" className="why-us">
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-4 d-flex align-items-stretch">
                                <div className="content">
                                    <h3>Why Choose Glucocare?</h3>
                                    <p>
                                    GlucoCare is dedicated to revolutionizing diabetes management. 
                                    Our comprehensive platform empowers individuals with type 2 diabetes to take control of their health with state-of-the-art tools and real-time data.
                                    </p>

                                </div>
                            </div>
                            <div className="col-lg-8 d-flex align-items-stretch">
                                <div className="icon-boxes d-flex flex-column justify-content-center">
                                    <div className="row">
                                        <div className="col-xl-4 d-flex align-items-stretch">
                                            <div className="icon-box mt-4 mt-xl-0">
                                                <i className="bx bx-receipt"></i>
                                                <h4> Understand Your Health</h4>
                                                <p> Gain insights into your health trends and patterns with our easy-to-use dashboard. Track your blood sugar levels
                                                    dietary habits, and exercise routines to better understand your health.</p>
                                                
                                            </div>
                                        </div>
                                        <div className="col-xl-4 d-flex align-items-stretch">
                                            <div className="icon-box mt-4 mt-xl-0">
                                                <i className="bx bx-cube-alt"></i>
                                                <h4> Connect with Care</h4>
                                                <p> Seamlessly communicate with your healthcare providers through GlucoCare. Share health updates, ask Questions
                                                    and recieve professional advice all in one place.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 d-flex align-items-stretch">
                                            <div className="icon-box mt-4 mt-xl-0">
                                                <i className="bx bx-images"></i>
                                                <h4>Stay on Track</h4>
                                                <p> You'll recieve reminders for medications and appointments meaning that you 
                                                    never miss an important step in your health routine.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                s
                            </div>
                        </div>

                    </div>
                </section>
                <section id="about" className="about">
                    <div className="container-fluid">

                        <div className="row">
                            <div
                                className="col-xl-5 col-lg-6 video-box d-flex justify-content-center align-items-stretch position-relative">
                                
                            </div>

                            <div
                                className="col-xl-7 col-lg-6 icon-boxes d-flex flex-column align-items-stretch justify-content-center py-5 px-lg-5">
                                        <h3> Our Commitment to Data Privacy </h3>
                                
                                <p>At GlucoCare, safeguarding your personal health information is our top priority. 
                                    We understand the importance of privacy in healthcare and are dedicated to protecting your data with the highest standards of security.</p>

                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-fingerprint"></i></div>
                                    <h4 className="title"> State-of-the-Art Security</h4>
                                    <p className="description"> Our platform uses advanced encryption and security protocols to ensure that your health data is always protected, both in transit and at rest.</p>
                                </div>

                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-gift"></i></div>
                                    <h4 className="title">GDPR Compliance</h4>
                                    <p className="description"> We adhere to the General Data Protection Regulation Act (GDPR) guidelines, ensuring all your health information is handled with confidentiality and integrity.</p>
                                </div>

                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-atom"></i></div>
                                    <h4 className="title">User Control</h4>
                                    <p className="description"> You have full control over your health data. 
                                        You decide what to share and whom to share it with, giving you complete autonomy over your personal information.</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>
               
                <section id="services" className="services">
                    <div className="container">

                        <div className="section-title">
                            <h2>Services</h2>
                            <p> GlucoCare offers a comprehensive suite of tools designed to empower patients with 
                                type 2 diabetes to take control of their health.
                            </p>
                        </div>

                        <div className="row">
                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-heartbeat"></i></div>
                                    <h4><a href=""> Health Tracking</a></h4>
                                    <p>Monitor your health, including blood sugar levels and carbohydrate consumption in an easy-to-use 
                                        format that helps you see the bigger picture of your health.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-pills"></i></div>
                                    <h4><a href=""> Medication Management</a></h4>
                                    <p>Stay on top of your medication schedule with reminders and digital prescriptions. Easily refill
                                        your prescriptions by sending a request to your doctor.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-hospital-user"></i></div>
                                    <h4><a href=""> Consulation Scheduling</a></h4>
                                    <p>Book and manage appointments with your healthcar providers. Get reminders for upcoming visits and reschedule 
                                        easily if needed.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-dna"></i></div>
                                    <h4><a href="">Educational Resources</a></h4>
                                    <p>Learn more about managing type 2 diabetes with a library of articles, videos, and other resources curated by medical
                                        professionals.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-wheelchair"></i></div>
                                    <h4><a href=""> Dietary Planning</a></h4>
                                    <p> Access personalised meal plans and nutrition advice tailored to your health needs. Keep track of your meals and 
                                        get suggestions for maintaining a balanced diabetic diet.
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4">
                                <div className="icon-box">
                                    <div className="icon"><i className="fas fa-notes-medical"></i></div>
                                    <h4><a href="">Direct Communication with Doctors</a></h4>
                                    <p> GlucoCare's messaging feature simplifies how you communicate with your healthcare team. With secure, direct messaging, 
                                        managing your diabetes care is more personalised and accessible than ever.</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
               
                
                <section id="faq" className="faq section-bg">
                    <div className="container">

                        <div className="section-title">
                            <h2>Frequently Asked Questions</h2>
                            <p>Got questions about GlucoCare or diabetes management? Find answers to some of the most common inquiries below.</p>
                        </div>

                        <div className="faq-list">
                            <ul>
                                <li data-aos="fade-up">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       className="collapse"
                                                                                       data-bs-target="#faq-list-1" >How does GlucoCare help me manage my diabetes?
                                                                                       <i
                                        className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-1" className="collapse show" data-bs-parent=".faq-list">
                                        <p>
                                        GlucoCare provides you with tools to track your blood glucose levels, monitor your diet and exercise, 
                                        and manage your medication schedules, all in one place.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="100">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-2"
                                                                                       className="collapsed"> Is my health data secure
                                                                                       with GlucoCare? <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-2" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                        Yes, we prioritize your privacy and security. 
                                        All data in GlucoCare is encrypted and stored in compliance with GDPR regulations.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="200">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-3"
                                                                                       className="collapsed">Can I share my health data with my doctor?
                                                                                       <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-3" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                        Absolutely. GlucoCare allows you to share your health data with your healthcare provider, facilitating better communication and care.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="300">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-4"
                                                                                       className="collapsed">What kind of support can I expect from GlucoCare?
                                                                                       <i
                                        className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-4" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            GlucoCare will allow you to directly communicate with your healthcare providers, to help you with 
                                            any questions or concerns you may have regarding your health.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="400">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-5"
                                                                                       className="collapsed">How does 
                                                                                       GlucoCare personalise my care plan?
                                     <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-5" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            GlucoCare personalises your diet plan based on your health data ensuring that your diabetes management is as effective
                                            and convenient as possible.
                                        </p>
                                    </div>
                                </li>

                            </ul>
                        </div>

                    </div>
                </section>
               
                <section id="contact" className="contact">
                    <div className="container">

                        <div className="section-title">
                            <h2> Get in touch with GlucoCare!</h2>
                            <p> We're here to help you with any questions or support you need on your journey to better diabetes management.
                                Contact us using the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row mt-5">

                            <div className="col-lg-4">
                                <div className="info">
                                    <div className="address">
                                        <i className="bi bi-geo-alt"></i>
                                        <h4>Location:</h4>
                                        <p>University Road, Leicester, LE1 7RH </p>
                                    </div>

                                    <div className="email">
                                        <i className="bi bi-envelope"></i>
                                        <h4>Email:</h4>
                                        <p>info@example.com</p>
                                    </div>

                                    <div className="phone">
                                        <i className="bi bi-phone"></i>
                                        <h4>Call:</h4>
                                        <p>+1 5589 55488 55s</p>
                                    </div>

                                </div>

                            </div>

                            <div className="col-lg-8 mt-5 mt-lg-0">

                                <form action="forms/contact.php" method="post" role="form" className="php-email-form">
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input type="text" name="name" className="form-control" id="name"
                                                   placeholder="Your Name" required/>
                                        </div>
                                        <div className="col-md-6 form-group mt-3 mt-md-0">
                                            <input type="email" className="form-control" name="email" id="email"
                                                   placeholder="Your Email" required/>
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="text" className="form-control" name="subject" id="subject"
                                               placeholder="Subject" required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <textarea className="form-control" name="message" rows="5" placeholder="Message"
                                                  required></textarea>
                                    </div>
                                    <div className="my-3">
                                        <div className="loading">Loading</div>
                                        <div className="error-message"></div>
                                        <div className="sent-message">Your message has been sent. Thank you!</div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit">Send Message</button>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </div>
                </section>

            </main>

            <Footer/>
        </>
    )
};

export default LandingHome;
