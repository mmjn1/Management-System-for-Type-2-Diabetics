from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission, Group
from djoser.serializers import TokenCreateSerializer as DjoserTokenCreateSerializer

User = get_user_model()


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
        print('called me')
        ret = super().to_representation(instance)
        user = self.context['request'].user
        ret['first_name'] = user.first_name
        ret['last_name'] = user.last_name
        ret['type_of_user'] = getattr(user, 'type_of_user', 'default_value')  # Safely get the attribute
        print(ret)
        return ret