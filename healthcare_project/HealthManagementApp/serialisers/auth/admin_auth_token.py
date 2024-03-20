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
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        print('user role is type: ', user.role, type(user.role))

        if user.role != '3':
            raise exceptions.AuthenticationFailed(
                _('Unathorized user'),
                'unauthorized_user'
            )

        return data


# class TokenSerializer(serializers.ModelSerializer):
#     auth_token = serializers.CharField(source="token_key")
#
#     class Meta:
#         model = AuthToken
#         fields = ("auth_token",)

class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        # Perform the standard validation.
        data = super().validate(attrs)

        # Include additional user information in the response.
        user = self.user
        data.update({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'middle_name': user.middle_name,
            'type': user.type,  # Assuming this is a field on your user model
        })
        return data


# class CustomTokenSerializer(serializers.ModelSerializer):
#     auth_token = serializers.CharField(source="key")
#
#     class Meta:
#         model = settings.TOKEN_MODEL
#         fields = ("auth_token",)
