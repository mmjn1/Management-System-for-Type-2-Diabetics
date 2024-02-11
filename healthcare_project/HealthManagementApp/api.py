from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions

# Sotp Imports
from sotp.models import UserSOTP
from sotp.services import GenerateSOTP

from HealthManagementApp.serialisers.serializers import loginSerializer

otp = GenerateSOTP()

User = get_user_model()
