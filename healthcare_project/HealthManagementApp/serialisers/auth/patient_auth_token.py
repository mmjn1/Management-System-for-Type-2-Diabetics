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

from .custom_token_utils import (
    CustomTokenObtainPairSerializer,
)


class PatientAuthTokenSerializer(CustomTokenObtainPairSerializer):
    """
    A custom serializer for authenticating patients, extending the CustomTokenObtainPairSerializer.
    This serializer adds an additional layer of validation to check the user's role before issuing a JWT token.
    It ensures that only users with a specific role (patients) are allowed to authenticate.
    """
    def validate(self, attrs):
        """
        Validates the user's credentials and role. If the user's role is not '1' (patient),
        an AuthenticationFailed exception is raised, preventing login.
        """
        data = super().validate(attrs)  # Validate using the parent class method
        user = self.user  # Access the authenticated user from the parent class

        # Check if the authenticated user has the patient role
        if user.role != '1':
            raise exceptions.AuthenticationFailed(
                _('Unauthorized user'),  # User-friendly error message
                'unauthorized_user'  # Error code
            )

        return data
