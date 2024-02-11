from HealthManagementApp.models import (
    SupportInquiry
)

from HealthManagementApp.models.users import Doctor, Patient
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission, Group

User = get_user_model()

class loginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class SupportInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportInquiry
        fields = ['name', 'email', 'subject', 'message', 'submitted_at']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"

