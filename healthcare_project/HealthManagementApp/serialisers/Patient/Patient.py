from rest_framework import serializers
from HealthManagementApp.models.users import Patient, Doctor
from HealthManagementApp.serialisers.serializers import UserSerializersData


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class doctorDetailsSerializer(serializers.ModelSerializer):
    user = UserSerializersData()

    class Meta:
        model = Doctor
        fields = '__all__'


class DoctorNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ('full_name',)

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

class PatientSerializerDetails(serializers.ModelSerializer):
    primary_doctor = DoctorNameSerializer(source='doctors', many=True)

    class Meta:
        model = Patient
        fields = ('user', 'type_of_diabetes', 'date_of_diagnosis', 'blood_sugar_level', 'target_blood_sugar_level', 'primary_doctor', 'current_diabetes_medication', 'dietary_habits', 'physical_activity_level', 'smoking_habits', 'alcohol_consumption', 'medical_history', 'family_medical_history', 'medication_adherence')
