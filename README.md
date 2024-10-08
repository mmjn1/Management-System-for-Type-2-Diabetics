# A web-based application for managing the health of chronic patients

## Overview

This project is a management application for type 2 diabetic patients who are currently diagonosed with this condition. This application will be built using Django, React, and Djoser for User Authentication. The application was containerised using Docker and deployed onto AWS Elastic Container Service (ECS), ensuring scalability and ease of management.


## AWS Architecture

Below is the architecutre diagram of the application deployed on AWS:

![AWS Architecture Diagram](./images/aws_architecture.png)


## Users

The primary users of this application are:
- **Patients:** Can monitor their health, schedule appointments, and communicate with healthcare providers.
- **Doctors:** Can access patient data, provide consultations, and provide guidance to their patients.


## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes. Note that running the entire application will require opening multiple terminal windows to manage different components simultaneously. In total, you should expect to have five terminal windows open.


**Cloning the Repository**

Start by cloning the repository to your local machine using a code editor such as Visual Studio Code:

    git clone https://github.com/mmjn1/Management-System-for-Type-2-Diabetics.git


## Setting up the Backend (Django)

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

This will ask for your email, first name, last Name, password, and confirm password. 

Apply migrations to create the database schema:

    python manage.py migrate

Run the Django development server:

    python manage.py runserver

Your Django development server will be running at http://127.0.0.1:8000/

You can access the admin panel by adding - http://127.0.0.1:8000/admin in the search bar and then enter your email and password.


## Setting Up WebSocket Connections with Daphne
For real-time chat functionality, the project uses Django Channels with Daphne as the ASGI server. 

Create another window in your terminal by clicking the plus button and navigate to the healthcare_project directory by:

    cd mmjn1/healthcare_project

To set up and run Daphne:

    daphne -b 0.0.0.0 -p 8000 healthcare_project.asgi:application


## Setting up Redis:

*For macOS:*

Redis can be installed on macOS using Homebrew:

    brew install redis

To start Redis server as a background service that will automatically restart at login:

    brew services start redis

*For Windows:*

You can install Redis on Windows using the MSI installer available at:

    https://github.com/tporadowski/redis/releases

Download the `.msi` file and follow the installation instructions. After installation, you can start the Redis server through the start menu or by using the following command in Command Prompt:

    redis-server


## Running Celery Worker and Beat Services:

Celery is used in this project to handle background tasks such as sending automated appointment reminders to users. These reminders ensure that both patients and doctors are reminded of important appointments. The Celery Worker processes these tasks, while Celery Beat schedules them at specified intervals.

After setting up Redis, which acts as the message broker for Celery, follow these steps to run the Celery worker and beat services.


After setting up Redis, you will need to run Celery worker and beat services to handle task processing and scheduling.

Open a new terminal window and type **cd /mmjn1/healthcare_project** and then run the following command to start the Celery worker, which will process the tasks:

    celery -A healthcare_project.celery worker --pool=solo -l info
    

Open another new terminal window and run the following command to start the Celery beat service, which will schedule the periodic tasks:

    celery -A healthcare_project beat -l INFO   
    

**Important:** Ensure you have the Redis server running before you start these Celery services. The Celery worker and beat services must be running in separate terminal windows or as background processes in order for the application to process and schedule tasks correctly.



## Setting up the Frontend (React):
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


    


