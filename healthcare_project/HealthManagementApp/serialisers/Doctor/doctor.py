from rest_framework import serializers
from HealthManagementApp.models.users import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


class DoctorSerializerDetail(serializers.ModelSerializer):
    license_number = serializers.CharField(source='medical_license.license_number', read_only=True)
    id = serializers.CharField(source='user.id')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')



    class Meta:
        model = Doctor
        fields = ['user', 'first_name', 'last_name', 'email', 'id', 'speciality', 'years_of_experience', 'year_of_issue', 'diabetes_management_experience', 'treatment_approach', 'contact_hours', 'tel_number', 'emergency_consultations', 'license_number']
