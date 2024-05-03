import logging

from django.urls import path, include 
from django.contrib.auth import get_user_model
from HealthManagementApp.views.views import *
from rest_framework.response import Response
from rest_framework import routers, serializers, viewsets, generics, status
from rest_framework_simplejwt.views import (
    TokenRefreshView as RefreshTokenView, TokenVerifyView as VerifyTokenView,)

from .views import (
    PatientCreateView,
    PatientTokenObtainPairView,
    AdminTokenObtainPairView,
)

from HealthManagementApp.APIs.apis import *


logger = logging.getLogger(__name__)

User = get_user_model()

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

# route for patients (user registration)
router.register('patient', PatientCreateView, basename="register_patient")


urlpatterns = [
    path('', include(router.urls)),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/admin-login/', AdminTokenObtainPairView.as_view(), name='admin_login'),
    path('auth/patient-login/', PatientTokenObtainPairView.as_view(), name='patient_login'),
    path('auth/jwt/refresh/', RefreshTokenView.as_view(), name='jwt_refresh'),
    path('auth/account-verify/', VerifyTokenView.as_view(), name='account_verify'),
    
    path('createDoctor/', DoctorCreate.as_view(), name='Create Doctor'),
    path('createPatient/', PatientCreate.as_view(), name='Create Patient'),
    path('create-contact/', SupportInquiryView.as_view(), name='create_contact'),
    path('api/doctors/', DoctorView.as_view(), name='doctors'),
    path('api/patient/', PatientView.as_view(), name='patients'),
    path('AccountSuccess/', activate_account, name="AccountSuccess"),
    path('activate/<uidb64>/<token>', VerificationView.as_view(), name='activate'),

    path('accountinfo/', update_patient_account_info, name='update-patient-account-info'),
    path('lifestyle-med/', update_patient_lifestylemed_info, name='update_patient_lifestylemed_info'),
    path('health-info/', update_patient_healthinfo, name='update_patient_healthinfo'),

    path('current-patient/', CurrentPatientDetailView.as_view(), name='current-patient'),
    path('patient_records/', PatientListView.as_view(), name='patient-records'),
    path('patient-records/<int:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),

    path('forms/', FormList.as_view(), name='forms_list'),
    path('forms/<int:pk>/', FormDetails.as_view(), name='form_details'),
    path('submit-form/<int:form_id>/responses/', submit_form_response, name='submit_form_response'),
    path('patients/', PatientListView.as_view(), name='patients_list'),

    path('patient/<int:patient_id>/forms/', get_patient_forms, name='get_patient_forms'),
    path('forms/<int:form_id>/responses/update/', update_form_response, name='update-form-response'),

    path('account-information/', update_doctor_account_info, name='update_doctor_account_info'),
    path('professional-info/', update_professionalInfo, name='update_professionalInfo'),
    path('practice-details/', update_PracticeInfo, name='update_PracticeInfo'),
    
    path('create-entry/', create_dietary_advice, name='create_dietary_advice'),
    path('update-entry/<int:entry_id>/', update_dietary_advice, name='update_meal_entry'),
    path('delete-entry/<int:entry_id>/', delete_dietary_advice, name='delete_dietary_advice'),
    
    # Health Check endpoint: Used for monitoring the application's health status. 
    # AWS ECS uses thus to ensure the service is up and running.
    path('container-health/', health_check, name='health-check'), 


    path('Prescription/', PrescriptionCreate.as_view(), name='Create Prescription'),
    path('Prescription/<int:pk>/', PrescriptionData.as_view(), name='Update Prescription'),
    path('Prescriptions/doctor/<int:doctor_id>/', PrescriptionDoctor.as_view()),
    path('Prescriptions/patient/<int:patient_id>/', PrescriptionPatient.as_view()),
    path('Prescriptions/email/', send_prescription),

    path('Medicine/', MedicineCreate.as_view(), name='Create Medicine'),
    path('Medicine/<int:pk>/', MedicineData.as_view(), name='Update Medicine'),

    path('Drugs/', DrugsCreate.as_view(), name='Create Drugs'),
    path('Drugs/<int:pk>/', DrugsData.as_view(), name='Update Drugs'),

    path('Symptoms/', SymptomsCreate.as_view(), name='Create Symptoms'),
    path('Symptoms/<int:pk>/', SymptomsData.as_view(), name='Update Symptoms'),

    path('Tests/', TestsCreate.as_view(), name='Create Tests'),
    path('Tests/<int:pk>/', TestsData.as_view(), name='Update Tests'),

    path('Vitals/', VitalsCreate.as_view(), name='Create Vitals'),
    path('Vitals/<int:pk>/', VitalsData.as_view(), name='update Vitals'),

    path('Diagnoses/', DiagnosesCreate.as_view(), name='Create Diagnoses'),
    path('Diagnoses/<int:pk>/', DiagnosesData.as_view(), name='Update Diagnoses'),

    path('Histories/', HistoriesCreate.as_view(), name='Create Histories'),
    path('Histories/<int:pk>/', HistoriesData.as_view(), name='Update Histories'),

    path('Advices/', AdvicesCreate.as_view(), name='Create Advices'),
    path('Advices/<int:pk>/', AdvicesData.as_view(), name='Update Advices'),

    path('FollowUps/', FollowUpsCreate.as_view(), name='Create FollowUps'),
    path('FollowUps/<int:pk>/', FollowUpsData.as_view(), name='Update FollowUps'),

    path('salts/', SaltList.as_view(), name='salt-list'),
    path('salts/<str:salt_name>/', SaltDetail.as_view(), name='salt-detail'),


    # Appointments URLS
    path('doctor-appointment-types/', doctor_appointment_types_view, name='doctor-appointment-types'),
    path('patient-appointment-types/', patient_appointment_types_view, name='patient-appointment-types'),
    path('doctor/patients/', get_patients_for_doctor, name='doctor-patients'),

    path('locations/', list_locations.as_view(), name='list_locations'),

    path('create-availability/', create_weekly_availability, name='create_weekly_availability'),
    path('fetch-availability/', get_weekly_availability, name='get_weekly_availability'),
    path('timeslots/', get_time_slot_doctor, name='time_slot_by_doctor'),
    path('doctoravailability/', DoctorAvailability, name='time_slot_by_doctor'),
    # http://127.0.0.1:8000/api/fetch-availability/?doctor_id=1
    path('doctor-availability/', get_doctor_availability, name='get_doctor_availability'),
    # http://127.0.0.1:8000/api/doctor-availability/?doctorId=1&date=2024-01-01
    path('timeslots/<int:pk>/', TimeSlotView.as_view(), name='timeslot-detail'),
    path('doctor/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('patient-create-appointment/', create_new_appointment, name='create_patient_appointment'),
    path('get-patient-appointment/', get_patient_appointment, name='get_patient_appointment'),
    path('get-patient-appointment-pid/', get_patient_appointment_patient, name='get_patient_appointment_patient'),

    path('patient-appointment/<int:pk>/', patient_appointment_data.as_view(), name='update patient_appointment'),

    path('appointment-followup/<int:pk>/', AppointmentFollowupView.as_view(),
         name='appointment_follow_up'),

    path('doctor-availability/<int:doctor_id>/<str:date_data>/', DoctorAvailabilityView.as_view()),

    # WS
    path('old_patient-create-appointment/', old_create_patient_appointment, name='create_patient_appointment'),
    path('appointments/<int:appointment_id>/', delete_appointment, name='delete_appointment'),
    path('update-availability/<int:pk>/', update_weekly_availability, name='update_weekly_availability'),

]

urlpatterns += router.urls
