import os
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from HealthManagementApp.Utils.utils import account_activation_token
from HealthManagementApp.serialisers import loginSerializer, UserSerializersData
from HealthManagementApp.serialisers.Doctor import DoctorSerializer
from HealthManagementApp.serialisers.Patient import PatientSerializer
from HealthManagementApp.models.users import Doctor, Patient
from HealthManagementApp.models.medical_license import MedicalLicense
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import get_template
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import authenticate
from djoser.conf import settings
from rest_framework.decorators import api_view
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import datetime




"""
This module defines API views related to Doctors, Patients, and user authentication for the application.

Classes:
    DoctorCreate: Handles GET and POST requests for creating Doctor records. On GET, it returns all Doctor records. On POST, it creates a new Doctor user and associated Doctor profile, then sends an activation email.
    DoctorData: Inherits from RetrieveUpdateDestroyAPIView to provide methods for retrieving, updating, and deleting a specific Doctor record.
    PatientCreate: Handles GET and POST requests for creating Patient records. On GET, it returns all Patient records. On POST, it creates a new Patient user and associated Patient profile, then sends an activation email.
    PatientData: Inherits from RetrieveUpdateDestroyAPIView to provide methods for retrieving, updating, and deleting a specific Patient record.
    loginAPI: Provides a custom login endpoint. On POST, it validates user credentials and returns a token along with user details if authentication is successful.

Functions:
    custom_login: A function-based view that authenticates a user and returns a token along with user details if credentials are valid.

Notes:
    - DoctorCreate and PatientCreate views perform user creation and send activation emails with error handling for duplicate entries.
    - PatientCreate additionally associates the newly created Patient with a Doctor.
    - loginAPI and custom_login serve as entry points for user authentication, differing in their approach and data they return upon successful authentication.
"""



User = get_user_model()
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
site_name = os.environ.get('SITE_NAME')


class DoctorCreate(APIView):
    serializer_class = DoctorSerializer

    def post(self, request):
        medical_license_number = request.data.get('medical_license_number')
        try:
            # Check if the medical license exists in the database
            license_obj = MedicalLicense.objects.get(license_number=medical_license_number)
            
            # Proceed with creating the doctor if the license exists
            user_data = {
                'first_name': request.data['first_name'],
                'middle_name': request.data['middle_name'],
                'last_name': request.data['last_name'],
                'email': request.data['email'],
                'password': request.data['password'],
            }
            user = User.objects.create_user(**user_data)
            user.is_active = False
            user.type = 'Doctor'  

            user.save()
            
            doctor_data = {
                'user': user,
                'speciality': request.data['speciality'],
                'years_of_experience': request.data['years_of_experience'],
                'medical_license': license_obj,
                'year_of_issue': request.data['year_of_issue'],
                'diabetes_management_experience': request.data['diabetes_management_experience'],
                'treatment_approach': request.data['treatment_approach'],
                'contact_hours': request.data['contact_hours'],
                'tel_number': request.data['tel_number'],
                'emergency_consultations': request.data['emergency_consultations']
            }
            Doctor.objects.create(**doctor_data)

            self.send_email(user, 'active_account.html', 'Please activate your account')

            return Response({"message": "Please check your email to activate your account."}, status=status.HTTP_201_CREATED)

        except MedicalLicense.DoesNotExist:

            # Send rejection email
            rejection_data = {
                'first_name': request.data.get('first_name', 'User'),  
                'last_name': request.data.get('last_name', ''),
                'email': request.data.get('email', ''),
                'id': 1  # Dummy user ID for email token generation
            }
            self.send_email(rejection_data, 'rejection_email.html', "Registration could not be completed")
            return Response({"error": "The medical license number does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError:
            return Response({"error": "User with given details already exists."}, status=status.HTTP_409_CONFLICT)

    def send_email(self, user_info, template_name, subject):
        current_site = get_current_site(self.request)
        email_template = get_template(template_name)

        firstname = user_info.get('first_name', 'User') if isinstance(user_info, dict) else getattr(user_info, 'first_name', 'User')
        lastname = user_info.get('last_name', '') if isinstance(user_info, dict) else getattr(user_info, 'last_name', '')
        email = user_info.get('email', '') if isinstance(user_info, dict) else getattr(user_info, 'email', '')
        user_id = user_info.get('id', 1) if isinstance(user_info, dict) else getattr(user_info, 'pk', 1)

        data = {
            'firstname': firstname,
            'lastname': lastname,
            'site_name': os.environ.get('SITE_NAME', 'Your Site Name'),
        }

        if template_name == 'active_account.html':
            email_body = {
                'uid': urlsafe_base64_encode(force_bytes(user_id)),
                'token': account_activation_token.make_token(user_info),
            }
            link = reverse('activate', kwargs={
                'uidb64': email_body['uid'], 'token': email_body['token']
            })
            data['url'] = f'http://{current_site.domain}{link}'
        else:
            data['url'] = ''

        html_content = email_template.render(data)
        from_email = EMAIL_HOST_USER
        to_email = [email]
        subject = subject
        msg = EmailMultiAlternatives(subject, "", from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        

class DoctorData(generics.RetrieveUpdateDestroyAPIView):

    def get_queryset(self):
        return Doctor.objects.filter(id=self.kwargs['pk'])

    serializer_class = DoctorSerializer


class PatientCreate(APIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        return Patient.objects.all()

    def get(self, request):
        data = Patient.objects.all()
        serializer = PatientSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):

        try:
            first_name = request.data['first_name']
            middle_name = request.data['middle_name']
            last_name = request.data['last_name']
            password = request.data['password']
            email = request.data['email']
            user = User.objects.create_user(first_name=first_name,
                                            middle_name=middle_name,
                                            last_name=last_name,
                                            email=email,
                                            password=password,)
            user.set_password(request.data['password'])
            user.is_active = False
            user.type = request.data['role']
            user.save()
            date_of_diagnosis_str = request.data['date_of_diagnosis']
            date_of_diagnosis_obj = datetime.datetime.strptime(date_of_diagnosis_str.split('T')[0], "%Y-%m-%d").date()

            patient = Patient.objects.create(
                user=user,
                current_diabetes_medication=request.data['current_diabetes_medication'],
                dietary_habits=request.data['dietary_habits'],
                type_of_diabetes=request.data['type_of_diabetes'],
                date_of_diagnosis=date_of_diagnosis_obj,  
                blood_sugar_level=request.data['blood_sugar_level'],
                target_blood_sugar_level=request.data['target_blood_sugar_level'],
                medical_history=request.data['medical_history'],
                physical_activity_level=request.data['physical_activity_level'],
                smoking_habits=request.data['smoking_habits'],
                alcohol_consumption=request.data['alcohol_consumption'],
                medication_adherence=request.data['medication_adherence'],
                family_medical_history=request.data['family_medical_history']
            )
            patient.doctors.add(request.data['doctor'])
            patient.save()
            current_site = get_current_site(request)
            email_body = {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            }
            link = reverse('activate', kwargs={
                'uidb64': email_body['uid'], 'token': email_body['token'],
            })
            # # TODO:HTTPS in deployment
            activate_url = 'http://' + current_site.domain + link
            htmly = get_template('active_account.html')
            data = {'firstname': first_name,
                    'lastname': last_name, 'url': activate_url, 'site_name': site_name}
            subject, from_email, to = 'Welcome' + " " + first_name.capitalize() + " " + last_name.capitalize() + \
                                      " " + "Please activate your account", EMAIL_HOST_USER, email
            html_content = htmly.render(data)
            msg = EmailMultiAlternatives(
                subject, html_content, from_email, [to])
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            return Response({"message": "Please Check your Email and Activate Account"},
                            status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            return Response({"error": "User with given details already exists."}, status=status.HTTP_409_CONFLICT)
        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PatientData(generics.RetrieveUpdateDestroyAPIView):

    def get_queryset(self):
        return Patient.objects.filter(id=self.kwargs['pk'])

    serializer_class = PatientSerializer



@api_view(['POST'])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        token, _ = settings.TOKEN_MODEL.objects.get_or_create(user=user)
        
        return Response({
            "token": 'token_data',
            "first_name": user.first_name,
            "last_name": user.last_name,
            "type_of_user": getattr(user, 'type_of_user', 'default'),  
        })
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class loginAPI(generics.GenericAPIView):
    serializer_class = loginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            _, token = settings.TOKEN_MODEL.objects.get_or_create(user=user)
            return Response({
                "user": UserSerializersData(user, context=self.get_serializer_context()).data,
                "token": str(_),
            })
        else:
            error_message = "Invalid Login Details"
            return Response(
                {"message": error_message}, status=status.HTTP_403_FORBIDDEN
            )
