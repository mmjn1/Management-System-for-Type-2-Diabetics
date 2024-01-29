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


class AdminAuthTokenSerializer(CustomTokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        print('user role is type: ', user.role, type(user.role))

        # To understand the role values, check the "healthcare_project/HealthManagementApp/models/roles.py" file
        if user.role != '3':
            # print('user.role != employer')
            raise exceptions.AuthenticationFailed(
                _('Unathorized user'),
                'unauthorized_user'
            )

        return data