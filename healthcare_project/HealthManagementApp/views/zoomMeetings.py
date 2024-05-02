import requests
import json
import base64
from healthcare_project import settings
import os

"""
This module provides functionalities to interact with the Zoom API for managing Zoom meetings .
It includes functions to generate authentication tokens, retrieve access tokens, and create, update, or delete Zoom meetings.
These capabilities support the scheduling and management of virtual consultations and follow-ups in a healthcare application.

Functions:
- generateToken: Generates a base64-encoded token for Zoom API authentication.
- get_access_token: Retrieves an access token from Zoom using account credentials.
- create_zoom_meeting: Creates a new Zoom meeting with specified details.
- updateZoomMeeting: Updates the start time of an existing Zoom meeting.
- deleteZoomMeeting: Deletes a specified Zoom meeting.
"""

def generateToken():
    """
    Generates a base64-encoded token using the ZOOM_API_KEY and ZOOM_API_SECRET environment variables.
    This token is used for basic authentication in Zoom API requests.

    Returns:
        str: A base64-encoded credentials string for authentication.
    """
    ZOOM_API_KEY = os.getenv('ZOOM_API_KEY')
    ZOOM_API_SECRET = os.getenv('ZOOM_API_SECRET')
    credentials = f"{ZOOM_API_KEY}:{ZOOM_API_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    return encoded_credentials


def get_access_token():
    """
    Retrieves an access token from Zoom using the account credentials grant type.
    This token is necessary for making authenticated requests to the Zoom API.

    Returns:
        str: An access token for use in subsequent Zoom API requests.
    """


    ZOOM_ACCOUNT_ID = os.getenv('ZOOM_ACCOUNT_ID')

    headers = {'Authorization': f'Basic {generateToken()}', 'Content-Type': 'application/json'}

    response = requests.post(
        f'https://zoom.us/oauth/token?grant_type=account_credentials&account_id={ZOOM_ACCOUNT_ID}',
        headers=headers)

    access_token = response.json().get('access_token')
    return access_token


def create_zoom_meeting(start_time, duration, appointment_type, meeting_topic):
    """
    Creates a new Zoom meeting with specified details such as start time, duration, and topic.
    Utilizes the Zoom API to create the meeting and returns the meeting details including the join URL.

    Args:
        start_time (str): The start time of the meeting in ISO 8601 format.
        duration (int): The duration of the meeting in minutes.
        appointment_type (str): The type of appointment (e.g., consultation, follow-up).
        meeting_topic (str): The topic or title of the meeting.

    Returns:
        dict: A dictionary containing details of the created meeting, including the join URL.
    """
    meetingdetails = {
        "topic": meeting_topic,
        "type": 2,
        "start_time": start_time,
        "duration": duration,
        "timezone": settings.TIME_ZONE,
        "agenda": appointment_type,

        "recurrence":
            {"type": 1,
             "repeat_interval": 1
             },
        "settings":
            {"host_video": "true",
             "participant_video": "true",
             "join_before_host": "False",
             "mute_upon_entry": "False",
             "watermark": "true",
             "audio": "voip",
             "auto_recording": "cloud"
             }
    }

    def createMeeting():
        access = get_access_token()
        api_request_header = {
            'Authorization': f'Bearer {access}',
            'Content-Type': 'application/json'
        }
        meeting_request = requests.post(f'https://api.zoom.us/v2/users/me/meetings', headers=api_request_header,
                                        data=json.dumps(meetingdetails))

        return meeting_request.json()

    meeting_link = createMeeting()
    return meeting_link


def updateZoomMeeting(meeting_link, date):
    def update_meeting(meeting_link, date):
        api_request_header = {
            'Authorization': f'Bearer {get_access_token()}',
            'Content-Type': 'application/json'
        }
        meetingdetails = {
            "start_time": date
        }
        meeting_request = requests.patch(f'https://api.zoom.us/v2/meetings/{meeting_link}', headers=api_request_header,
                                         data=json.dumps(meetingdetails))

    update_meeting(meeting_link, date)
    return True


def deleteZoomMeeting(meeting_link):
    def delete_meeting(meeting_link):
        api_request_header = {
            'Authorization': f'Bearer {get_access_token()}',
            'Content-Type': 'application/json'
        }

        requests.delete(f'https://api.zoom.us/v2/meetings/{meeting_link}', headers=api_request_header)

    delete_meeting(meeting_link)
    return True