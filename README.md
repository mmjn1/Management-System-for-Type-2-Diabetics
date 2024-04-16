# A web-based application for managing the health of chronic patients

## Overview

This project is a management application for type 2 diabetic patients who are currently diagonosed with this condition. This application will be built using Django, React, and Djoser for User Authentication.


## Users

The primary users of this application are:
- **Patients:** Can monitor their health, schedule appointments, and communicate with healthcare providers.
- **Doctors:** Can access patient data, provide consultations, and provide guidance to their patients.


## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.


**Cloning the Repository**

Start by cloning the repository to your local machine using a code editor such as Visual Studio Code:

    git clone https://campus.cs.le.ac.uk/gitlab/ug_project/23-24/mmjn1.git


**Setting up the Backend (Django)**

Navigate to the backend directory:
    
    cd healthcare_project

Create a virtual environment and activate it:

For macOS/Linux:

    python3 -m venv venv
    source venv/bin/activate

For Windows:

    python -m venv venv
    .\venv\Scripts\activate 

Install the required Python packages for Django:

    cd healthcare_project/HealthApp
    pip install -r requirements.txt
    cd ..

Create a superuser to access the admin panel:

    python manage.py createsuperuser

This will ask for your Email, First Name, Last Name, Password, and Confirm Password. 

Apply migrations to create the database schema:

    python manage.py migrate

Run the Django development server:

    python manage.py runserver

Your Django development server will be running at http://127.0.0.1:8000/

You can access the admin panel by adding - http://127.0.0.1:8000/admin in the search bar and then enter your email and password


**Setting Up WebSocket Connections with Daphne**
For real-time chat functionality, the project uses Django Channels with Daphne as the ASGI server. 

Create another window in your terminal by clicking the plus button and navigate to the healthcare_project directory by:

    cd mmjn1/healthcare_project

To set up and run Daphne:

    daphne -b 0.0.0.0 -p 8000 healthcare_project.asgi:application

**Setting up the Frontend (React)**
Create another window on your terminal by clicking the + icon

Navigate to the frontend directory:

    cd mmjn1/healthcare_frontend

Install the required Node.js packages:

    npm install

Build the React application:

    npm run build

Start the React development server:

    npm start


**Accessing the Application**
- **Development Mode:** Open http://localhost:3000 in your browser to view the application.





    


