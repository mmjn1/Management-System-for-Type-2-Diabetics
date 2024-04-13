import logging

from django.urls import path, include 
from django.contrib.auth import get_user_model
from HealthManagementApp.views.views import(SupportInquiryView, 
                                            DoctorView, 
                                            PatientView, 
                                            VerificationView, 
                                            activate_account,
                                            list_locations,
                                            doctor_appointment_types_view,
                                            patient_appointment_types_view,
                                            get_patients_for_doctor,
                                            update_patient_account_info,
                                            update_patient_healthinfo,
                                            update_patient_lifestylemed_info,
                                            create_weekly_availability,                                                                                 
                                            update_weekly_availability,
                                            get_weekly_availability,
                                            get_doctor_availability,
                                            create_patient_appointment,
                                            TimeSlotView,
                                            DoctorDetailView,
                                            delete_appointment,
                                            CurrentPatientDetailView,
                                            PatientListView,
                                            PatientDetailView,
                                            FormList,
                                            FormDetails,
                                            submit_form_response,
                                            PatientListView,
                                            get_patient_forms,
                                            update_form_response,
                                            update_doctor_account_info,
                                            update_professionalInfo,
                                            update_PracticeInfo,
                                            get_dietary_advice,
                                            update_dietary_advice,
                                            delete_dietary_advice,
                                            health_check,
                                        )
from rest_framework.response import Response
from rest_framework import routers, serializers, viewsets, generics, status
from rest_framework_simplejwt.views import (
    TokenRefreshView as RefreshTokenView, TokenVerifyView as VerifyTokenView,)


from .views import (
    PatientCreateView,
    PatientTokenObtainPairView,
    AdminTokenObtainPairView,
)

from HealthManagementApp.APIs.apis import DoctorCreate, PatientCreate


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
    path('locations/', list_locations, name='list_locations'),
    path('doctor-appointment-types/', doctor_appointment_types_view, name='doctor-appointment-types'),
    path('patient-appointment-types/', patient_appointment_types_view, name='patient-appointment-types'),
    path('doctor/patients/', get_patients_for_doctor, name='doctor-patients'),

    path('accountinfo/', update_patient_account_info, name='update-patient-account-info'),
    path('lifestyle-med/', update_patient_lifestylemed_info, name='update_patient_lifestylemed_info'),
    path('health-info/', update_patient_healthinfo, name='update_patient_healthinfo'),

    path('create-availability/', create_weekly_availability, name='create_weekly_availability'),
    path('update-availability/<int:pk>/', update_weekly_availability, name='update_weekly_availability'),

    path('fetch-availability/', get_weekly_availability, name='get_weekly_availability'),
    path('doctor-availability/', get_doctor_availability, name='get_doctor_availability'),
    path('patient-create-appointment/', create_patient_appointment, name='create_patient_appointment'),
    path('timeslots/<int:pk>/', TimeSlotView.as_view(), name='timeslot-detail'),
    path('doctor/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('appointments/<int:appointment_id>/', delete_appointment, name='delete_appointment'),
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
    path('create-entry/', get_dietary_advice, name='get_dietary_advice'),

    path('update-entry/<int:entry_id>/', update_dietary_advice, name='update_meal_entry'),
    path('delete-entry/<int:entry_id>/', delete_dietary_advice, name='delete_dietary_advice'),
    path('container-health/', health_check, name='health-check'),

]

urlpatterns += router.urls