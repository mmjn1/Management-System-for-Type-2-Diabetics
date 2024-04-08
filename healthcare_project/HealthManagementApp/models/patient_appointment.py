from django.utils import timezone
from django.db import models
from HealthManagementApp.models.users import Patient
from HealthManagementApp.models.users import Doctor
from HealthManagementApp.models.doctor_availability import TimeSlot  


class PatientAppointment(models.Model):
    patient = models.ForeignKey(Patient, related_name='appointments', on_delete=models.CASCADE, null=True)
    doctor = models.ForeignKey(Doctor, related_name='patient_appointments', on_delete=models.CASCADE)
    appointment_date = models.DateField()
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, null=True)  
    reason_for_appointment = models.TextField()

    INITIAL_CONSULTATION = 'Initial Consultation'
    FOLLOW_UP = 'Follow-up'
    EMERGENCY = 'Emergency'
    ROUTINE_CHECK = 'Routine Check'
    APPOINTMENT_TYPE_CHOICES = [
        (INITIAL_CONSULTATION, 'Initial Consultation'),
        (FOLLOW_UP, 'Follow-up'),
        (EMERGENCY, 'Emergency'),
        (ROUTINE_CHECK, 'Routine Check'),
    ]
    appointment_type = models.CharField(
        max_length=20,
        choices=APPOINTMENT_TYPE_CHOICES,
        default=INITIAL_CONSULTATION,
    )

    def __str__(self):
            return f"{self.doctor} - {self.appointment_date}"
    
    
    
