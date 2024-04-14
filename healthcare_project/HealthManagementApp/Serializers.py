from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission, Group
from djoser.serializers import TokenCreateSerializer as DjoserTokenCreateSerializer

User = get_user_model()

"""
Defines serializers for user authentication and token creation in Django REST framework.
Includes a custom serializer for token creation that adds additional user information to the token response.
The `CustomTokenCreateSerializer` class extends `DjoserTokenCreateSerializer` to include user's first name, last name, and type of user in the token response.
"""


class loginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class CustomTokenCreateSerializer(DjoserTokenCreateSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user = self.context['request'].user
        ret['first_name'] = user.first_name
        ret['last_name'] = user.last_name
        ret['type_of_user'] = getattr(user, 'type_of_user', 'default_value')  
        print(ret)
        return ret