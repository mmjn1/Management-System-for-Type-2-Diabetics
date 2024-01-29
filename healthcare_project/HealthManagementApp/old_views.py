from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from healthcare_project.HealthManagementApp.old_serializers import CustomTokenObtainPairSerializer

"""
In views.py, I've overridden the TokenObtainPairView to customise 
the process of generating authentication tokens for the Patient and Doctor.

"""

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PatientRegistrationView(APIView):
    pass