from djoser.serializers import TokenCreateSerializer

from .common_imports import (
    status,  # from rest_framework import status
    exceptions,  # from rest_framework import exceptions
    # from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    TokenObtainPairSerializer,
    # from rest_framework_simplejwt.serializers import TokenObtainSerializer
    TokenObtainSerializer,
    TokenError,  # from rest_framework_simplejwt.exceptions import TokenError
    InvalidToken,  # from rest_framework_simplejwt.exceptions import InvalidToken
    # from rest_framework_simplejwt.exceptions import AuthenticationFailed
    AuthenticationFailed,
    authenticate,  # from django.contrib.auth import authenticate
    _  # from django.utils.translation import gettext_lazy as _
)
# from knox.models import AuthToken

from .custom_token_utils import (
    CustomTokenObtainPairSerializer,
)
from rest_framework import serializers
from django.conf import settings


class AdminAuthTokenSerializer(CustomTokenObtainPairSerializer):
    """
    A custom serializer for authenticating administrative users, extending the CustomTokenObtainPairSerializer.
    This serializer adds an additional layer of validation to check the user's role before issuing a JWT token.
    It ensures that only users with a specific role (admin) are allowed to authenticate.
    """
    def validate(self, attrs):
        """
        Validates the user's credentials and role. If the user's role is not '3' (admin),
        an AuthenticationFailed exception is raised, preventing login.
        """
        data = super().validate(attrs)  # Validate using the parent class method
        user = self.user  # Access the authenticated user from the parent class


        # Check if the authenticated user has the admin role
        if user.role != '3':
            raise exceptions.AuthenticationFailed(
                _('Unauthorized user'),  # User-friendly error message
                'unauthorized_user'  # Error code
            )

        return data

class CustomTokenCreateSerializer(TokenCreateSerializer):
    """
    A custom serializer for creating tokens that includes additional user information in the token creation response.
    This serializer extends the TokenCreateSerializer from Djoser.
    """
    def validate(self, attrs):
        """
        Performs the standard validation and then adds additional user information to the response.
        This includes the user's first name, last name, middle name, and type.
        """
        data = super().validate(attrs)  # Perform the standard validation
        user = self.user  # Access the authenticated user

        # Update the response data with additional user information
        data.update({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'middle_name': user.middle_name,
            'type': user.type,  
        })
        return data
