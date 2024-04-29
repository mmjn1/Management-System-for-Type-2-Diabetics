from django.http import JsonResponse
import requests
import json
import base64
from healthcare_project import settings

"""
This module defines a view function for creating Zoom meetings through the Zoom API. It includes functionality to generate an authorization token, configure meeting details, and handle the API request to create a meeting and retrieve its start URL.

Functions:
    my_view(start_time, duration): Creates a Zoom meeting with the specified start time and duration, returning the URL to start the meeting.

The function utilizes API credentials to authenticate requests, sets up meeting parameters such as topic, duration, and advanced settings like video options and recording settings. It makes use of the Zoom API to create the meeting and fetch the start URL which is then returned to the caller.
"""



def my_view(start_time, duration):
    """
    Creates a Zoom meeting with specified start time and duration, and returns the meeting's start URL.

    This function handles the creation of a Zoom meeting by first generating an authorization token using
    API credentials. It then sets up the meeting details such as topic, type, start time, duration, and various
    settings like video options and recording settings. A POST request is made to the Zoom API to create the
    meeting and obtain the start URL, which is then returned.

    Args:
        start_time (str): The start time of the meeting in ISO 8601 format.
        duration (int): The duration of the meeting in minutes.

    Returns:
        str: The URL to start the Zoom meeting.
    """

    # API credentials and account ID
    API_KEY = 'oLSGFTN1S3ehkkaOEePX4g'
    API_SEC = 'MCYGxVZ014wF4cEaWoum6y2mqgrGgJnp'
    account_id = 'Khclk_7aQfqC6xNmCgdn8w'

    def generateToken():
        credentials = f"{API_KEY}:{API_SEC}"
        encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
        return encoded_credentials

    meetingdetails = {"topic": "The title of your zoom meeting",
                      "type": 2,
                      "start_time": start_time,
                      "duration": duration,
                      "timezone": settings.TIME_ZONE,
                      "agenda": "test",

                      "recurrence": {"type": 1,
                                     "repeat_interval": 1
                                     },
                      "settings": {"host_video": "true",
                                   "participant_video": "true",
                                   "join_before_host": "False",
                                   "mute_upon_entry": "False",
                                   "watermark": "true",
                                   "audio": "voip",
                                   "auto_recording": "cloud"
                                   }
                      }

    # Function to create a Zoom meeting and return the start URL
    def createMeeting():
        headers = {
            'Authorization': f'Basic {generateToken()}',
            'Content-Type': 'application/json'
        }

        response = requests.post(f'https://zoom.us/oauth/token?grant_type=account_credentials&account_id={account_id}',
                                 headers=headers)

        access_token = response.json().get('access_token')

        api_request_header = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        meeting_request = requests.post(f'https://api.zoom.us/v2/users/me/meetings', headers=api_request_header,
                                        data=json.dumps(meetingdetails))
        return meeting_request.json().get('start_url')


    # Create the meeting and return the start URL
    meeting_link = createMeeting()
    return meeting_link
