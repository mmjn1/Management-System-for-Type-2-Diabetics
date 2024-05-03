from django.views import View
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from rest_framework import generics, permissions
from rest_framework.generics import RetrieveAPIView

from HealthManagementApp.serialisers.serializers import * 
from HealthManagementApp.models import SupportInquiry
from HealthManagementApp.models.users import Doctor
from HealthManagementApp.Utils.utils import account_activation_token
from django.shortcuts import redirect
from HealthManagementApp.models.users import Doctor, Patient
from HealthManagementApp.models import WeeklyAvailability, TimeSlot
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from HealthManagementApp.models import DoctorAppointment, PatientAppointment
from HealthManagementApp.models import Form, Field, FormResponse, FieldResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import status
from datetime import datetime, date
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.views import APIView
from HealthManagementApp.models import Form, Field
from rest_framework.generics import ListAPIView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseNotAllowed
from django.http import HttpResponse
from HealthManagementApp.models import UserMealEntry
import json
import os
import logging
from HealthManagementApp.models import location
from django.core.mail import EmailMultiAlternatives
from collections import defaultdict
from HealthManagementApp.views.test import my_view
from django.template.loader import get_template
from HealthManagementApp.views.zoomMeetings import create_zoom_meeting, updateZoomMeeting, deleteZoomMeeting
from datetime import datetime
from datetime import timedelta

login_url = os.environ.get('FRONT_END_URL_LOGIN')

User = get_user_model()
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
from openai import OpenAI


############################  Dietary Tracking ##########################################################

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_dietary_advice(request):
    """
    Processes POST requests to provide dietary advice based on user input using an AI model.

    This view function handles POST requests where users submit their dietary queries. It utilises
    an AI model, specifically fine-tuned for providing dietary advice to users.
    The function parses the user's input from the request, interacts with the AI model to generate
    dietary advice, and then stores this interaction in the database. If successful, it returns the
    advice along with a unique identifier for the database entry. For non-POST requests or errors,
    it returns an appropriate error message.

    Args:
    request (HttpRequest): The request object containing the user input in its body.

    Returns:
    JsonResponse: A JSON response containing either the dietary advice and entry ID or an error message.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_input = data.get("user_input")

            # Ensure the user is authenticated and has an associated patient profile
            if not request.user.is_authenticated or not hasattr(request.user, 'patient_user'):
                return JsonResponse({'error': 'Authentication required or no associated patient profile'}, status=403)

            patient = request.user.patient_user


            response = client.chat.completions.create(
                model="ft:gpt-3.5-turbo-0125:personal:dietary-advice-bot:9CUENrwC",
                messages=[
                    {
                        "role": "system",
                        "content": "This chatbot provides dietary advice for people with type 2 diabetes."
                    },
                    {
                        "role": "user",
                        "content": user_input
                    }
                ],
                max_tokens=150,
                temperature=0.7,
                frequency_penalty=0,
                presence_penalty=0,
            )
            advice = response.choices[0].message.content

            entry = UserMealEntry.objects.create(
                patient=patient,
                user_input=user_input,
                ai_advice=advice
            )
            return JsonResponse({
                'id': entry.id,  
                'advice': advice
            }, status=201)  
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

logger = logging.getLogger(__name__)





@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_dietary_advice(request, entry_id):
    """
    Updates the dietary advice for a specific user meal entry based on new user input.

    This view function handles PATCH requests to update the dietary advice for an existing
    UserMealEntry identified by `entry_id`. It retrieves the new user input from the request,
    uses an OpenAI model to generate updated dietary advice, and saves this advice in the database.
    If the entry does not exist or there is an error in processing, it returns an appropriate
    error response.

    Args:
    request (HttpRequest): The request object containing the new user input in its body.
    entry_id (int): The primary key of the UserMealEntry to update.

    Returns:
    JsonResponse: A JSON response containing the updated entry ID and advice, or an error message.
    """
    if request.method != "PATCH":
        return HttpResponseNotAllowed(['PATCH'])

    try:
        data = json.loads(request.body)
        user_input = data.get("user_input")
        if not user_input:
            return JsonResponse({'error': 'Missing user input'}, status=400)

        entry = UserMealEntry.objects.get(pk=entry_id)
        entry.user_input = user_input

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0125:personal:dietary-advice-bot:9CUENrwC",
            messages=[
                {"role": "system", "content": "This chatbot provides dietary advice for people with type 2 diabetes."},
                {"role": "user", "content": user_input}
            ],
            max_tokens=150,
            temperature=0.7,
            frequency_penalty=0,
            presence_penalty=0,
        )
        advice = response.choices[0].message.content
        entry.ai_advice = advice
        entry.save()

        return JsonResponse({'id': entry.id, 'advice': advice}, status=200)

    except UserMealEntry.DoesNotExist:
        logger.error(f"UserMealEntry with id {entry_id} not found.")
        return JsonResponse({'error': 'UserMealEntry not found'}, status=404)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)



@api_view(['DELETE'])
def delete_dietary_advice(request, entry_id):
    """
    Handles the deletion of a dietary advice entry from the database.

    This view function is responsible for deleting a UserMealEntry instance based on the provided entry_id.
    It only allows DELETE requests to ensure that the operation is safe from accidental data modification.
    Upon successful deletion, it returns a success message. If the entry does not exist, it returns a 404 error.
    Any other exceptions are caught and reported as a 500 internal server error.

    Args:
    request (HttpRequest): The request object used to perform the delete operation.
    entry_id (int): The primary key of the UserMealEntry to be deleted.

    Returns:
    JsonResponse: A JSON response indicating the result of the delete operation, either successful or an error message.
    """
    if request.method == "DELETE":
        try:
            # Find the existing UserMealEntry instance
            entry = UserMealEntry.objects.get(pk=entry_id)
            
            # Delete the entry
            entry.delete()

            # Return a success response
            return JsonResponse({'message': 'Entry deleted successfully'}, status=200)

        except UserMealEntry.DoesNotExist:
            return JsonResponse({'error': 'UserMealEntry not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return HttpResponseNotAllowed(['DELETE'])

####################################################################################################################


"""
SupportInquiryView handles the creation of new SupportInquiry instances.
Defined the queryset as all instances of SupportInquiry.
The serializer_class is set to SupportInquirySerializer, 
which will handle the conversion between Django models and JSON.

"""
class SupportInquiryView(generics.CreateAPIView):
    queryset = SupportInquiry.objects.all()
    serializer_class = SupportInquirySerializer

"""
DoctorView handles the retrieval of all Doctor instances on the Patient Registration Form.
Defined the queryset as all instances of Doctor.
The serializer_class is set to DoctorSerializer, which will handle the conversion between Django models and JSON.

"""
class DoctorView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


# fetches the details of a single doctor onto the calendar
class DoctorDetailView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


# Fetching all the patients
class PatientView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = NewPatientSerializer


# Fetching the details of the currently logged in patient
class CurrentPatientDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Assuming there's a one-to-one relationship between User and Patient
        patient = Patient.objects.get(user=request.user)
        serializer = NewPatientSerializer(patient)

        return Response(serializer.data)

# Fetching the details of a single patient
class PatientDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        # Fetch the patient by ID
        patient = get_object_or_404(Patient, pk=patient_id)
        serializer = NewPatientSerializer(patient)
        return Response(serializer.data)


#Fetches the timeslots onto the doctor's weekly availability form
class TimeSlotView(RetrieveAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer


class VerificationView(View):
    """
    A view that handles the verification of user accounts through a unique link sent to the user's email.

    This view decodes a base64 encoded user ID and a token from the URL, checks the validity of the token,
    and activates the user's account if the token is valid and the account is not already active. If the
    account is already active or the token is invalid, it redirects to the login page with an appropriate
    message. Upon successful activation, it redirects to a success page.

    Args:
    request (HttpRequest): The HTTP request object.
    uidb64 (str): The base64 encoded ID of the user.
    token (str): The token to verify the user.

    Returns:
    HttpResponse: A redirect to either a login page with a message, an account activation success page,
                  or a generic success page in case of exceptions.
    """
    def get(self, request, uidb64, token):
        try:
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=id)

            if not account_activation_token.check_token(user, token):
                return redirect('login' + '?message=', 'User Already activated, Please login')

            if user.is_active:
                return redirect('Account Activated!')
            user.is_active = True
            user.save()
            messages.success(request, 'Account activated Successfully')
            return redirect('AccountSuccess')
        except Exception as ex:
            return redirect('AccountSuccess')


def activate_account(request):
    return redirect(login_url)
   

def list_locations(request):
    locations = {choice[0]: choice[1] for choice in TimeSlot.LOCATION_CHOICES}
    return JsonResponse(locations)


########################################################################################################



class PatientListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NewPatientSerializer

    def get_queryset(self):
        """
        This view returns a list of all the patients
        for the currently authenticated doctor.
        """
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'doctor'):
            # Filter patients based on the many-to-many relationship with the doctor
            return Patient.objects.filter(doctors__user=user)
        else:
            # If the user is not a doctor or not authenticated, return an empty queryset
            return Patient.objects.none()
        

##################################### Custom Forms Views  #########################################################

class FormList(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


class FormDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer


# API view to submit form responses by the authenticated doctor
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_form_response(request, form_id):
    try:
        # Retrieve the form and associated entities
        form = get_object_or_404(Form, pk=form_id)
        doctor = get_object_or_404(Doctor, user=request.user)
        patient_id = request.data.get('patient_id')
        
        if not patient_id:
            return JsonResponse({'error': 'Patient ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        patient = get_object_or_404(Patient, pk=patient_id)

        # Create a new form response
        form_response = FormResponse.objects.create(form=form, doctor=doctor, patient=patient)

        field_responses = request.data.get('responses')
        
        # Check if responses are provided
        if not field_responses:
            return JsonResponse({'error': 'No responses provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Process each field response
        for field_response_data in field_responses:
            field_id = field_response_data.get('field')
            value = field_response_data.get('value')
            
            if field_id is None or value is None:
                return JsonResponse({'error': 'Field ID or value missing in one of the responses.'}, status=status.HTTP_400_BAD_REQUEST)
            
            field = get_object_or_404(Field, pk=field_id)
            FieldResponse.objects.create(form_response=form_response, field=field, value=value)

        return JsonResponse({'message': 'Form response submitted successfully.'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Handle any exceptions that occur during form submission
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the form submission.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Allows the Doctor update an existing form response
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_form_response(request, form_id):
    try:
        # Ensure the user has a doctor profile
        doctor_profile = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({'error': 'No doctor profile found for user.'}, status=status.HTTP_400_BAD_REQUEST)

    patient_id = request.data.get('patient_id')
    
    # Ensure patient_id is provided
    if not patient_id:
        return Response({'error': 'Patient ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve the patient object
    patient = get_object_or_404(Patient, pk=patient_id)

    # Attempt to retrieve an existing FormResponse or create a new one
    form_response, created = FormResponse.objects.get_or_create(
        form_id=form_id, 
        doctor=doctor_profile, 
        patient=patient
    )
    
    # Assuming `request.data['responses']` is a list of dictionaries with 'field' and 'value'
    for response_data in request.data['responses']:
        field_id = response_data.get('field')
        value = response_data.get('value')
        # Ensure field_id and value are provided
        if field_id is None or value is None:
            return Response({'error': 'Field ID and value are required.'}, status=status.HTTP_400_BAD_REQUEST)

        field = get_object_or_404(Field, pk=field_id)

        # Create or update the FieldResponse
        FieldResponse.objects.update_or_create(
            form_response=form_response,
            field=field,
            defaults={'value': value}
        )
    
    return Response({'message': 'Form response updated successfully.'}, status=status.HTTP_200_OK)


# Fetch the patients treated by the currently authenticated doctor onto the Custom Form creation form
class PatientListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NewPatientSerializer

 
    def get_queryset(self):
        # Retrieve the Doctor instance for the logged-in user
        doctor = get_object_or_404(Doctor, user=self.request.user)
        # Return patients treated by this doctor
        return Patient.objects.filter(doctors=doctor)


# Fetch the Custom Form created by the doctor onto the Patient's dashboard under My Records
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_forms(request, patient_id):
    # Ensure the patient exists and is the one making the request
    patient = get_object_or_404(Patient, pk=patient_id, user=request.user)

    # Get all form responses for this patient
    form_responses = FormResponse.objects.filter(patient=patient)

    # Prepare the data to be serialized
    forms_data = []
    for form_response in form_responses:
        form_data = {
            'form_name': form_response.form.name,
            'doctor_name': form_response.doctor.user.get_full_name(),
            'created_at': form_response.created_at,
            'responses': []
        }

        # Get all field responses for this form response
        field_responses = FieldResponse.objects.filter(form_response=form_response)
        for field_response in field_responses:
            form_data['responses'].append({
                'field_label': field_response.field.label,
                'response_value': field_response.value
            })

        forms_data.append(form_data)

    return Response(forms_data)

###########################################################################################################################################################################

############################################### User Profile Update Views for Patients and Doctors #########################################################

# Updating Account Information - Doctor
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_doctor_account_info(request):
    doctor = get_object_or_404(Doctor, user=request.user)
    user_serializer = CustomUserSerializer(doctor.user, data=request.data, partial=True)

    if user_serializer.is_valid():
        user_serializer.save()
    else:
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    doctor_data = {key: value for key, value in request.data.items() if key not in ['first_name', 'last_name', 'email']}
    if doctor_data:  # Checks if there are doctor-specific fields to update
        doctor_serializer = DoctorSerializer(doctor, data=doctor_data, partial=True)
        if doctor_serializer.is_valid():
            doctor_serializer.save()
        else:
            return JsonResponse(doctor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse(user_serializer.data, status=status.HTTP_200_OK)


# Updating Doctor's Professional Information
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_professionalInfo(request):
    doctor = get_object_or_404(Doctor, user=request.user)
    
    serializer = DoctorSerializer(doctor, data=request.data, partial=True)  
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating the Doctor's Practice Information
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_PracticeInfo(request):
    doctor = get_object_or_404(Doctor, user=request.user)
    
    serializer = DoctorSerializer(doctor, data=request.data, partial=True)  
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating Account Information - Patient
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_patient_account_info(request):
    patient = get_object_or_404(Patient, user=request.user)
    
    serializer = NewPatientSerializer(patient, data=request.data, partial=True)  # partial=True allows for partial updates
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating Health Information - Patient
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_patient_healthinfo(request):
    patient = get_object_or_404(Patient, user=request.user)
    
    serializer = NewPatientSerializer(patient, data=request.data, partial=True)  
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating Lifestyle & Medical Information - Patient
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_patient_lifestylemed_info(request):
    patient = get_object_or_404(Patient, user=request.user)
    
    serializer = NewPatientSerializer(patient, data=request.data, partial=True)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#########################§#################################################################################################

    
def health_check(request):
    """
    AWS ECS uses this view checks the health of the application container.
    Returns an HTTP 200 response with "OK" to indicate the service is operational.
    """
    return HttpResponse("OK", status=200)

############################################# Appointments ######################################################### 

def doctor_appointment_types_view(request):
    """
    Fetches and returns the appointment types available for doctors as a JSON response.
    
    This view retrieves the appointment type choices defined for DoctorAppointment and
    formats them into a list of dictionaries, each containing a 'key'
    and 'value'. The JsonResponse is not considered 'safe',
    hence `safe=False` is explicitly specified to allow list serialization.
    """
    appointment_types = DoctorAppointment.APPOINTMENT_TYPE_CHOICES
    data = [{"key": key, "value": display} for key, display in appointment_types]
    return JsonResponse(data, safe=False)  # `safe=False` is required for non-dict objects to be serialized to JSON

# fetching the appointment types - Patient
def patient_appointment_types_view(request):
    appointment_types = PatientAppointment.APPOINTMENT_TYPE_CHOICES
    # Convert choices to a list of dicts
    data = [{"key": key, "value": display} for key, display in appointment_types]
    return JsonResponse(data, safe=False)


# fetch the patients from the patient_doctors table into doctor's appointment form
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patients_for_doctor(request):
    doctor = request.user.doctor_user
    patients = Patient.objects.filter(doctors=doctor)
    serializer = PatientDropdownSerializer(patients, many=True)
    return Response(serializer.data)


class list_locations(generics.ListAPIView):
    queryset = location.objects.all()
    serializer_class = locationSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_weekly_availability(request):
    """
    Creates a new weekly availability entry for a doctor.

    This view handles POST requests to create a new weekly availability for the authenticated doctor.
    It uses the WeeklyAvailabilitySerializer to validate and serialize the request data. If the data is valid,
    it saves the new weekly availability to the database and returns the created availability data with a
    201 CREATED status. If the data is invalid, it returns the errors with a 400 BAD REQUEST status.

    Args:
    request (HttpRequest): The request object containing the weekly availability data.

    Returns:
    Response: A Django REST framework Response object with the serialized availability data and a 201 CREATED status,
              or an error message and a 400 BAD REQUEST status if the data is invalid.
    """
    serializer = WeeklyAvailabilitySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating Weekly Availability (Doctor)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_weekly_availability(request, pk):
    weekly_availability = get_object_or_404(WeeklyAvailability, pk=pk)
    serializer = WeeklyAvailabilitySerializer(weekly_availability, data=request.data, partial=True,
                                              context={'request': request})
    if serializer.is_valid():
        serializer.save()

        # Send a WebSocket message to the doctor's channel group
        channel_layer = get_channel_layer()
        group_name = f'doctor_{weekly_availability.doctor_id}'
        message = {
            'type': 'doctor_availability_update',
            'message': 'Doctor availability updated'
        }
        # Use async_to_sync to call the asynchronous group_send method
        async_to_sync(channel_layer.group_send)(
            group_name,
            message
        )

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def DoctorAvailability(request):
    """
    Updates the availability of the logged-in doctor based on the provided days and timeslots.

    This view handles a POST request to update the weekly availability and specific timeslots for the logged-in doctor.
    It expects data containing days marked as 'selected' with their corresponding timeslots. The function ensures
    data integrity and efficiency by using transactions and bulk operations.

    Args:
    request (HttpRequest): The request object containing the logged-in user and the data payload with days and timeslots.

    Returns:
    Response: A Django REST framework Response object with a success message and a 201 CREATED status if the update
              is successful, or an error message with a 400 BAD REQUEST status if required data is missing.
    
    The process involves:
    - Retrieving the current logged-in doctor.
    - Checking if the 'days' data is provided in the request.
    - Using a database transaction to ensure all updates are performed atomically.
    - Filtering and updating existing availability records to prevent overwriting existing working days.
    - Creating new availability records for days that are newly marked as working.
    - Deleting old timeslots and creating new timeslots for the selected days.
    """
    user = request.user
    doctor = Doctor.objects.get(user=user)  # Assuming you only want to update the availability for the logged-in doctor
    days_data = request.data.get('days')

    if not days_data:  # Handle empty days_data
        return Response({"error": "No 'days' data provided"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():  # For data integrity
        # Bulk update for efficiency
        selected_days = [item['day'] for item in days_data if item.get('selected')]

        WeeklyAvailability.objects.filter(doctor=doctor, day_of_week__in=selected_days).exclude(
            is_working=True  # Ensure we don't overwrite True with False
        ).update(is_working=False)

        new_availabilities = [
            WeeklyAvailability(
                doctor=doctor,
                day_of_week=item['day'],
                is_working=True
            ) for item in days_data if item.get('selected') and item['day'] not in selected_days
            
        ]
        WeeklyAvailability.objects.bulk_create(new_availabilities)

        # Efficient deletion and creation of TimeSlot objects
        for item in days_data:
            if item.get('selected'):
                day_get, created = WeeklyAvailability.objects.get_or_create(
                    doctor=doctor,
                    day_of_week=item['day']
                )
                day_get.is_working = True
                day_get.save()
                TimeSlot.objects.filter(weekly_availability=day_get).delete()  # Delete old slots

                new_slots = [
                    TimeSlot(
                        weekly_availability=day_get,
                        start_time=slot_item['start_time'],
                        end_time=slot_item['end_time'],
                        location_id=slot_item['location']['id']
                    ) for slot_item in item.get('slots', [])
                ]
                TimeSlot.objects.bulk_create(new_slots)

    return Response({"message": "Availability updated successfully"}, status=status.HTTP_201_CREATED)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weekly_availability(request):
    """
    This view retrieves the weekly availability of a specified doctor.

    This view handles GET requests to fetch the weekly availability for a doctor based on the doctor's ID provided
    in the query parameters. It requires the user to be authenticated. If the 'doctor_id' is provided, it fetches
    and returns the serialized availability data. If the 'doctor_id' is not provided, it returns a 400 Bad Request response.

    Parameters:
    - request (HttpRequest): The request object that contains metadata about the request including query parameters.

    Returns:
    - Response: A Django REST framework Response object containing the serialized weekly availability data if a valid
      'doctor_id' is provided. Otherwise, it returns an error response indicating that the 'doctor_id' was not provided.
    """
    doctor_id = request.query_params.get('doctor_id', None)

    if doctor_id is not None:
        # Fetching weekly availability records for the doctor
        availability = WeeklyAvailability.objects.filter(doctor_id=doctor_id)

        # Serialize the data
        serializer = WeeklyAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)
    else:
        # If no doctor_id is provided, return a bad request response
        return Response(
            {'detail': 'No doctor_id provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_appointment(request, appointment_id):
    """
    This view deletes a specific appointment based on the appointment ID provided.

    This view handles DELETE requests to remove an appointment from the database. It first checks if the appointment
    exists and whether the requesting user is authorized to delete it (either the doctor or the patient associated with
    the appointment). If the appointment is found and the user is authorized, it sends a notification to the relevant
    doctor's group before deleting the appointment from the database.

    Args:
    - request (HttpRequest): The request object containing metadata about the request.
    - appointment_id (int): The primary key of the appointment to be deleted.

    Returns:
    - Response: A Django REST framework Response object. If the appointment is successfully deleted, it returns a success
      message with a 200 OK status. If the appointment does not exist, it returns an error message with a 404 Not Found status.
      If the user is unauthorized to delete the appointment, it returns an error message with a 403 Forbidden status.
      If the appointment lacks associated doctor or patient, it returns an error message with a 400 Bad Request status.
    """
    try:
        appointment = PatientAppointment.objects.get(id=appointment_id)
    except PatientAppointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    if appointment.doctor is None or appointment.patient is None:
        return Response({'error': 'Appointment does not have an associated doctor or patient.'},
                        status=status.HTTP_400_BAD_REQUEST)

    if request.user.id == appointment.doctor.user.id or request.user.id == appointment.patient.user.id:
        # Send a message to the group before deleting the appointment
        channel_layer = get_channel_layer()
        group_name = f'doctor_{appointment.doctor.user.id}'  # Assuming you have a group per doctor
        message = {
            'type': 'appointment_deleted',  # This should match the method name in the consumer
            'appointment_id': appointment_id
        }
        # Send message to group
        async_to_sync(channel_layer.group_send)(group_name, message)

        # Delete the appointment
        appointment.delete()
        return Response({'message': 'Appointment deleted successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': "You do not have permission to delete this appointment."},
                        status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_doctor_availability(request):
    """
    This view retrieves the available time slots for a specified doctor on a given date.

    This view processes GET requests to fetch the time slots when a doctor is available based on the doctor's ID and a specific date provided in the query parameters. It returns a list of available time slots or appropriate error messages if the required parameters are missing or incorrect.

    Parameters:
    - request (HttpRequest): The request object containing 'doctorId' and 'date' as query parameters.

    Returns:
    - JsonResponse: A list of available time slots serialized into JSON format if found.
    - Response: An error message with a corresponding status code if required parameters are missing, the date format is incorrect, or no availability data is found.
    """
    doctor_id = request.query_params.get('doctorId')
    selected_date = request.query_params.get('date')

    if not doctor_id or not selected_date:
        return Response({'error': 'Missing doctorId or date parameter'}, status=400)

    try:
        # Convert the selected_date string to a datetime object
        selected_date = datetime.datetime.strptime(selected_date, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

    # Determine the day of the week (e.g., 'Monday')
    day_of_week = selected_date.strftime('%A')

    try:
        # Fetch the weekly availability for the given doctor and day of the week
        weekly_availability = WeeklyAvailability.objects.get(doctor_id=doctor_id, day_of_week=day_of_week)

        # Fetch the time slots for the found weekly availability
        time_slots = TimeSlot.objects.filter(weekly_availability=weekly_availability).order_by('start_time')

        # Serialize the time slots data
        time_slots_data = [{
            'id': slot.id,
            'start_time': slot.start_time.strftime('%H:%M:%S'),
            'end_time': slot.end_time.strftime('%H:%M:%S'),
            'location': slot.location
        } for slot in time_slots]

        return JsonResponse(time_slots_data, safe=False)

    except WeeklyAvailability.DoesNotExist:
        return Response({'error': 'No availability found for this doctor on the selected day.'}, status=404)
    except TimeSlot.DoesNotExist:
        return Response({'error': 'No time slots found for this availability.'}, status=404)


# Patient Appointment Creation to the Doctor
# Send an email confirmation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def old_create_patient_appointment(request):
    serializer = PatientAppointmentSerializer(data=request.data)

    if serializer.is_valid():
        # Save the appointment
        appointment = serializer.save()

        # Mark the time slot as unavailable
        if appointment.time_slot:
            appointment.time_slot.is_available = False
            appointment.time_slot.save()

        # Sends a WebSocket message to the doctor's group
        channel_layer = get_channel_layer()
        # Access the doctor's user ID through the user field
        doctor_user_id = appointment.doctor.user.id
        group_name = f'doctor_{doctor_user_id}'
        message = {
            'type': 'send_appointment_notification',
            'notification': {
                'appointment_id': appointment.id,
                'action': 'create',
                'appointment_data': PatientAppointmentSerializer(appointment).data
            }
        }
        async_to_sync(channel_layer.group_send)(group_name, message)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Fetches the timeslots onto the doctor's weekly availability form
class TimeSlotView(RetrieveAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_time_slot_doctor(request):
    doctor_id = request.query_params.get('doctor_id', None)

    if doctor_id is not None:
        time_slots = (TimeSlot.objects.filter(weekly_availability__doctor_id=doctor_id,
                                              weekly_availability__is_working=True)
        .select_related('location',
                        'weekly_availability').order_by(
            'weekly_availability__day_of_week', 'start_time'
        ))

        grouped_time_slots = defaultdict(list)
        for time_slot in time_slots:
            day_of_week = time_slot.weekly_availability.day_of_week
            grouped_time_slots[day_of_week].append(time_slot)

        # Serialize grouped data
        result = {}
        for day, slots in grouped_time_slots.items():
            result[day] = TimeSlotSerializer(slots, many=True).data

        return Response(result, status=status.HTTP_200_OK)
    else:

        return Response(
            {'detail': 'No doctor_id provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )


# fetches the details of a single doctor onto the calendar
class DoctorDetailView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


def format_hour_12(hour):
    """
    Converts a 24-hour format hour into a 12-hour format with AM/PM notation.

    Args:
    hour (int): The hour in 24-hour format.

    Returns:
    str: The hour in 12-hour format followed by 'AM' or 'PM'.

    Examples:
    - If the input is 0, it returns '12 AM' (midnight).
    - If the input is 13, it returns '1 PM'.
    """
    if hour == 0:  # Special case for midnight
        return "12 AM"
    elif hour >= 1 and hour <= 12:
        return f"{hour} AM"
    else:  # Hour > 12
        return f"{hour - 12} PM"


def time_difference(t1, t2):
    """
    Calculates the difference in minutes between two time objects.

    Args:
    t1 (datetime.time): The start time.
    t2 (datetime.time): The end time.

    Returns:
    float: The difference in minutes between t1 and t2.

    Examples:
    - If t1 is 09:00 and t2 is 10:00, it returns 60.0.
    - If t1 is 14:00 and t2 is 15:30, it returns 90.0.

    Note:
    This function assumes both times occur on the same day.
    """
    import datetime as locald

    dateTimeA = locald.datetime.combine(locald.date.today(), t1)
    dateTimeB = locald.datetime.combine(locald.date.today(), t2)

    dateTimeDifference = dateTimeB - dateTimeA
    return dateTimeDifference.total_seconds() / 60

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_appointment(request):
    """
    Creates a new patient appointment and sends an email notification with the appointment details.

    This view handles POST requests to create a new appointment for a patient with a specific doctor, time slot, and appointment type. It also schedules a Zoom meeting for the appointment and sends an email to both the patient and the doctor with the appointment details.

    Args:
    request (HttpRequest): The request object containing the appointment data.

    Returns:
    Response: A Django REST framework Response object. Returns the serialized appointment data with a 201 CREATED status if the appointment is successfully created. Returns an error message with a 400 BAD REQUEST status if the appointment data is invalid.

    The function performs the following steps:
    - Deserialize and validate the incoming data.
    - Retrieve necessary objects like Doctor, Patient, and TimeSlot based on the provided IDs.
    - Calculate the appointment duration and schedule a Zoom meeting.
    - Create a Zoom meeting record in the database.
    - Update the PatientAppointment instance with the Zoom meeting link.
    - Format the start and end times to a 12-hour format.
    - Send an email to both the patient and the doctor with the appointment details.
    - Serialize the created appointment instance and return it in the response.
    """
    import datetime as locald

    serializer = PatientAppointmentSerializerOther(data=request.data)

    if serializer.is_valid():
        serializer.save()
        doctor = request.data.get('doctor')
        patient = request.data.get('patient')
        time_slot = request.data.get('time_slot')
        appointment_date = request.data.get('appointment_date')
        appointment_type = request.data.get('appointment_type')
        doctor_data = Doctor.objects.get(id=doctor).user
        doctor_email = doctor_data.email
        doctor_name = doctor_data.first_name + " " + doctor_data.last_name
        patient_data = Patient.objects.get(id=patient).user
        patient_email = patient_data.email
        patient_name = patient_data.first_name + " " + patient_data.last_name
        timeslots = TimeSlot.objects.get(id=time_slot)
        start_hour = timeslots.start_time.hour
        end_hour = timeslots.end_time.hour
        start_hour_diff = timeslots.start_time
        end_hour_diff = timeslots.end_time
        to = [patient_email, doctor_email]

        time_diff = time_difference(start_hour_diff, end_hour_diff)
        appointment_date = locald.datetime.strptime(appointment_date, "%Y-%m-%d").date()
        timeslot = locald.datetime.strptime(str(timeslots.start_time), "%H:%M:%S").time()
        combined_datetime = locald.datetime.combine(appointment_date, timeslot)
        formatted_datetime = combined_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        location = timeslots.location
        meeting_topic = f'Meeting {patient_name} and {doctor_name}'
        link_to_meeting = create_zoom_meeting(formatted_datetime, time_diff, appointment_type, meeting_topic)

        MeetingID = link_to_meeting.get('id')
        host_id = link_to_meeting.get('host_id')
        host_email = link_to_meeting.get('host_email')
        topic = link_to_meeting.get('topic')
        start_time = link_to_meeting.get('start_time')
        duration = link_to_meeting.get('duration')
        timezone = link_to_meeting.get('timezone')
        agenda = link_to_meeting.get('agenda')
        created_at = link_to_meeting.get('created_at')
        start_url = link_to_meeting.get('start_url')
        join_url = link_to_meeting.get('join_url')
        password = link_to_meeting.get('password')
        zoom_id = Zoom_modal.objects.create(MeetingID=MeetingID, host_id=host_id, host_email=host_email, topic=topic,
                                            start_time=start_time, duration=duration, timezone=timezone, agenda=agenda,
                                            created_at=created_at,
                                            start_url=start_url, join_url=join_url, password=password)

        PA = PatientAppointment.objects.get(id=serializer.data['id'])
        PA.meeting_link = zoom_id
        PA.save()

        start_hour_12 = format_hour_12(start_hour)
        end_hour_12 = format_hour_12(end_hour)
        subject = 'You have one upcoming appointment'
        from_email = EMAIL_HOST_USER
        data_format = {
            'patient_name': patient_name,
            'doctor_name': doctor_name,
            'start_time': start_hour_12,
            'end_time': end_hour_12,
            'link_to_meeting': start_url,
            'location': location,
            'appointment_date': appointment_date,
            'appointment_type': appointment_type
        }
        htmly = get_template('AppointmentEmail.HTML')
        html_content = htmly.render(data_format)
        msg = EmailMultiAlternatives(subject, html_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        appointment = serializer.instance
        serializer_depth = PatientAppointmentSerializerDepth(appointment)

        return Response(serializer_depth.data, status=status.HTTP_201_CREATED)
    
    else:
        error_message = list(serializer.errors.values())[0][0]
        return Response({"message": error_message}, status=status.HTTP_400_BAD_REQUEST)


class patient_appointment_data(APIView):
    """
    This class-based view handles appointment data retrieval, updates, and deletion.

    Methods:
    - get_queryset: Retrieves the queryset based on the appointment ID from the URL.
    - get_object: Fetches the specific appointment object using the primary key.
    - get: Returns the serialized data of a specific appointment.
    - patch: Updates the appointment data partially and sends an email notification about the update.
    - delete: Cancels a specific appointment and sends an email notification about the cancellation.

    Each method ensures that operations are performed on the correct appointment instance by retrieving it
    using the appointment ID provided in the URL. The patch method also handles updating associated Zoom meeting details
    and sending formatted email notifications to both the doctor and the patient.
    """

    def get_queryset(self):
        return PatientAppointment.objects.filter(id=self.kwargs['pk'])

    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.get(pk=self.kwargs['pk'])
        return obj

    def get(self, request, pk, format=None):
        appointment = self.get_object()
        serializer = PatientAppointmentSerializerDepth(appointment)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        import datetime as locald

        appointment = self.get_object()
        serializer = PatientAppointmentSerializerOther(appointment, data=request.data, partial=True)

        instance = self.get_object()
        patient = instance.patient.user
        doctor = instance.doctor.user
        doctor_email = doctor.email

        appointment_type = instance.appointment_type
        doctor_name = doctor.first_name + " " + doctor.last_name
        patient_email = patient.email
        patient_name = patient.first_name + " " + patient.last_name
        appointment_date = instance.appointment_date
        time_slot = instance.time_slot
        start_hour = time_slot.start_time.hour
        end_hour = time_slot.end_time.hour
        start_hour_12 = format_hour_12(start_hour)
        end_hour_12 = format_hour_12(end_hour)
        location = time_slot.location

        link_to_meeting = instance.meeting_link
        appointment_date_local = request.data.get('appointment_date')
        appointment_date_mine = locald.datetime.strptime(appointment_date_local, "%Y-%m-%d").date()
        timeslot = locald.datetime.strptime(str(time_slot.start_time), "%H:%M:%S").time()
        combined_datetime = locald.datetime.combine(appointment_date_mine, timeslot)
        formatted_datetime = combined_datetime.strftime("%Y-%m-%dT%H:%M:%S")

        updateZoomMeeting(link_to_meeting.MeetingID, formatted_datetime)

        Zoom_modal.objects.filter(id=link_to_meeting.id).update(start_time=formatted_datetime)
        to = [patient_email, doctor_email]

        subject = f'Your appointment for {appointment_date} at {time_slot} is updated'
        from_email = EMAIL_HOST_USER

        data_format = {
            'patient_name': patient_name,
            'doctor_name': doctor_name,
            'start_time': start_hour_12,
            'end_time': end_hour_12,
            'location': location,
            'appointment_date': appointment_date,
            'link_to_meeting': link_to_meeting.start_url,
            'appointment_type': appointment_type
        }
        htmly = get_template('AppointmentEmail.HTML')
        html_content = htmly.render(data_format)
        msg = EmailMultiAlternatives(subject, html_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        if serializer.is_valid():
            serializer.save()
            return Response(PatientAppointmentSerializerDepth(serializer.instance).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        appointment = self.get_object()
        appointment.delete()
        patient = appointment.patient.user
        doctor = appointment.doctor.user
        doctor_email = doctor.email
        doctor_name = doctor.first_name + " " + doctor.last_name
        patient_email = patient.email
        patient_name = patient.first_name + " " + patient.last_name
        appointment_date = appointment.appointment_date
        time_slot = appointment.time_slot
        start_hour = time_slot.start_time.hour
        end_hour = time_slot.end_time.hour
        start_hour_12 = format_hour_12(start_hour)
        end_hour_12 = format_hour_12(end_hour)
        location = time_slot.location
        to = [patient_email, doctor_email]
        MeetingID = appointment.meeting_link
        deleteZoomMeeting(MeetingID.MeetingID)
        MeetingID.delete()
        subject = f'Your appointment for {appointment_date} at {time_slot} is cancelled'
        from_email = EMAIL_HOST_USER

        data_format = {
            'patient_name': patient_name,
            'doctor_name': doctor_name,
            'start_time': start_hour_12,
            'end_time': end_hour_12,
            'location': location,
            'appointment_date': appointment_date,
        }
        htmly = get_template('AppointmentCancelled.HTML')
        html_content = htmly.render(data_format)
        msg = EmailMultiAlternatives(subject, html_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_appointment(request):
    """
    This view retrieves and return all patient appointments associated with a specific doctor.

    This view handles GET requests to fetch patient appointments based on the doctor's ID provided in the query parameters.
    It requires the user to be authenticated and will only proceed if a 'doctor_id' is provided in the request.
    If the 'doctor_id' is not provided, it responds with a 400 Bad Request status.

    Parameters:
    - request (HttpRequest): The request object that contains metadata about the request.

    Returns:
    - Response: A Django REST framework Response object containing the serialized patient appointment data if a valid
      'doctor_id' is provided. Otherwise, it returns an error response indicating that the 'doctor_id' was not provided.
    """
    doctor_id = request.query_params.get('doctor_id', None)

    if doctor_id is not None:
        availability = PatientAppointment.objects.filter(doctor_id=doctor_id)
        serializer = PatientAppointmentSerializerDepth(availability, many=True)
        return Response(serializer.data)

    else:
        return Response({'detail': 'No doctor_id provided.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_appointment_patient(request):
    """
    This view retrieves and return all appointments for a specific patient.

    This view handles GET requests to fetch all appointments associated with a given patient ID, which is provided
    through the query parameters. It requires the user to be authenticated. If the 'patient_id' is not provided or is invalid,
    it responds with a 400 Bad Request status.

    Parameters:
    - request (HttpRequest): The request object that contains metadata about the request including query parameters.

    Returns:
    - Response: A Django REST framework Response object containing the serialized patient appointment data if a valid
      'patient_id' is provided. Otherwise, it returns an error response indicating that the 'patient_id' was not provided.
    """
    patient_id = request.query_params.get('patient_id', None)

    if patient_id is not None:
        availability = PatientAppointment.objects.filter(patient_id=patient_id)
        serializer = PatientAppointmentSerializerDepth(availability, many=True)
        return Response(serializer.data)

    else:
        return Response({'detail': 'No patient_id provided.'}, status=status.HTTP_400_BAD_REQUEST)


class AppointmentFollowupView(generics.RetrieveUpdateDestroyAPIView):
    """
    This view handles the retrieval, update, and deletion of follow-up notes for a specific appointment.

    It utilizes the PatientAppointmentSerializerOther for serialization of the appointment data.
    The queryset filters the PatientAppointment model to retrieve an appointment by its primary key (id),
    which is provided via URL parameters. This allows operations to be performed on a specific appointment instance.
    
    Methods:
    - get_serializer_class: Returns the serializer class used for the appointment data.
    - get_queryset: Filters and returns the appointment instance based on the primary key.
    """

    def get_serializer_class(self):
        return PatientAppointmentSerializerOther

    def get_queryset(self):
        return PatientAppointment.objects.filter(id=self.kwargs['pk'])



class DoctorAvailabilityView(APIView):
    """
    This view handles the retrieval of available time slots for a specified doctor on a given date.
    It first validates the date format, then checks if the specified doctor exists and is working on that day.
    If the doctor is available, it fetches and returns all available time slots excluding those already booked.
    
    Methods:
        get(request, doctor_id, date_data): Retrieves available time slots for the doctor on the specified date.
    
    URL Parameters:
        doctor_id (int): The primary key of the doctor whose availability is being queried.
        date_data (str): The date for which availability is requested, in 'YYYY-MM-DD' format.
    
    Responses:
        - 400 Bad Request: If the date format is invalid or the doctor ID does not exist.
        - 200 OK: Returns a list of available time slots or a message indicating no availability.
    """
    def get(self, request, doctor_id, date_data):

        try:
            # Validate date format (YYYY-MM-DD)
            input_date = datetime.strptime(date_data, '%Y-%m-%d')

        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            doctor = Doctor.objects.get(pk=doctor_id)  # Assuming you have a Doctor model
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if doctor is working on the requested date
        weekday = input_date.strftime('%A')  # Get weekday name (Monday, Tuesday, etc.)
        try:
            weekly_availability = WeeklyAvailability.objects.get(doctor=doctor, day_of_week=weekday)
        except WeeklyAvailability.DoesNotExist:
            return Response({'message': f'Doctor {doctor.user.first_name} is not working on {date_data}.'},
                            status=status.HTTP_200_OK)

        if not weekly_availability.is_working:
            return Response({'message': f'Doctor {doctor.user.first_name} is not working on {date_data}.'},
                            status=status.HTTP_200_OK)

        available_timeslots = TimeSlot.objects.filter(weekly_availability=weekly_availability, ).exclude(
            patientappointment__appointment_date=date_data)
        serialized_timeslots = TimeSlotSerializer(available_timeslots, many=True).data
        return Response(serialized_timeslots)


############################################################################################################

# fetching the appointment types - Doctor
def doctor_appointment_types_view(request):
    appointment_types = DoctorAppointment.APPOINTMENT_TYPE_CHOICES
    # Convert choices to a list of dicts
    data = [{"key": key, "value": display} for key, display in appointment_types]
    return JsonResponse(data, safe=False)  # `safe=False` is required for non-dict objects


# fetching the appointment types - Patient
def patient_appointment_types_view(request):
    appointment_types = PatientAppointment.APPOINTMENT_TYPE_CHOICES
    # Convert choices to a list of dicts
    data = [{"key": key, "value": display} for key, display in appointment_types]
    return JsonResponse(data, safe=False)


# fetch the patients from the patient_doctors table into doctor's appointment form
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patients_for_doctor(request):
    doctor = request.user.doctor_user
    patients = Patient.objects.filter(doctors=doctor)
    serializer = PatientDropdownSerializer(patients, many=True)
    return Response(serializer.data)


# Updating Weekly Availability (Doctor) 
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_weekly_availability(request, pk):
    weekly_availability = get_object_or_404(WeeklyAvailability, pk=pk)
    serializer = WeeklyAvailabilitySerializer(weekly_availability, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()

        # Send a WebSocket message to the doctor's channel group
        channel_layer = get_channel_layer()
        group_name = f'doctor_{weekly_availability.doctor_id}'
        message = {
            'type': 'doctor_availability_update',
            'message': 'Doctor availability updated'
        }
        # Use async_to_sync to call the asynchronous group_send method
        async_to_sync(channel_layer.group_send)(
            group_name,
            message
        )

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Fetches the existing availability for a doctor
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weekly_availability(request):
    doctor_id = request.query_params.get('doctor_id', None)

    if doctor_id is not None:
        # Fetching weekly availability records for the doctor
        availability = WeeklyAvailability.objects.filter(doctor_id=doctor_id)

        # Serialize the data
        serializer = WeeklyAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)
    else:
        # If no doctor_id is provided, return a bad request response
        return Response(
            {'detail': 'No doctor_id provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )
