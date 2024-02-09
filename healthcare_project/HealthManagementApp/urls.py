# import logging
import sys
import logging

from django.urls import path
from django.contrib.auth import get_user_model
from django.urls import path, include
from HealthManagementApp.views.views import SupportInquiryView, DoctorView

from rest_framework.response import Response
from rest_framework import routers, serializers, viewsets, generics, status
from rest_framework_simplejwt.views import (
    TokenRefreshView as RefreshTokenView, TokenVerifyView as VerifyTokenView,)

from djoser import views

from .views import (
    PatientCreateView,
    PatientTokenObtainPairView,
    AdminTokenObtainPairView,
)

logger = logging.getLogger(__name__)

# Get the UserModel
User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    User Serializer
    description: This serializer is used to serialize 
    the User model for the API endpoint /api/users/ and 
    hyperlinked to the user's profile
    """
    
    class Meta:
        model = User
        fields = ['url', 'email', 'name', 'role']




# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

# route for patients (user registration)
router.register('patient', PatientCreateView, basename="register_patient")


urlpatterns = [
    path('', include(router.urls)),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    #### Login endpoints ####
    # Admin login endpoint
    path('auth/admin-login/', AdminTokenObtainPairView.as_view(), name='admin_login'),

    # Patient login endpoint
    path('auth/patient-login/', PatientTokenObtainPairView.as_view(), name='patient_login'),


    ### JWT token endpoints ###
    # Refresh JWT token for user
    path('auth/jwt/refresh/', RefreshTokenView.as_view(), name='jwt_refresh'),

    # Verify JWT token for user
    path('auth/account-verify/', VerifyTokenView.as_view(), name='account_verify'),

    # get all endpoints from djoser package
    path('auth/', include('djoser.urls')),

    path('create-contact/', SupportInquiryView.as_view(), name='create_contact'),

    path('api/doctors/', DoctorView.as_view(), name='doctors'),
]

urlpatterns += router.urls