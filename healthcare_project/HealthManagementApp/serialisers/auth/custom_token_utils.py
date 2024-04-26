from .common_imports import (
    status, # from rest_framework import status
    exceptions, # from rest_framework import exceptions
    TokenObtainPairSerializer, # from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    TokenObtainSerializer, # from rest_framework_simplejwt.serializers import TokenObtainSerializer
    TokenError, # from rest_framework_simplejwt.exceptions import TokenError
    InvalidToken, # from rest_framework_simplejwt.exceptions import InvalidToken
    AuthenticationFailed, # from rest_framework_simplejwt.exceptions import AuthenticationFailed
    authenticate, # from django.contrib.auth import authenticate
    _ # from django.utils.translation import gettext_lazy as _
)
from HealthManagementApp.models import CustomUser as User


class InActiveUser(AuthenticationFailed):
    """
    Custom exception class for handling authentication failures specifically related to inactive user accounts.
    This class extends the AuthenticationFailed exception from SimpleJWT and sets a specific status code and error message.
    """
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = "Please activate your account before logging in."
    # default_code = 'no_active_account'


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer, TokenObtainSerializer):
    """
    Custom serializer for obtaining JWT tokens for users. This serializer extends both TokenObtainPairSerializer
    and TokenObtainSerializer from SimpleJWT to handle token creation with additional checks for user account status.
    """
    def validate(self, attrs):
        """
        Validates the user's credentials and checks the account status before issuing JWT tokens.
        If the user's account is inactive or the credentials are invalid, appropriate exceptions are raised.
        """
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass

        # Check if the user exists and whether their account is active.
        try:
            user = User.objects.get(email=authenticate_kwargs['email'])
            if not user.is_active:
                self.error_messages['no_active_account'] = _('The account is inactive')
                raise InActiveUser()
        except User.DoesNotExist:
            self.error_messages['no_active_account'] = _('Invalid login credentials')
            raise exceptions.AuthenticationFailed(
                self.error_messages['no_active_account'],
                'no_active_account',
            )

        # Authenticate the user with the provided credentials.
        self.user = authenticate(**authenticate_kwargs)
        if self.user is None:
            self.error_messages['no_active_account'] = _('Invalid login credentials')
            raise exceptions.AuthenticationFailed(
                self.error_messages['no_active_account'],
                'no_active_account',
            )
        return super().validate(attrs)