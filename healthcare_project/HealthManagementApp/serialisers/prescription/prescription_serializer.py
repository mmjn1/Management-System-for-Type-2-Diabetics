from HealthManagementApp.models import (
    Prescription
)
from healthcare_project.HealthManagementApp import serialisers

class PrescriptionSerializer(serialisers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"