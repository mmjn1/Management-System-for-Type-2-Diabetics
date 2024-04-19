**Sprint 5**

**Sprint Goal**

- Develop a flexible and secure custom records feature that allows doctors to create, edit, and manage custom forms for patient information collection.

**Backlog items**

- As a doctor, I want to be able to create custom forms for different types of patient records, so that I can collect specific information relevant to each patient's condition.
- As a doctor, I want to be able to edit and update custom forms, so that the forms can evolve as the needs of my practice change.
- As a patient, I want to view the forms filled out by my doctor in a read-only format, so that I can review the information provided by the doctor without the risk of altering any data.

**Sprint Planning**

1. Database Schema Design:
    - Design a normalized database schema for custom forms and responses.
    - Ensure the schema supports versioning of forms to track changes over time.

2. API Development:
    - Develop RESTful API endpoints for CRUD operations on custom forms.
    - Implement authentication and authorization checks on these endpoints.

3. Form Builder Implementation:
    - Design and implement a user-friendly form builder interface in the frontend.
    - Allow dynamic field addition, including text, dropdowns, checkboxes, and date pickers.

4. Form Renderer Development:
    - Create a dynamic form renderer that adapts to the structure of any custom form created by the builder.
    - Implement client-side validation based on the form configuration.

5. Data Validation:
    - Implement comprehensive validation rules in the backend to ensure data integrity.
    - Add front-end validations to provide immediate feedback to users.

**Sprint Review**
1. Database Schema Design:
    - Successfully designed a normalised database schema for custom forms and responses.
    - Implemented versioning for forms, allowing for tracking of changes and historical data retrieval.

2. API Development:
    - Developed and deployed RESTful API endpoints for CRUD operations on custom forms.
    - Implemented robust authentication and authorisation checks, ensuring secure access to these endpoints.

3. Form Builder Implementation
    - Launched a user-friendly form builder interface in the frontend.
    - Enabled dynamic field addition such as text, dropdowns, checkboxes, and date pickers, enhancing flexibility for users.

4. Form Renderer Development:
    - Completed a dynamic form renderer that adapts to any form structure created r by the builder.
    - Integrated client-side validation to ensure data integrity before submission.

5. Data Validation:
    - Established comprehensive server-side validation rules to maintain data integrity.
    - Implemented immediate frontend validations, providing users with real-time feedback.

**Sprint Retrospective**

What Went Well:
- Successfully designed and integrated a normalized database schema which is scalable and robust.
- RESTful API endpoints for CRUD operations were implemented efficiently, with proper authentication and authorization which ensured security.
- The user-friendly form builder interface in the frontend was well-received for its intuitive design and functionality.
- Dynamic form renderer and client-side validation were implemented, which increased the reliability of form submissions.
- Immediate frontend validations provided a seamless user experience by giving users real-time feedback.

Challenges:
- Encountered challenges with ensuring compatibility of the form renderer with all field types and potential user inputs, requiring iterative testing and revisions.
- Needed to refine server-side validation rules to handle edge cases and prevent any possible data corruption.
- Balancing the flexibility of the form builder while maintaining a structure that aligns with backend expectations required careful planning and implementation.

**Next Sprint Plan:**

- Implement a food logger interface that allows patients to log what they’ve eaten for each meal where they’d receive feedback on the impact it has on their sugar levels