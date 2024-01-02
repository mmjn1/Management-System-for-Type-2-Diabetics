from .common_imports import (

    # django imports
    get_object_or_404,  # from django.shortcuts import get_object_or_404

    # rest framework imports
    generics,  # from rest_framework import generics
    Response,  # from rest_framework.response import Response
    api_view,  # from rest_framework.decorators import api_view

    # djoser imports
    UserViewSet,  # from djoser.views import UserViewSet

    # local imports
    CustomUser,  # from HealthManagementApp.models import CustomUser

)

from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny


class UserRegistrationView(UserViewSet):
    """
    User Registration View (Djoser view)
    """
    queryset = CustomUser.objects.all()

    def get_serializer_class(self):
        """
        Get the serializer class - this will Override  in the child classes
        """
        return UserSerializer