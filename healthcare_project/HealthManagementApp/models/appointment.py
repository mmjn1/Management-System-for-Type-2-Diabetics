from django.utils import timezone
from django.db import models
from HealthManagementApp.models.users import Patient
from HealthManagementApp.models.users import Doctor

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments', default=1)
    doctor = models.ForeignKey(Doctor, related_name='appointments', on_delete=models.CASCADE, default=1)
    appointment_date = models.DateField()
    appointment_time = models.TimeField(default=timezone.now)
    reason_for_visit = models.TextField(blank=True, null=True)
    accepted = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.reason_for_visit
    
    
    
