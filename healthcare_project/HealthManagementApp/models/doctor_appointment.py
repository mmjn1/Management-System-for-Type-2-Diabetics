from django.utils import timezone
from django.db import models
from HealthManagementApp.models.users import Patient
from HealthManagementApp.models.users import Doctor

class DoctorAppointment(models.Model):
    patient = models.ForeignKey(Patient, related_name='doctor_appointments', on_delete=models.CASCADE)
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reason_for_visit = models.TextField()

    INITIAL_CONSULTATION = 'Initial Consultation'
    FOLLOW_UP = 'Follow-up'
    EMERGENCY = 'Emergency'
    ROUTINE_CHECK = 'Routine Check'
    TELEHEALTH = 'Telehealth'
    APPOINTMENT_TYPE_CHOICES = [
        (INITIAL_CONSULTATION, 'Initial Consultation'),
        (FOLLOW_UP, 'Follow-up'),
        (EMERGENCY, 'Emergency'),
        (ROUTINE_CHECK, 'Routine Check'),
        (TELEHEALTH, 'Telehealth')
    ]
    appointment_type = models.CharField(
        max_length=20,
        choices=APPOINTMENT_TYPE_CHOICES,
        default=INITIAL_CONSULTATION,
    )

    
