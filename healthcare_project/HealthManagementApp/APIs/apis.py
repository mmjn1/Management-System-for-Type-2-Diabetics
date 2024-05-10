import os
from django.shortcuts import get_object_or_404
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
from datetime import datetime, timedelta


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
            date_of_diagnosis_obj = datetime.strptime(date_of_diagnosis_str.split('T')[0], "%Y-%m-%d").date()

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
            # Constructing the email body for account activation
            # `user`: The user instance for whom the activation email is intended.
            # `domain`: The domain of the current site, used to create a full URL for the activation link.
            # `uid`: A URL-safe base64-encoded user ID, used to securely identify the user in the activation link.
            # `token`: A secure token generated for the user, used to validate the activation request.
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
    """
    API view that handles the retrieval, updating, and deletion of a specific patient's data.

    This view extends the RetrieveUpdateDestroyAPIView, which provides GET, PUT, PATCH, and DELETE methods
    to operate on a single instance of a model, in this case, the Patient model.

    Methods:
        get_queryset(self): Returns the queryset that will be used to retrieve the object. This method is
                            overridden to filter the Patient model, returning only the patient whose ID matches
                            the 'pk' keyword argument from the URL.

    Attributes:
        serializer_class (PatientSerializer): The serializer class that handles serialization and
                                              deserialization of the Patient instances.
    """
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
                "token": str(token_instance),  
                "patient_id": patient_id,
                "doctor_id": doctor_id

            })
        else:
            error_message = "Invalid Login Details"
            return Response(
                {"message": error_message}, status=status.HTTP_403_FORBIDDEN
            )


class DrugsCreate(APIView):
    """
    API view to handle the creation and retrieval of Drugs records.

    Methods:
    - get_queryset: Returns a queryset of all Drugs records.
    - get: Retrieves all Drugs records and returns them in a serialized format.
    - post: Creates a new Drugs record from the provided data if it is valid, otherwise returns errors.

    This view is crucial for managing the drugs inventory, allowing for both viewing the entire list and adding new drugs to the system.
    """
    serializer_class = DrugsSerializer

    def get_queryset(self):
        # This method specifies the query to fetch all records from the Drugs model.
        # It is used by the view to determine which records are available for retrieval and manipulation,
        # ensuring that all drug records can be accessed when needed.
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
    """
    API view to handle retrieval, updating, and deletion of a specific Drugs record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Drugs record, facilitating detailed management of individual drug entries in the database.
    """
    def get_queryset(self):
        return Drugs.objects.filter(id=self.kwargs['pk'])

    serializer_class = DrugsSerializer


class PrescriptionCreate(APIView):
    """
    API view for managing the creation of prescriptions.

    This view handles the creation of prescriptions by accepting POST requests with necessary
    prescription details. It also supports retrieving all prescriptions through GET requests.

    Attributes:
        serializer_class (PrescriptionSerializer): The serializer that handles prescription data validation and serialization.

    Methods:
        get_queryset(self): Returns a queryset containing all Prescription instances.
        get(self, request): Handles GET requests to retrieve all prescriptions.
        post(self, request): Handles POST requests to create a new prescription with validation for patient and doctor existence.
        _handle_related_data(self, prescription, data): Private method to handle the creation and association of related data like symptoms, tests, etc., with the prescription.
    """

    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        return Prescription.objects.all()

    def get(self, request):
        data = Prescription.objects.all()
        serializer = PrescriptionSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to create a new prescription.

        This method attempts to create a new prescription based on the provided request data. It first validates the existence of the patient and the doctor (linked to the user making the request). If either is not found, it returns a 404 error. If both are found, it proceeds to initialize and validate the prescription data using the PrescriptionSerializer. If the data is valid, it saves the prescription, associates any related data (like drugs and symptoms), calculates and sets the prescription's end date based on the drugs' maximum duration, and finally saves the updated prescription.

        Parameters:
            request (HttpRequest): The request object containing the prescription data.

        Returns:
            Response: A Django REST framework response object with the newly created prescription data and a status code of HTTP_201_CREATED if successful, or error details with a status code of HTTP_400_BAD_REQUEST if the data is invalid.
        """
        data = request.data
        try:
            patient = Patient.objects.get(pk=data.get('patient'))
            doctor = request.user.doctor_user  # Assuming the doctor is linked to the user
        except (Patient.DoesNotExist, AttributeError):
            return Response({'error': 'Patient or Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Initialize the serializer with the patient and doctor data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            # Save the prescription instance with the patient and doctor
            prescription = serializer.save(patient=patient, prescribing_doctor=doctor)

            # Handle related data such as drugs, symptoms, etc.
            self._handle_related_data(prescription, data)

            # Calculate the end_date based on the maximum duration from associated drugs
            max_duration_days = self.calculate_max_duration(prescription)
            if max_duration_days > 0:
                prescription.end_date = datetime.now().date() + timedelta(days=max_duration_days)
                prescription.save()  # Save the prescription again with the updated end_date

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def calculate_max_duration(self, prescription):
        """
        Calculates the maximum duration of medication for a given prescription.

        This method iterates through all the drugs associated with the prescription and determines the maximum duration for which the drugs are prescribed. 
        The duration is assumed to be stored as a string representing the number of days, 
        which is converted to an integer for comparison.

        Since a prescription might involve multiple drugs with different durations, 
        I set the end_date based on the longest duration.

        Args:
            prescription (Prescription): The Prescription object whose maximum drug duration is to be calculated.

        Returns:
            int: The maximum duration in days for which any of the drugs in the prescription are prescribed.

        Raises:
            ValueError: If the drug duration is not a valid integer, it is caught and the loop continues to the next drug.
        """
        max_duration = 0
        for drug in prescription.Drug.all():
            try:
                duration_days = int(drug.duration)
                if duration_days > max_duration:
                    max_duration = duration_days
            except ValueError:
                continue  # Skip drugs with invalid duration values
        return max_duration



    def _handle_related_data(self, prescription, data):
        """
        Manages the association of various related data items with a prescription instance.

        This method processes a dictionary of data items related to a prescription, such as symptoms, tests, vitals, diagnoses, histories, advices, follow-ups, and drugs. It either updates existing records or creates new ones based on the provided data, and then associates them with the given prescription.

        Parameters:
            - prescription (Prescription): The Prescription object to which the related data will be linked.
            - data (dict): A dictionary containing lists of data items for each related field. Each key corresponds to a field name, and each value is a list of dictionaries representing individual data items.

        Workflow:
        1. Iterate over a predefined list of field names that represent the related data types.
        2. For each field, retrieve the list of items from the data dictionary.
        3. For each item in the list, check if it exists (by 'id' if provided). If it exists, update it; if not, create a new instance.
        4. Add the updated or newly created item to the related manager of the prescription.

        Supported fields and their handling:
        - 'Symptoms', 'Tests', 'Vitals', 'Diagnoses', 'Histories', 'Advices', 'FollowUps': Managed by checking for an 'id' to update or creating a new entry.
        - 'Drug': Special handling to associate drugs with salts and manage drug-specific attributes like frequency, duration, and dosage.

        This method is crucial for ensuring that all related data is accurately associated with a prescription, facilitating comprehensive management of patient care details.
        """
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
                            name=item['name'])  # Assuming 'name' is the only other field
                    related_manager.add(symptom)

            elif field_name == 'Tests':
                for item in items:
                    if item.get('id'):  # Update existing
                        test = related_manager.model.objects.get(pk=item['id'])
                    else:  # Create new
                        test = related_manager.model.objects.create(
                            name=item['name'])  # Assuming 'name' is the only other field
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

                    get_, created = Salt.objects.get_or_create(name=medicine.get('salt'))
                    if created:
                        salt = created
                    else:
                        salt = get_

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
    """
    API view to handle requests for prescriptions associated with a specific doctor.

    This view retrieves all prescriptions prescribed by a doctor identified by `doctor_id`.
    It uses the `PrescriptionDetailSerializer` to serialize the prescription data.

    Methods:
        get_queryset(self): Returns a queryset of Prescription objects filtered by the doctor's ID.
        get(self, request, doctor_id): Handles the GET request to fetch and return serialized prescription data.
    """
    serializer_class = PrescriptionDetailSerializer

    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return Prescription.objects.filter(prescribing_doctor__id=doctor_id)

    def get(self, request, doctor_id):
        data = self.get_queryset()
        serializer = PrescriptionDetailSerializer(data, many=True)
        return Response(serializer.data)


class PrescriptionPatient(APIView):
    """
    API view to handle requests for prescriptions associated with a specific patient.

    This view retrieves all prescriptions for a given patient and allows for updating specific prescription details, such as requesting a refill. It is designed to facilitate patient-specific prescription management within the healthcare system.

    Attributes:
        serializer_class (PrescriptionDetailSerializer): The serializer that handles prescription data validation and serialization.

    Methods:
        get_queryset(self): Returns a queryset of Prescription objects filtered by the patient's ID.
        get(self, request, patient_id): Handles the GET request to fetch and return serialized prescription data for a specific patient.
        put(self, request, patient_id): Handles the PUT request to update a specific prescription, particularly for refill requests. It ensures that the prescription exists and updates it if the provided data is valid.

    The `get` method ensures that all prescriptions related to a specific patient can be retrieved and reviewed, which is crucial for ongoing patient care and medication management.

    The `put` method allows for modifications to a prescription, such as updating the refill status, which is essential for managing ongoing medication needs without requiring a completely new prescription entry.
    """
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
    """
    This function iterates over a list of drug data dictionaries, extracting and 
    formatting the medical name and dosage of each drug into a readable string format. 
    
    Generates a formatted string containing information about each drug in the provided list.

    Parameters:
    - drugs_data (list of dict): A list of dictionaries where each dictionary contains details of a drug, including its medical name and dosage.

    Returns:
    - str: A formatted string where each line contains the name and dosage of a drug, separated by a newline.

    Example of usage:
    - drugs_data = [{'Medical_name': {'name': 'Aspirin'}, 'dosage': '100mg'}]
    - generate_drug_info(drugs_data) returns "- Aspirin (100mg)\n"
    """
    drug_info = ""
    for drug in drugs_data:
        drug_info += f"- {drug['Medical_name']['name']} ({drug['dosage']})\n"
    return drug_info


def generate_vitals_info(vitals):
    """
    Generates a formatted string containing information about each vital sign in the provided list.

    This function iterates over a list of vital sign objects, extracting and 
    formatting the name, reading, and date of each vital sign into a readable string format. 

    Parameters:
    - vitals (list of Vital objects): A list of Vital objects where each object contains details of a vital sign, including its name, reading, and date.

    Returns:
    - str: A formatted string where each line contains the name, reading, and date of a vital sign, separated by a newline.

    Example of usage:
    - vitals = [Vital(name='Blood Pressure', reading='120/80', date='2023-01-01')]
    - generate_vitals_info(vitals) returns "- Blood Pressure: 120/80 (2023-01-01)\n"
    """
    vitals_info = ""
    for vital in vitals:
        vitals_info += f"- {vital.name}: {vital.reading} ({vital.date})\n"
    return vitals_info


@api_view(['POST'])
def send_prescription(request):
    """
    Handles the sending of prescription details via email to a primary and optionally a secondary recipient.

    This function processes a POST request containing the primary email, optional secondary email, and the prescription ID. It retrieves the prescription details from the database, formats the data, and sends it as an HTML email to the specified recipients.

    Parameters:
    - request (HttpRequest): The request object containing all necessary data.

    Workflow:
    1. Validate the presence of 'primaryEmail' and 'prescription' in the request data.
    2. Retrieve the prescription from the database using the provided 'prescription_id'.
    3. Collect related data such as drugs, tests, symptoms, diagnoses, histories, advices, follow-ups, and vitals linked to the prescription.
    4. Format the collected data for email presentation, including converting dosage information into a readable format.
    5. Prepare and send an HTML formatted email to the primary and optional secondary email addresses.

    Returns:
    - Response: JSON response indicating the success or failure of the email sending operation.

    Raises:
    - Http404: If the prescription does not exist.
    - HttpResponseBadRequest: If 'primaryEmail' or 'prescription' is missing in the request data.

    This function is crucial for ensuring that patients and their caregivers receive timely and accurate prescription information directly through email, enhancing communication and care coordination.
    """
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
    """
    API view to handle CRUD operations for a Prescription object.

    Methods:
    - get_object: Retrieves a Prescription instance by its primary key (pk) or raises Http404 if not found.
    - get: Returns the detailed data of a specific Prescription instance.
    - patch: Updates parts of the Prescription instance including related entities like Symptoms, Tests, Vitals, etc.
             Clears existing related entities and repopulates them based on the provided data, handling creation and deletion as necessary.
    - delete: Deletes a specific Prescription instance.

    The patch method is particularly complex, as it involves:
    1. Clearing existing relationships (e.g., Symptoms, Drugs).
    2. Creating or fetching new instances of related entities based on incoming data.
    3. Re-establishing the relationships with the updated Prescription instance.
    4. Handling exceptions and errors during the update process, ensuring robust data integrity and error reporting.

    This view supports robust interaction with Prescription data, facilitating detailed management and dynamic updates, crucial for real-time medical data handling in a healthcare management system.
    """

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
                item = None
                try:
                    Advices.objects.filter(id=advices_data.get("id")).delete()
                except Exception as e:
                    print(e)
                try:
                    item, _ = Advices.objects.get_or_create(name=advices_data.get('name'))
                    print(item.id, "item")
                    print(_, "___")
                except Exception as e:
                    print("e11->", e)
                snippet.Advices.add(item)

            for followups_data in followups:
                item = None
                try:
                    FollowUps.objects.filter(id=followups_data.get("id")).delete()
                except Exception as e:
                    print(e)
                try:
                    item, _ = FollowUps.objects.get_or_create(name=followups_data.get('name'))
                except Exception as e:
                    print("e11->", e)
                snippet.FollowUps.add(item)

            for medicine in drug:
                get_, created = Salt.objects.get_or_create(name=medicine.get('salt'))
                if created:
                    salt = created
                else:
                    salt = get_

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
    """
    API view to handle the creation and retrieval of Medicine records.

    Methods:
    - get_queryset: Returns a queryset of all Medicine records.
    - get: Retrieves all Medicine records and returns them in a serialized format.
    - post: Creates a new Medicine record from the provided data if it is valid, otherwise returns errors.

    This view is used to manage the list of medicines, allowing for both viewing the entire list and adding new entries to the system.
    """
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
    """
    API view to handle retrieval, updating, and deletion of a specific Medicine record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Medicine record, facilitating detailed management of individual medicine entries in the database.
    """
    def get_queryset(self):
        return Medicine.objects.filter(id=self.kwargs['pk'])

    serializer_class = MedicineSerializer


class SymptomsCreate(APIView):
    """
    API view to handle the creation and retrieval of Symptoms records.

    Methods:
    - get_queryset: Returns a queryset of all Symptoms records.
    - get: Retrieves all Symptoms records and returns them in a serialized format.
    - post: Creates a new Symptoms record from the provided data if it is valid, otherwise returns errors.

    This view is used to manage the list of symptoms, allowing for both viewing the entire list and adding new entries to the system.
    """
    serializer_class = SymptomsSerializer

    def get_queryset(self):
        # Returns all Symptoms records from the database.
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
    """
    API view to handle retrieval, updating, and deletion of a specific Symptoms record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Symptoms record, facilitating detailed management of individual symptoms entries in the database.
    """
    def get_queryset(self):
        return Symptoms.objects.filter(id=self.kwargs['pk'])

    serializer_class = SymptomsSerializer


class TestsCreate(APIView):
    """
    API view to handle the creation and retrieval of Tests records.

    Methods:
    - get_queryset: Returns a queryset of all Tests records.
    - get: Retrieves all Tests records and returns them in a serialized format.
    - post: Creates a new Tests record from the provided data if it is valid, otherwise returns errors.

    This view is crucial for managing the tests inventory, allowing for both viewing the entire list and adding new tests to the system. It supports operations that are essential for maintaining an up-to-date and accessible list of medical tests, which are critical for diagnosing patient conditions.
    """
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
    """
    API view to handle retrieval, updating, and deletion of a specific Tests record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Tests record, facilitating detailed management of individual test entries in the database. It ensures that specific test records can be efficiently accessed, modified, or removed as required by healthcare professionals.

    Methods:
    - get_queryset: Returns the specific Tests record by primary key from the database, ensuring targeted data retrieval.
    """
    def get_queryset(self):
        return Tests.objects.filter(id=self.kwargs['pk'])

    serializer_class = TestsSerializer


class VitalsCreate(APIView):
    serializer_class = VitalsSerializer

    def get_queryset(self):
        # Returns all Tests records from the database.
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
    """
    API view to handle the creation and retrieval of Diagnoses records.

    Methods:
    - get_queryset: Returns a queryset of all Diagnoses records.
    - get: Retrieves all Diagnoses records and returns them in a serialized format, useful for viewing a comprehensive list of diagnoses.
    - post: Creates a new Diagnoses record from the provided data if it is valid, otherwise returns errors. This method is crucial for adding new diagnoses to the system, enhancing the database as medical knowledge expands or as new cases are encountered.

    This view is essential for managing the diagnoses inventory, allowing both viewing the entire list and adding new entries to the system.
    """
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
    """
    API view to handle retrieval, updating, and deletion of a specific Diagnoses record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Diagnoses record, facilitating detailed management of individual diagnoses entries in the database. It supports precise operations on a specific record, allowing healthcare professionals to efficiently access, modify, or remove diagnoses as required.

    Methods:
    - get_queryset: Returns the specific Diagnoses record by primary key from the database, ensuring targeted data retrieval.
    """
    def get_queryset(self):
        return Diagnoses.objects.filter(id=self.kwargs['pk'])

    serializer_class = DiagnosesSerializer


class HistoriesCreate(APIView):
    """
    API view to handle the creation and retrieval of patient Histories records.

    Methods:
    - get_queryset: Returns a queryset of all Histories records.
    - get: Retrieves all Histories records and returns them in a serialized format. This is useful for viewing a comprehensive list of patient histories.
    - post: Creates a new Histories record from the provided data if it is valid, otherwise returns errors. This method is crucial for documenting new patient histories into the system, enhancing the database with detailed patient background information.

    This view is essential for managing the patient histories inventory, allowing both viewing the entire list and adding new entries to the system.
    """
    serializer_class = HistoriesSerializer

    def get_queryset(self):
        # Returns all Histories records from the database. The method is used to fetch all patient history entries for viewing or manipulation.
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
    """
    API view to handle retrieval, updating, and deletion of a specific Histories record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Histories record, facilitating detailed management of individual patient history entries in the database. It supports precise operations on a specific record, allowing healthcare professionals to efficiently access, modify, or remove patient histories as required.

    Methods:
    - get_queryset: Returns the specific Histories record by primary key from the database, ensuring targeted data retrieval.
    """
    def get_queryset(self):
        # Retrieves a specific Histories record by primary key, ensuring precise and efficient data handling.
        return Histories.objects.filter(id=self.kwargs['pk'])

    serializer_class = HistoriesSerializer


class AdvicesCreate(APIView):
    """
    API view to handle the creation and retrieval of Advices records.

    Methods:
    - get_queryset: Returns a queryset of all Advices records.
    - get: Retrieves all Advices records and returns them in a serialized format. This method is useful for viewing a comprehensive list of advices.
    - post: Creates a new Advices record from the provided data if it is valid, otherwise returns errors. This method is crucial for adding new advices to the system, enhancing the database with valuable guidance and recommendations.

    This view is essential for managing the advices inventory, allowing both viewing the entire list and adding new entries to the system.
    """
    serializer_class = AdvicesSerializer

    def get_queryset(self):
        # Returns all Advices records from the database.
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
    """
    API view to handle retrieval, updating, and deletion of a specific Advices record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Advices record, facilitating detailed management of individual advice entries in the database. It supports precise operations on a specific record, allowing healthcare professionals to efficiently access, modify, or remove advices as required.

    Methods:
    - get_queryset: Returns the specific Advices record by primary key from the database, ensuring targeted data retrieval.
    """
    def get_queryset(self):
        # Retrieves a specific Advices record by primary key, ensuring precise and efficient data handling.
        return Advices.objects.filter(id=self.kwargs['pk'])

    serializer_class = AdvicesSerializer


class FollowUpsCreate(APIView):
    """
    API view to handle the creation and retrieval of Follow-Ups records.

    Methods:
    - get_queryset: Returns a queryset of all Follow-Ups records.
    - get: Retrieves all Follow-Ups records and returns them in a serialized format. This method is useful for viewing a comprehensive list of follow-up actions.
    - post: Creates a new Follow-Ups record from the provided data if it is valid, otherwise returns errors. This method is crucial for adding new follow-up actions to the system, enhancing the database with valuable follow-up information.

    This view is essential for managing the follow-ups inventory, allowing both viewing the entire list and adding new entries to the system.
    """
    serializer_class = FollowUpsSerializer

    def get_queryset(self):
        # Returns all Follow-Ups records from the database.
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
    """
    API view to handle retrieval, updating, and deletion of a specific Follow-Ups record identified by its primary key.

    This view extends Django's generic RetrieveUpdateDestroyAPIView to provide standard operations for a single Follow-Ups record, facilitating detailed management of individual follow-up entries in the database. It supports precise operations on a specific record, allowing healthcare professionals to efficiently access, modify, or remove follow-ups as required.

    Methods:
    - get_queryset: Returns the specific Follow-Ups record by primary key from the database, ensuring targeted data retrieval.
    """
    def get_queryset(self):
        return FollowUps.objects.filter(id=self.kwargs['pk'])

    serializer_class = FollowUpsSerializer


class SaltList(APIView):
    """
    API view to handle the retrieval of all Salt records.

    This view provides a list of all salts stored in the database, allowing for a comprehensive view of available salt data. It is useful for scenarios where users need to browse or select from all available salts.

    Methods:
    - get_queryset: Returns a queryset of all Salt records.
    - get: Retrieves all Salt records and returns them in a serialized format, making it easy to integrate and use the data in client applications.
    """
    def get_queryset(self):
        return Salt.objects.all()

    def get(self, request):
        salts = Salt.objects.all()
        serializer = SaltSerializer(salts, many=True)
        return Response(serializer.data)


class SaltDetail(APIView):
    """
    API view to handle the retrieval of a specific Salt record by its name.

    This view is crucial for accessing detailed information about a specific salt, identified by its unique name. It supports operations that require precise data about a particular salt, such as displaying detailed salt information or performing operations specific to that salt.

    Methods:
    - get_queryset: Returns a queryset of all Salt records, although typically filtered in the get method.
    - get: Retrieves a specific Salt record by its name and returns it in a serialized format. If the salt is not found, it returns a 404 error, ensuring robust error handling.
    """
    def get_queryset(self):
        # Returns all Salt records from the database, though specific filtering happens in the get method.
        return Salt.objects.all()

    def get(self, request, salt_name):
        salt = get_object_or_404(Salt, name=salt_name)
        serializer = SaltSerializer(salt)
        return Response(serializer.data)

