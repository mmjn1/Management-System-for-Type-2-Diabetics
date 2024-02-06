from HealthManagementApp.models import (
    Prescription, SupportInquiry
)
from rest_framework import serializers


"""
    PrescriptionSerializer represents the form that a patient fills out 
    when requesting a refill for a prescription.
"""
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['patient', 'prescribing_doctor', 'drug_name', 'dosage_info', 'frequency', 'reason_for_medication', 'notes', 'intake_instructions', 'start_date', 'end_date', 'refill_count', 'last_refilled_date', 'refill_request_pending', 'refill_requested']


class SupportInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportInquiry
        fields = ['name', 'email', 'subject', 'message', 'submitted_at']