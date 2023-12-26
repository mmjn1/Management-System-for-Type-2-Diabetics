from .common_imports import (

    # django imports
    get_object_or_404, # from django.shortcuts import get_object_or_404

    # rest framework imports
    generics, # from rest_framework import generics
    Response, # from rest_framework.response import Response
    api_view, # from rest_framework.decorators import api_view

    # djoser imports
    UserViewSet, # from djoser.views import UserViewSet

    # local imports
    CustomUser, # from HealthManagementApp.models import CustomUser

)

from HealthManagementApp.serialisers import (
    PatientRegisterSerialiser, # from .serializers import EmployerRegisterSerialiser
)

from .base_user_views import (
    UserRegistrationView, # from .base_user_views import UserRegistrationView
)

class PatientCreateView(UserRegistrationView):
    """
    Patient registration view
    """
    serializer_class = PatientRegisterSerialiser # override the serializer class

    def get_serializer_class(self):
        """
        Return the class to use for the serializer.
        """
        print("PatientCreateView.get_serializer_class() called")
        return PatientRegisterSerialiser