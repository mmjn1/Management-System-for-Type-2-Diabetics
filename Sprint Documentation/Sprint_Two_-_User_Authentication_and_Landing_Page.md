**Sprint 2**

**Sprint Duration: 25 days**

**Sprint Goal:** 

- Integrate and finalise the user authentication frontend, ensuring a secure and smooth login experience.
- Develop a responsive landing page that serves as an entry point for both patients and doctors into the system.

**Backlog Items:**

**User Authentication** 

User Account Creation - As a new user, I want to create an account so that I can access personalised features of the diabetes management system. 

Email Verification - As a new user, I want to verify and activate my account through an email verification process after registration, ensuring my account is secure and active.  

Reset Password - As a user who has forgotten my password, I want to reset it so that I can regain access to my account. 

Set Password - As a user who has received a reset password link, I want to set a new password for my account. 

Login/Sign-in - As a user (patient or doctor), I want to be able to securely sign into my account so that I can access my personal or personal information quickly or safely

Logout Functionality - As a logged-in user, I want the ability to securely log out of my account, so that I can ensure that no-one else can access my personal information from the same device after I'm done using the application.

**Landing page**

Welcome Banner 

- As a person with diabetes, I want to feel assured that I've come to a supportive place that understands my health needs.

Services Overview 

- As a person with diabetes, I want to quickly understand how this system can help me track and manage my condition.

FAQ Section 

- As someone diagnosed with diabetes, I want to find answers to common questions about managing my condition with this system.

Contact Information 

- As a patient or doctor, I want to contact the support team to discuss any queries I may have about the application.

Doctor's Profile section 

- As a user, I want to see information about the doctors who specialise in diabetes care, so that I can make an informed decision about choosing a specialist for my needs.

Data Privacy Section

- As a user, I want to be informed about how my personal health information is handled, so that I feel secure in using the platform for my healthcare needs.

**Daily sprint notes:**

- Reviewed sprint goals and backlog items.
- Prioritised tasks for user authentication and landing page development.
  Began development on the registration forms, focusing on tabbed navigation and responsive design.
- Initiated layout for the landing page's Welcome Banner section.
- Encountered some issues with form validation logic, followed tutorials on Yup which is a validation library
- Started integrating the registration forms with the Django backend using RTK query.
- Planned API requirements and security measures for user data.
- Planned design and layout of the Services, Doctors, Data Privacy, FAQs and Contact section.
- Updated the landing page content, focusing on clarity and user engagement.
- Conducted initial testing of the registration process and identified areas for improvement.
- Refined the landing page's FAQ section for better readability and user support.

**Sprint Planning**

**User Authentication**

1. Develop Registration Form (Register.js)
- Implement tabbed navigation between Doctor and Patient registration forms.
- Ensure the form is responsive and adheres to accessibility standards.
1. Create Doctor Registration Form (DoctorForm.js)
- Develop a multi-step form for doctor registration, including fields for basic information, professional credentials, and practice details.
- Integrate form validation using Yup schema.
- Implement form submission logic with appropriate error handling.
1. Create Patient Registration Form (PatientForm.js):
- Develop a multi-step form for patient registration, including fields for medical background, lifestyle details, and emergency contact information.
- Include calendar input for date selection and validate form fields using Yup schema.
- Handle form data submission and provide user feedback upon success or failure.
1. Account Registration Success (sending email verification)
- Override the perform\_create method from the djoser library to send an activation link when the user submits the form
1. Reset password with email (enter email address) 
- Create a form for user to enter email which triggers an email to be sent if the email exists in the system
1. User sets a new password and password has been reset
- Create a form for the user to enter their password and confirm their new password

**Landing page**

1. Welcome Banner (Home Section)
- Create and style the Welcome Banner section with a clear Call to Action (CTA).
- Implement smooth scrolling to the registration form when the CTA is clicked.
1. Services Overview
- Develop the Services section with individual cards or icons for each service.
- Ensure each service description is concise and clearly communicates the value proposition.
1. Doctor's Profile on HomePage Section
- Design the layout for displaying doctor profiles.
- Populate the profiles with static content, including images, names, specialties, and bios.
1. Data Privacy Information Section on Homepage
- Construct the Data Privacy section, outlining security, compliance, and user control.
- Utilise appropriate icons and ensure the text is accessible and easy to read.
1. FAQ Section
- Implement an expandable/collapsible FAQ section.
- Ensure the questions and answers are well-organized and informative.
1. Contact Information
- Create a contact section with a form for users to submit their inquiries to the backend. Include RTK query to do this
- Include static contact information like location, email, and phone number.

**Sprint Review**

**User authentication** 

- Successfully integrated multi-step forms for both patient and doctor registration processes, providing a smooth transition between each step with backend validation checks.
- Refined error handling to provide users with clear, actionable feedback on any issues encountered during form submission.
- Established secure handling and transmission of sensitive information to the Django backend.
- Conduct thorough testing of the login and registration to ensure they work seamlessly with the backend.
- Review the performance of authentication-related pages, especially the loading times which could be affected by API calls to the backend.
- Implemented tabbed navigation for the Register.js component, allowing users to switch between Doctor and Patient registration forms.
- Developed DoctorForm.js with multi-step functionality, capturing essential information for doctor onboarding.
- Constructed PatientForm.js with detailed fields for medical history, lifestyle information, and a calendar for date inputs.
- Integrated form validation for both Doctor and Patient forms using Yup to ensure data integrity.
- Set up state management hooks to handle user input and control form flow.


**Landing page**

- Completed the Welcome Banner with a clear Call-To-Action (CTA) that navigates to the registration page.
- Developed the Services Overview section, showcasing the main features of GlucoCare with relevant icons and descriptions.
- Designed and implemented the Doctors Profile section, displaying profiles of medical specialists associated with GlucoCare.
- Created the Data Privacy section, emphasising GlucoCare's commitment to user data security and GDPR compliance.
- Added an interactive FAQ section, providing answers to common questions about GlucoCare and diabetes management.
- Established a Contact Information section with a fully functional contact form and validation which submits to the backend using RTK query.

**Sprint Retrospective:**

**Successes**

- Breaking down the registration into a multi-step form approach when creating the form components helped with maintainability and reusability.
- RTK Query was used effectively to handle API calls, caching, and state management, which streamlined the development process and reduced bugs.
- Addressed complexities in Redux Toolkit state management with additional research.
- Following tutorials and documentations helped improve my knowledge.
- Users are able  

**Challenges**

- Balancing the time between coding and research was more demanding than I had anticipated, which sometimes led to longer development time.
- Designing and positioning the React components was quite challenging, requiring me to spend time watching tutorials and reading documentations.
- The learning curve with RTK query significantly increased development time
- Underestimated how complex user authentication can be due to state management and need to complete the remaining three tickets


**Next Sprint Plan**

- Develop the appointments page where patients can book appointments with the doctor and vice vera
- Complete Reset Password, Set Password, and Logout functionality tickets in the next sprint
