Sprint 1: User Registration and Authentication 

Sprint Duration: 27 days 

Sprint Goal:  

Implement a secure user registration and authentication system that will allow patients, doctors, and medical staff to create accounts and log in to the application. 

 

Backlog Items: 

User Account Creation: 

As a new user, I want to create an account so that I can access personalized features of the diabetes management system. 

Djoser Endpoint: create (used for user registration). 

 

Email Verification: 

As a new user, I want to verify and activate my account through an email verification process after registration, ensuring my account is secure and active. 

Djoser Endpoint: activate the user account. 

 

Resend Activation Email: 

As a new user, if I didn’t receive or accidentally deleted the activation email, I want to request another activation email. 

Djoser Endpoint: resend activation email (allows users to request another activation email). 

 

Password Reset and Set:  

As a user who has forgotten my password, I want to reset it so that I can regain access to my account. 

As a user who has received a reset password link, I want to set a new password for my account. 

Djoser Endpoints: reset password and set password (to reset and set a new password). 

 

Password Reset Confirmation Email: 

As a user, I want to receive an email confirmation that my password has been reset just for a reassurance. 

Djoser endpoint - reset password confirmation. 

 

 

 

 

 

 

Sprint Planning:  

Install and configure Djoser in django project for handling user registration and authentication. 

Create database models for user accounts in Django. 

Defined serializers for models, to allow user model to converted to JSON for React to receive. 

Implement features of library such as send email verification on frontend UI.] 

Configure Djoser settings for JWT creation and account verification emails. 

Write the API endpoints using Django REST Framework for different user authentication actions the user such as create user (POST request), activate user account (POST), etc. 

Test all the endpoints using example data on Postman API platform. 

Develop React components to develop the registration and login forms for patient and doctor. 

Implement Redux Toolkit slices for managing authentication state in the frontend and making API requests to the backend. 

Integrate redux toolkit on each page to make sure user actions are dealt and state is updated accordingly. 

Ensure CSRF protection is properly configured for form submissions. 

 

Scrum Notes: 

Spent first day of sprint setting up user stories, issue boards, planning for the first sprint. Established a clear framework for the sprint's tasks and goals.


Configured djoser endpoints in the Django backend for user authentication. Tested the endpoints for basic functionality (registration, login). 

Djoser endpoints for registration and login are functional. However, did encounter issues with endpoint configuration which required additional troubleshooting. Faced issues linking frontend with backend in terms of authenticating the user when logging in. 

Attempted to integrate the React frontend with Django's authentication endpoints and focused on establishing a connection for user login functionality. Faced difficulties in linking frontend with backend for user authentication and the token handling with state management during login. I plan to resolve the frontend-backend integration issues. I will review the redux toolkit documentation to help with this. 

 

Sprint Review: 

Completed items: 

Integrated the Djoser library with the Django project, enabling user registration and authentication. 

Implemented token-based user authentication, allowing for secure login and session management. 

Established Redux Toolkit slices for handling the authentication state, linking the frontend to the backend auth services. 

Conducted initial testing, which included unit tests for Django models and endpoints, and basic functional tests on the React components. 

All backend features and endpoints have been successfully tested with Postman. This includes user registration, login, email verification, and password reset functionalities, which are all working as expected. 

Developed the user models for different roles, ensuring each has the necessary fields and properties to support the intended functionalities of the diabetes management system. 

Created the React components for both the login and registration pages, establishing the structure of the user interface. 

 

Incomplete items: 

Email verification process is partially implemented; the backend sends out emails, but the frontend handling of the verification link is pending. 

The password reset and set functionality is operational on the backend, but the frontend UI for these processes needs further refinement. 

Due to other university commitments and the learning curve with RTK Query with state management in React, the frontend UI hasn’t been fully completed. The work done will be carried over into the next sprint.  

This includes finalising the UI for creating an account, login, email verification, password reset, and enhancing the token authentication process for the patient and doctor roles on the frontend. 

 

Sprint Retrospective:  

The Djoser library significantly simplified the implementation of user authentication and saved development time. 

Integrating Redux Toolkit for state management was more complex than anticipated, it required additional research and learning. 

Due to university work and complexity of integrating the RTK query in React for first time, the sprint’s progress was slower than expected 

I will allocate more time for frontend and backend integration testing and plan for potential challenges with state management. 

For the next sprint, more focus will be on frontend integration, specifically completing the UI for email verification, password, and enhancing token authentication for different user roles. 

 

Next Sprint Plan: 

The next sprint will focus on integrating the frontend with the backend authentication flow, implementing the account activation functionality, and refining the user interface based on the feedback received during this review, and addressing the incomplete items from the current sprint. 