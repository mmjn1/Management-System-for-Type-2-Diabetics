from rest_framework import serializers
from .old_models import Doctor, Patient
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenObtainSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, AuthenticationFailed
from django.contrib.auth.password_validation import validate_password
from rest_framework import status, exceptions
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
User = get_user_model()
from .old_models import CustomUser as User


"""
Serializer used to serializes the models into a JSON format 
to communicate with React.
"""

class InActiveUser(AuthenticationFailed):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = "Please activate your account before logging in."
    # default_code = 'no_active_account'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer, TokenObtainSerializer):

    # Overiding validate function in the TokenObtainSerializer  
    def validate(self, attrs):
        authenticate_kwargs = {
            self.email_field: attrs[self.email_field],
            'password': attrs['password'],
        }
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass

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
             raise InActiveUser()
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





class PatientTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Custom validation logic for patients
        data = super().validate(attrs)
        # Additional patient-specific logic
        return data

class DoctorTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Custom validation logic for doctors
        data = super().validate(attrs)
        # Additional doctor-specific logic
        return data


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'  

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')
        
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
   
    # def validate(self, data):
    #     user = User(**data)
    #     password = data.get('password')

    #     try:
    #         validate_password(password, user)
    #     except exceptions.ValidationError as e:
    #         serializer_errors = serializers.as_serializer_error(e)
    #         raise exceptions.ValidationError(
    #             {'password': serializer_errors['non_field_errors']}
    #         )
    #     return data
        
    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']        
        )
       
        return user
    


 