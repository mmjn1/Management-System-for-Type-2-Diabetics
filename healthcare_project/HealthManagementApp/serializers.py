from rest_framework import serializers
from .models import Doctor, Patient
from django.core import exceptions
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
User = get_user_model()
  
"""
Serializer used to serializes the models into a JSON format 
to communicate with React.
"""

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
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'  

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'  