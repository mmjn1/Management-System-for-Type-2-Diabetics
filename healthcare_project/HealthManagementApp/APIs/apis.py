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
from djoser.conf import settings as djsoer_setting
from rest_framework.decorators import api_view
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import datetime
from django.http import Http404
from HealthManagementApp.serialisers.serializers import *


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
        # token, _ = settings.TOKEN_MODEL.objects.get_or_create(user=user)
        token, _  = djsoer_setting.TOKEN_MODEL.objects.get_or_create(user=user)
        
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
        patient_id = None
        doctor_id = None
        token_instance = None
        created = False

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data

            token_instance, created = djsoer_setting.TOKEN_MODEL.objects.get_or_create(user=user)

            try:
                patient_id = Patient.objects.get(user=user).id
            except Exception as e:
                print(e)

            try:
                doctor_id = Doctor.objects.get(user=user).id
            except Exception as e:
                print(e)
                # _, token = djsoer_setting.TOKEN_MODEL.objects.get_or_create(user=user)

            return Response({
                "user": UserSerializersData(user, context=self.get_serializer_context()).data,
                #"token": str(_),
                "token": str(token_instance),  
                "patient_id": patient_id,
                "doctor_id": doctor_id

            })
        else:
            error_message = "Invalid Login Details"
            return Response(
                {"message": error_message}, status=status.HTTP_403_FORBIDDEN
            )


class PrescriptionCreate(APIView):
    
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        return Prescription.objects.all()

    def get(self, request):
        data = Prescription.objects.all()
        serializer = PrescriptionSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data

        try:
            patient = Patient.objects.get(pk=data.get('patient'))
            doctor = request.user.doctor_user
        except (Patient.DoesNotExist, Doctor.DoesNotExist):
            return Response({'error': 'Patient or Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

        prescription = Prescription.objects.create(patient=patient, prescribing_doctor=doctor)

        self._handle_related_data(prescription, data)

        serializer = PrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


    def _handle_related_data(self, prescription, data):
        fields = ['Symptoms', 'Tests', 'Vitals', 'Diagnoses', 'Histories', 'Advices', 'FollowUps', 'Drug']

        for field_name in fields:

            items = data.get(field_name.lower(), [])
            if not items:
                continue

            related_manager = getattr(prescription, field_name)

            if field_name == 'Symptoms':
                for item in items:
                    if item.get('id'):  # Update existing
                        symptom = related_manager.model.objects.get(pk=item['id'])
                    else:  # Create new
                        symptom = related_manager.model.objects.create(
                            name=item['name'])  
                    related_manager.add(symptom)

            elif field_name == 'Tests':
                for item in items:
                    if item.get('id'):  # Update existing
                        test = related_manager.model.objects.get(pk=item['id'])
                    else:  # Create new
                        test = related_manager.model.objects.create(
                            name=item['name'])  
                    related_manager.add(test)

            elif field_name == 'Vitals':
                for item in items:
                    vital = related_manager.model.objects.create(name=item['name'], reading=item['reading'])
                    related_manager.add(vital)

            elif field_name == 'Diagnoses':
                for item in items:
                    diagnose = related_manager.model.objects.create(name=item['name'])
                    related_manager.add(diagnose)

            elif field_name == 'Histories':
                for item in items:
                    history = related_manager.model.objects.create(name=item['name'])
                    related_manager.add(history)

            elif field_name == 'Advices':
                for item in items:
                    try:
                        obj = related_manager.model.objects.get(name=item)
                    except related_manager.model.DoesNotExist:
                        obj = related_manager.model.objects.create(name=item)
                    related_manager.add(obj)

            elif field_name == 'FollowUps':
                for item in items:
                    try:
                        obj = related_manager.model.objects.get(name=item)
                    except related_manager.model.DoesNotExist:
                        obj = related_manager.model.objects.create(name=item)
                    related_manager.add(obj)

            elif field_name == 'Drug':
                for medicine in items:
                    if medicine.get('salt_id') == 'temp_id':
                        salt = Salt.objects.create(name=medicine.get('salt'))
                    else:
                        salt = Salt.objects.get(pk=medicine.get('salt_id'))

                    if medicine.get('medicine_id') == 'temp_id':
                        medicine_obj = Medicine.objects.create(
                            salt=salt,
                            name=medicine.get('name'),
                        )
                    else:
                        medicine_obj = Medicine.objects.get(pk=medicine.get('medicine_id'))

                    drug = Drugs.objects.create(
                        Medical_name=medicine_obj,
                        frequency=medicine.get('time'),
                        duration=medicine.get('duration'),
                        dosage=medicine.get('dosage')
                    )
                    related_manager.add(drug)


class PrescriptionDoctor(APIView):
    serializer_class = PrescriptionDetailSerializer

    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return Prescription.objects.filter(prescribing_doctor__id=doctor_id)

    def get(self, request, doctor_id):
        data = self.get_queryset()
        serializer = PrescriptionDetailSerializer(data, many=True)
        return Response(serializer.data)


class PrescriptionPatient(APIView):
    serializer_class = PrescriptionDetailSerializer

    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        return Prescription.objects.filter(patient__id=patient_id)

    def get(self, request, patient_id):
        data = self.get_queryset()
        serializer = PrescriptionDetailSerializer(data, many=True)
        return Response(serializer.data)

    def put(self, request, patient_id):
        try:
            prescription = Prescription.objects.get(id=patient_id)
            prescription.refill_requested = request.data.get('refill_requested')
        except Prescription.DoesNotExist:
            return Response({'error': 'Prescription not found'}, status=404)

        serializer = PrescriptionDetailSerializer(prescription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


def generate_drug_info(drugs_data):
    drug_info = ""
    for drug in drugs_data:
        drug_info += f"- {drug['Medical_name']['name']} ({drug['dosage']})\n"
    return drug_info


def generate_vitals_info(vitals):
    vitals_info = ""
    for vital in vitals:
        vitals_info += f"- {vital.name}: {vital.reading} ({vital.date})\n"
    return vitals_info


@api_view(['POST'])
def send_prescription(request):
    primary_email = request.data.get('primaryEmail')
    secondary_email = request.data.get('secondaryEmail')
    prescription_id = request.data.get('prescription')

    if not primary_email or not prescription_id:
        return Response({'error': 'Both primaryEmail and prescription are required'},
                        status=status.HTTP_400_BAD_REQUEST)

    prescription = Prescription.objects.get(id=prescription_id)
    first_name = prescription.patient.user.first_name
    last_name = prescription.patient.user.last_name
    patient_id = prescription.patient.id
    doctor_fname = prescription.prescribing_doctor.user.first_name
    doctor_lname = prescription.prescribing_doctor.user.last_name
    # Mobile = prescription.patient.Mobile
#     gender = prescription.patient.gender
    date = prescription.start_date

    drugs = prescription.Drug.all()

    drugs_data = DrugSerializerdetail(drugs, many=True).data

    for drug in drugs_data:
        dosage_str = drug['dosage']
        numbers_array = [int(x) for x in dosage_str if x.isdigit()]
        drug['dosage'] = numbers_array

        dosage_str = ', '.join(str(x) for x in numbers_array)
        drug['dosage_display'] = dosage_str

    tests = prescription.Tests.all()
    test_data = [test.name for test in tests]

    symptoms = prescription.Symptoms.all()
    symptoms_data = [symptom.name for symptom in symptoms]

    diagnoses = prescription.Diagnoses.all()
    diagnoses_data = [item.name for item in diagnoses]

    history = prescription.Histories.all()
    history_data = [item.name for item in history]

    advice = prescription.Advices.all()
    advice_data = [item.name for item in advice]

    followups = prescription.FollowUps.all()
    followup_data = [followup.name for followup in followups]

    vitals = prescription.Vitals.all()
    recipient_list = [primary_email]

    subject, from_email = f'Prescription of {first_name} {last_name} ', EMAIL_HOST_USER
    data_format = {
        'doctor_fname': doctor_fname,
        'doctor_lname': doctor_lname,
        'patient_id': patient_id,
        'site_name': site_name,
        'first_name': first_name,
        'last_name': last_name,
        'symptoms_data': symptoms_data,
        'test_data': test_data,
        'vitals': vitals,
        'drugs_data': drugs_data,
        'diagnoses_data': diagnoses_data,
        'history_data': history_data,
        'advice_data': advice_data,
        'followup_data': followup_data,
#         'Mobile': Mobile,
        # 'gender': gender,
        'date': date
    }
    if secondary_email:
        recipient_list.append(secondary_email)
    htmly = get_template('emailPrescription.html')
    html_content = htmly.render(data_format)
    msg = EmailMultiAlternatives(
        subject, html_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return Response({'message': 'Prescription email sent successfully'},
                    status=status.HTTP_200_OK)


class PrescriptionData(APIView):

    def get_object(self, pk):
        try:
            return Prescription.objects.get(pk=pk)
        except Prescription.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = PrescriptionDetailSerializer(snippet)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = PrescriptionSerializer(snippet, data=request.data)
        if serializer.is_valid():
            symptoms = request.data.get("symptoms")
            test = request.data.get("tests")
            vitals = request.data.get("vitals")
            diagnoses = request.data.get("diagnoses")
            histories = request.data.get("histories")
            advices = request.data.get("advices")
            followups = request.data.get("followups")
            drug = request.data.get("drug")

            snippet.Symptoms.clear()
            snippet.Drug.clear()
            snippet.Tests.clear()
            snippet.Vitals.clear()
            snippet.Diagnoses.clear()
            snippet.Histories.clear()
            snippet.Advices.clear()
            snippet.FollowUps.clear()

            for symptom_data in symptoms:
                symptom, _ = Symptoms.objects.get_or_create(name=symptom_data['name'])
                snippet.Symptoms.add(symptom)

            for test_data in test:
                test, _ = Tests.objects.get_or_create(name=test_data['name'])
                snippet.Tests.add(test)

            for vitals_data in vitals:
                try:
                    Vitals.objects.filter(id=vitals_data.get("id")).delete()
                except Exception as e:
                    print(e)
                item = Vitals.objects.create(name=vitals_data.get('name'), reading=vitals_data.get('reading'))
                snippet.Vitals.add(item)

            for diagnoses_data in diagnoses:
                try:
                    Diagnoses.objects.filter(id=diagnoses_data.get("id")).delete()
                except Exception as e:
                    print(e)
                item = Diagnoses.objects.create(name=diagnoses_data.get('name'))
                snippet.Diagnoses.add(item)

            for history_data in histories:
                try:
                    Histories.objects.filter(id=history_data.get("id")).delete()
                except Exception as e:
                    print(e)
                item = Histories.objects.create(name=history_data.get('name'))
                snippet.Histories.add(item)

            for advices_data in advices:
                try:
                    Advices.objects.filter(id=advices_data.get("id")).delete()
                except Exception as e:
                    print(e)
                item = Advices.objects.create(name=advices_data.get('name'))
                snippet.Advices.add(item)

            for followups_data in followups:
                try:
                    FollowUps.objects.filter(id=followups_data.get("id")).delete()
                except Exception as e:
                    print(e)
                item = FollowUps.objects.create(name=followups_data.get('name'))
                snippet.FollowUps.add(item)

            for medicine in drug:
                if medicine.get('salt_id') == 'temp_id':
                    salt = Salt.objects.create(name=medicine.get('salt'))
                else:
                    salt = Salt.objects.get(pk=medicine.get('salt_id'))

                if medicine.get('medicine_id') == 'temp_id':
                    medicine_obj = Medicine.objects.create(
                        salt=salt,
                        name=medicine.get('name'),
                    )
                else:
                    medicine_obj = Medicine.objects.get(pk=medicine.get('medicine_id'))

                drug = Drugs.objects.create(
                    Medical_name=medicine_obj,
                    frequency=medicine.get('time'),
                    duration=medicine.get('duration'),
                    dosage=medicine.get('dosage')
                )
                snippet.Drug.add(drug)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MedicineCreate(APIView):
    serializer_class = MedicineSerializer

    def get_queryset(self):
        return Medicine.objects.all()

    def get(self, request, format=None):
        data = Medicine.objects.all()
        serializer = MedicineSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicineData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Medicine.objects.filter(id=self.kwargs['pk'])

    serializer_class = MedicineSerializer


class DrugsCreate(APIView):
    serializer_class = DrugsSerializer

    def get_queryset(self):
        return Drugs.objects.all()

    def get(self, request, format=None):
        data = Drugs.objects.all()
        serializer = DrugsSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = DrugsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DrugsData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Drugs.objects.filter(id=self.kwargs['pk'])

    serializer_class = DrugsSerializer


class SymptomsCreate(APIView):
    serializer_class = SymptomsSerializer

    def get_queryset(self):
        return Symptoms.objects.all()

    def get(self, request, format=None):
        data = Symptoms.objects.all()
        serializer = SymptomsSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SymptomsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SymptomsData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Symptoms.objects.filter(id=self.kwargs['pk'])

    serializer_class = SymptomsSerializer


class TestsCreate(APIView):
    serializer_class = TestsSerializer

    def get_queryset(self):
        return Tests.objects.all()

    def get(self, request, format=None):
        data = Tests.objects.all()
        serializer = TestsSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = TestsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestsData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Tests.objects.filter(id=self.kwargs['pk'])

    serializer_class = TestsSerializer


class VitalsCreate(APIView):
    serializer_class = VitalsSerializer

    def get_queryset(self):
        return Vitals.objects.all()

    def get(self, request, format=None):
        data = Vitals.objects.all()
        serializer = VitalsSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = VitalsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VitalsData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Vitals.objects.filter(id=self.kwargs['pk'])

    serializer_class = VitalsSerializer


class DiagnosesCreate(APIView):
    serializer_class = DiagnosesSerializer

    def get_queryset(self):
        return Diagnoses.objects.all()

    def get(self, request, format=None):
        data = Diagnoses.objects.all()
        serializer = DiagnosesSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiagnosesData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Diagnoses.objects.filter(id=self.kwargs['pk'])

    serializer_class = DiagnosesSerializer


class HistoriesCreate(APIView):
    serializer_class = HistoriesSerializer

    def get_queryset(self):
        return Histories.objects.all()

    def get(self, request, format=None):
        data = Histories.objects.all()
        serializer = HistoriesSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = HistoriesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HistoriesData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Histories.objects.filter(id=self.kwargs['pk'])

    serializer_class = HistoriesSerializer


class AdvicesCreate(APIView):
    serializer_class = AdvicesSerializer

    def get_queryset(self):
        return Advices.objects.all()

    def get(self, request, format=None):
        data = Advices.objects.all()
        serializer = AdvicesSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = AdvicesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdvicesData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return Advices.objects.filter(id=self.kwargs['pk'])

    serializer_class = AdvicesSerializer


class FollowUpsCreate(APIView):
    serializer_class = FollowUpsSerializer

    def get_queryset(self):
        return FollowUps.objects.all()

    def get(self, request, format=None):
        data = FollowUps.objects.all()
        serializer = FollowUpsSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FollowUpsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FollowUpsData(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        return FollowUps.objects.filter(id=self.kwargs['pk'])

    serializer_class = FollowUpsSerializer


class SaltList(APIView):
    def get_queryset(self):
        return Salt.objects.all()

    def get(self, request):
        salts = Salt.objects.all()
        serializer = SaltSerializer(salts, many=True)
        return Response(serializer.data)


class SaltDetail(APIView):
    def get_queryset(self):
        return Salt.objects.all()

    def get(self, request, salt_name):
        salt = get_object_or_404(Salt, name=salt_name)
        serializer = SaltSerializer(salt)
        return Response(serializer.data)
