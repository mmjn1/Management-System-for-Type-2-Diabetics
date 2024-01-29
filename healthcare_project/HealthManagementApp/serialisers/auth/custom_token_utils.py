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
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = "Please activate your account before logging in."
    # default_code = 'no_active_account'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer, TokenObtainSerializer):

    # Overiding validate function in the TokenObtainSerializer  
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass

        # print(f"\nthis is the user of authenticate_kwargs {authenticate_kwargs['email']}\n")


        '''
        Checking if the user exists by getting the email(username field) from authentication_kwargs.
        If the user exists we check if the user account is active.
        If the user account is not active we raise the exception and pass the message. 
        Thus stopping the user from getting authenticated altogether. 
        
        And if the user does not exist at all we raise an exception with a different error message.
        Thus stopping the execution righ there.  
        '''
        try:
         user = User.objects.get(email=authenticate_kwargs['email'])
         if not user.is_active:
             self.error_messages['no_active_account']=_(
                 'The account is inactive'
             )
             raise InActiveUser();
        except User.DoesNotExist:
          self.error_messages['no_active_account'] =_(
                'Invalid login credentials'
              )
          raise exceptions.AuthenticationFailed(
                self.error_messages['no_active_account'],
                'no_active_account',
          )

        '''
        We come here if everything above goes well.
        Here we authenticate the user.
        The authenticate function return None if the credentials do not match 
        or the user account is inactive. However here we can safely raise the exception
        that the credentials did not match as we do all the checks above this point.
        '''

        self.user = authenticate(**authenticate_kwargs)
        if self.user is None:
            self.error_messages['no_active_account'] = _(
                'Invalid login credentials'
            )
            raise exceptions.AuthenticationFailed(
                self.error_messages['no_active_account'],
                'no_active_account',
            )
        return super().validate(attrs)