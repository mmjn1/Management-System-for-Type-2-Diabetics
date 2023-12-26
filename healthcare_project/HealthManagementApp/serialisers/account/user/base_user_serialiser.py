from .common_imports import (
    get_user_model,  # from django.contrib.auth import get_user_mode
    # from djoser.serializers import UserCreatePasswordRetypeSerializer
    UserCreatePasswordRetypeSerializer,
    serializers,  # from rest_framework import serializers
    _,  # from django.utils.translation import gettext_lazy as _
    CustomUser,  # from HealthManagementApp.models import CustomUser
    Role,  # from apps.accounts.models import Role
)


User = get_user_model()


class UserSerializer(UserCreatePasswordRetypeSerializer):
    """
    User Serializer: A serializer class that converts a User model instance into Python data types
    and vice versa.
    NOTE: This serializer is used for the registration of a new user.
          It defined in the project's settings.py file.
    """

    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        """
        Meta class: A class that contains the metadata of the UserSerializer class.
        The serializer only includes the fields for username, email, password, and re_password.
        !!! NOTE: The re_password field is not included in the User model. It is only used for validation.
                 - Djoser 2.1.0 has special serializer for this purpose (UserCreatePasswordRetypeSerializer)
        """
        model = CustomUser
        fields = [
            'username',
            'email',
            'password',
            # 're_password',
            'name',
        ]

        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        """
        validate: A method that validates the data passed in.
        is_valid() method is called in the view. If it returns False, the view will raise a validation error.
        """
        # print("data: ")
        # print(data)
        return data

    def create(self, validated_data):
        """
        create: A method that creates a new User instance and returns it.
        """
        # print("validated data: ")
        # print(validated_data)
        try:

            re_password = validated_data.pop('re_password', None)
            user = super().create(validated_data)
            # print("user: ")
            # print(user)

            return user

        except Exception as e:
            raise Exception(e)