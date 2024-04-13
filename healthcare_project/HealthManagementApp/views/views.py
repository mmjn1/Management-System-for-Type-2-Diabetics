from django.views import View
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from rest_framework import generics, permissions
from rest_framework.generics import RetrieveAPIView

from HealthManagementApp.serialisers.serializers import(SupportInquirySerializer, 
                                                        DoctorSerializer, NewPatientSerializer, 
                                                        WeeklyAvailabilitySerializer, 
                                                        PatientDropdownSerializer,
                                                        PatientAppointmentSerializer,
                                                        TimeSlotSerializer, FormSerializer,
                                                        CustomUserSerializer
)
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
import datetime
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

login_url = os.environ.get('FRONT_END_URL_LOGIN')
User = get_user_model()

from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@csrf_exempt
def get_dietary_advice(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_input = data.get("user_input")

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

@csrf_exempt
@api_view(['PATCH'])
def update_dietary_advice(request, entry_id):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            user_input = data.get("user_input")

            entry = UserMealEntry.objects.get(pk=entry_id)

            entry.user_input = user_input

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

            entry.ai_advice = advice
            entry.save()

            return JsonResponse({
                'id': entry.id,
                'advice': advice
            }, status=200)

        except UserMealEntry.DoesNotExist:
            return JsonResponse({'error': 'UserMealEntry not found'}, status=404)
    else:
        return HttpResponseNotAllowed(['PATCH'])

@api_view(['DELETE'])
def delete_dietary_advice(request, entry_id):
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

"""PP
SupportInquiryView handles the creation of new SupportInquiry instances.
Defined the queryset as all instances of SupportInquiry.
The serializer_class is set to SupportInquirySerializer, 
which will handle the conversion between Django models and JSON.

"""
class SupportInquiryView(generics.CreateAPIView):
    queryset = SupportInquiry.objects.all()
    serializer_class = SupportInquirySerializer

"""
DoctorView handles the retrieval of all Doctor instances.
Defined the queryset as all instances of Doctor.
The serializer_class is set to DoctorSerializer, which will handle the conversion between Django models and JSON.

"""
# Fetching all the doctors onto the Patient Registration form
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
    # return render(request, 'activateAccount.html', context={
    #     'FRONT_END_URL_LOGIN': os.environ.get('FRONT_END_URL_LOGIN')
    # })


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


# Creating a New Weekly Availability (Doctor)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_weekly_availability(request):
    serializer = WeeklyAvailabilitySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Updating Weekly Availability (Doctor) 
# sends a WebSocket message to the doctor's channel group
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


# fetch the existing availability for a doctor
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

def list_locations(request):
    locations = {choice[0]: choice[1] for choice in TimeSlot.LOCATION_CHOICES}
    return JsonResponse(locations)


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


# Fetch the doctor's weekly availability onto Patient's appointment form (AppointmentModal)
@api_view(['GET'])
def get_doctor_availability(request):
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
def create_patient_appointment(request):
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

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_appointment(request, appointment_id):
    try:
        appointment = PatientAppointment.objects.get(id=appointment_id)
    except PatientAppointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    if appointment.doctor is None or appointment.patient is None:
        return Response({'error': 'Appointment does not have an associated doctor or patient.'}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({'error': "You do not have permission to delete this appointment."}, status=status.HTTP_403_FORBIDDEN)


# Fetch the Patient's Appointments onto the Doctor's Calendar
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointments(request):
    user = request.user
    # Filter appointments by the logged-in user, you can adjust the filter as needed
    appointments = PatientAppointment.objects.filter(patient=user.patient)
    serializer = PatientAppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


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
    

def health_check(request):
    return HttpResponse("OK", status=200)
