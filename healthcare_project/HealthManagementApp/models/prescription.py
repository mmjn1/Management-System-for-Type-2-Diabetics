from datetime import timezone
from django.db import models
from HealthManagementApp.models.users import Patient
from HealthManagementApp.models.users import Doctor

class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    prescribing_doctor = models.ForeignKey(Doctor, related_name='prescriptions', on_delete=models.CASCADE)
    drug_name = models.CharField(max_length=100)
    dosage_info = models.CharField(max_length=100)
    frequency = models.IntegerField() # number of times per day
    reason_for_medication = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    intake_instructions = models.CharField(blank=True, null=True, max_length=100)

    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True)

    refill_count = models.IntegerField(default=0)
    last_refilled_date = models.DateField(null=True, blank=True)
    refill_request_pending = models.BooleanField(default=False)
    prescription_approved = models.BooleanField(default=False)

    refill_requested = models.BooleanField(default=False)



    def __str__(self):
        return self.drug_name
    
    def request_refill(self):
        """
        Method to request a refill.
        This method sets refill_request_pending to True.
        """
        self.refill_request_pending = True
        self.save()

    def approve_refill(self):
        """
        Method to approve a refill request.
        This method increments refill_count, updates last_refilled_date,
        and resets refill_request_pending to False.
        """
        self.refill_count += 1
        self.last_refilled_date = timezone.now()
        self.refill_request_pending = False
        self.save()