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
    Patient Serializer: A serializer class that converts a Patient model instance into Python data types and vice versa.
    """

    class Meta:
        """
        Meta class: A class that contains the metadata of the PatientSerialiser class.
        NOTE: fields is defined in the Patient model.
        """
        model = Patient
        # Show only the following fields in the API response and accept only the following fields in the request data.
        fields = "__all__"

    def validate(self, data):
        """
        validate: A method that validates the data passed in.
        """

        return data

    def create(self, user, **validated_data):
        """
        create: A method that creates a new Student instance and returns it.
        """
        try:

            #FIXME: Please to be discussion about how to create a new patient instance? Do we need to attach the Doctor to the patient? if so, then how do we do that? DO the request.data contain the doctor id?
            patient = Patient.objects.create(
                user=user,
                **validated_data
            )
            return patient

        except Exception as e:
            raise Exception(e)


class PatientRegisterSerialiser(UserCreatePasswordRetypeSerializer):
    """
    Patient Register Serialiser: A serialiser class that converts a PatientRegisterSerialiser model instance into Python data types and vice versa.
    NOTE: This class inherits from the UserCreatePasswordRetypeSerializer (Djoser 2.1.0) class.
    It's a combination of the UserCreatePasswordRetypeSerializer  (Djoser 2.1.0 ), ProfileSerializer and StudentSerializer.
    """
    patient = PatientSerialiser()


    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        """
        Meta class: A class that contains the metadata of the PatientRegisterSerialiser class.
        NOTE: fields coming from the UserCreatePasswordRetypeSerializer (Djoser 2.1.0), ProfileSerializer and PatientSerialiser.
        """


        model = CustomUser
        fields = ['email', 'password', 'name', 'patient']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True},
            're_password': {'write_only': True},
        }
    # It is !important to validate the data before creating the user



    def validate(self, data):
        """
        validate: A method that validates the data passed in.
        It is for validating user instance data. (UserCreatePasswordRetypeSerializer)
        Note: Do not forget to pop out the patient data from the request data. It is not part of the user instance. 
        Patient data is a separate model instance. and It has separate serializer with its own validation.
        """

        # Pop out the patient data from the request data
        patient_data = data.pop('patient')

        # get the user data
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
        create: A method that creates a new user instance and returns it.
        """

        try:
            patient_data = validated_data.pop('patient')
            user_data = validated_data.pop('user')
            # print("patient_data: ", patient_data)
            user_created = super().create(user_data)

            # Create the Patient instance separately
            patient = PatientSerialiser.create(self, user_created, **patient_data)

            user_role = Role.PATIENT
            user_created.role = user_role

            user_created.save()


            return user_created

        except Exception as e:
            raise Exception(e)