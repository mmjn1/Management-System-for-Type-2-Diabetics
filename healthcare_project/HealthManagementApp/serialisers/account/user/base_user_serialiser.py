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
    A serializer for user registration that extends Djoser's UserCreatePasswordRetypeSerializer.
    This serializer handles the creation of new users with fields such as username, email, password,
    and name. It ensures that the password is not returned in the response by setting it as write-only.
    The 're_password' field is used for password confirmation during registration but is not stored in the model.
    """
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
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
        Validates the input data. This method is called before creating a new user instance.
        It ensures that all necessary validations are passed, otherwise, it raises a validation error.
        """
        return data

    def create(self, validated_data):
        """
        Creates a new user instance using the validated data. This method handles the removal of the
        're_password' field which is not intended to be stored in the database.
        """
        try:
            re_password = validated_data.pop('re_password', None)
            user = super().create(validated_data)
            return user

        except Exception as e:
            raise Exception(e)


class old_UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    A serializer for existing users that provides a hyperlinked identity for user instances.
    This serializer is typically used for user listing endpoints where each user's data is linked to their profile.
    It includes fields like URL, email, name, and role.
    """
    class Meta:
        model = User
        fields = ['url', 'email', 'name', 'role']