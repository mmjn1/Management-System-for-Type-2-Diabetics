from .common_imports import (
    get_user_model,  # from django.contrib.auth import get_user_mode
    # from djoser.serializers import UserCreatePasswordRetypeSerializer
    UserCreatePasswordRetypeSerializer,
    serializers,  # from rest_framework import serializers
    _,  # from django.utils.translation import gettext_lazy as _
    CustomUser,  # from HealthManagementApp.models import CustomUser
    Role,  # from HealthManagementApp.models import Role
    sys,  # import sys
    logging,  # import logging

)

from HealthManagementApp.models import (
    Patient,
)

from .base_user_serialiser import UserSerializer



class PatientSerialiser(serializers.ModelSerializer):
    """
    A serializer for the Patient model that handles the conversion of Patient instances to and from Python data types.
    This serializer excludes the 'user' and 'doctors' fields from the serialized representation.
    """
    class Meta:   
        model = Patient
        exclude = ['user','doctors'] # Show only the following fields in the API response and accept only the following fields in the request data.

    def validate(self, data):
        """
        Validates the data provided for creating or updating a Patient instance.
        """
        return data

    def create(self, user, **validated_data):
        """
        Creates a new Patient instance associated with a user, 
        using the provided validated data.
        """
        try:
            patient = Patient.objects.create(
                user=user,
                **validated_data
            )
            return patient

        except Exception as e:
            raise Exception(e)

class PatientRegisterSerialiser(UserCreatePasswordRetypeSerializer):
    """
    A serializer for registering a new patient, extending Djoser's UserCreatePasswordRetypeSerializer.
    This serializer handles the registration of both the user and the patient details in a nested manner.
    It ensures that the patient data is validated separately and then combined with the user data to create a new patient account.
    """
    
    patient = PatientSerialiser()


    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        model = CustomUser
        fields = ['email', 'password', 'name', 'patient']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True},
            're_password': {'write_only': True},
        }

    def validate(self, data):
        """
        Validates the combined data for both user and patient. It separates patient data from user data,
        validates them independently, and then merges them back together.
        """

        # Pop out the patient data from the request data
        patient_data = data.pop('patient')
        user_data = data  

        # pass the user data to the super class cauz user data is made up of the fields from the UserCreatePasswordRetypeSerializer
        validated_user = super().validate(user_data)

        # Put the patient data back into the request data so that it can be used to create the patient instance
        new_data = {}
        new_data['patient'] = patient_data
        new_data['user'] = validated_user
        return new_data

    def create(self, validated_data):
        """
        Creates a new user and patient instance based on the validated data. It first creates the user,
        then creates the patient linked to that user, and assigns the appropriate role to the user.
        """
        try:
            patient_data = validated_data.pop('patient')
            user_data = validated_data.pop('user')
            user_created = super().create(user_data)
            patient = PatientSerialiser.create(self, user_created, **patient_data)
            user_role = Role.PATIENT
            user_created.role = user_role

            patient.user = user_created
            patient.save()
            user_created.save()

            return user_created

        except Exception as e:
            raise Exception(e)