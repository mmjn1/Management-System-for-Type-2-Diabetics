import os

from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from HealthManagementApp.Utils.utils import account_activation_token
from HealthManagementApp.serialisers.serializers import DoctorSerializer
from HealthManagementApp.serialisers.serializers import PatientSerializer
from HealthManagementApp.models.users import Doctor, Patient
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import get_template
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

User = get_user_model()
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
site_name = os.environ.get('SITE_NAME')

class DoctorCreate(APIView):
    """
    View for creating Doctor entries and associated User accounts.

    This view supports GET and POST methods. GET method retrieves all existing Doctor entries.
    POST method is used to create a new Doctor entry along with a new User account for authentication.

    Attributes:
    - serializer_class: Specifies the serializer class to be used for validating and serializing input data.

    """

    serializer_class = DoctorSerializer

    def get_queryset(self):
        return Doctor.objects.all()

    def get(self, request):
        data = Doctor.objects.all()
        serializer = DoctorSerializer(data, many=True)
        return Response(serializer.data)
    
    def post(self, request):
    
        try:
            first_name = request.data['first_name']
            #middle_name = request.data['middle_name']
            last_name = request.data['last_name']
            email = request.data['email']
            user = User.objects.create_user(first_name=first_name,
                                            #middle_name=middle_name,
                                            last_name=last_name,
                                            email=email)
            user.set_password(request.data['password'])
            user.is_active = False
            user.type = request.data['role']
            user.save()
            Doctor.objects.create(user=user,
                                  speciality=request.data['speciality'],
                                  years_of_experience=request.data['years_of_experience'],
                                  medical_license_number=request.data['medical_license_number'],
                                  country_of_issue=request.data['country_of_issue'],
                                  year_of_issue=request.data['year_of_issue'],
                                  diabetes_management_experience=request.data['diabetes_management_experience'],
                                  treatement_approach=request.data['treatment_approach'],
                                  contact_hours=request.data['contact_hours'],
                                  tel_number=request.data['tel_number'],
                                  emergency_consultations=request.data['emergency_consultations'])
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
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorData(generics.RetrieveUpdateDestroyAPIView):
    """
    A view that handles retrieving, updating, and deleting a specific Doctor instance.

    This view extends Django REST Framework's RetrieveUpdateDestroyAPIView to provide
    methods for handling GET, PUT/PATCH, and DELETE requests for a Doctor model instance
    identified by its primary key (pk) provided in the URL.
    """
    def get_queryset(self):
        return Doctor.objects.filter(id=self.kwargs['pk'])

    serializer_class = DoctorSerializer



class PatientCreate(APIView):
    """
    API view for creating new Patient entries along with associated User accounts.

    serializer_class (PatientSerializer): The serializer class for validating and serializing
    input data related to Patients.
    """
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
            #middle_name = request.data['middle_name']
            last_name = request.data['last_name']
            email = request.data['email']
            user = User.objects.create_user(first_name=first_name,
                                            #middle_name=middle_name,
                                            last_name=last_name,
                                            email=email)
            user.set_password(request.data['password'])
            user.is_active = False
            user.type = request.data['role']
            user.save()
            patient = Patient.objects.create(
                user=user,
                current_diabetes_medication=request.data['current_diabetes_medication'],
                dietary_habits=request.data['dietary_habits'],
                type_of_diabetes=request.data['type_of_diabetes'],
                date_of_diagnosis=request.data['date_of_diagnosis'],
                blood_sugar_level=request.data['blood_sugar_level'],
                target_blood_sugar_level=request.data['target_blood_sugar_level'],
                medical_history=request.data['medical_history'],
                physical_activity_level=request.data['physical_activity_level'],
                smoking_habits=request.data['smoking_habits'],
                alcohol_consumption=request.data['alcohol_consumption'],
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
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatientData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Patient.objects.filter(id=self.kwargs['pk'])

    serializer_class = PatientSerializer