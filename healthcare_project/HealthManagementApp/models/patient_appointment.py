from django.db import models
from HealthManagementApp.models.users import Patient
from HealthManagementApp.models.users import Doctor
from HealthManagementApp.models.doctor_availability import TimeSlot


class PatientAppointment(models.Model):
    """
    Represents an appointment scheduled for a patient with a doctor. It includes all details
    necessary for the appointment such as the patient, doctor, date, time slot, and the reason
    for the appointment.

    Attributes:
        patient (ForeignKey): Reference to the Patient model, nullable if the appointment is not yet assigned to a patient.
        doctor (ForeignKey): Reference to the Doctor model.
        appointment_date (DateField): The date on which the appointment is scheduled.
        time_slot (ForeignKey): Reference to the TimeSlot model, nullable if the time slot is not yet assigned.
        reason_for_appointment (TextField): The reason or purpose of the appointment.
        meeting_link (URLField): A URL for a virtual meeting.
        FollowupNote (TextField): Optional field for any follow-up notes post-appointment.
        appointment_type (CharField): The type of appointment, categorized by constants like INITIAL_CONSULTATION, FOLLOW_UP, etc.

    Meta:
        unique_together: Ensures that no two appointments have the same doctor, time slot, and date combination to avoid double bookings.
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, null=True)
    reason_for_appointment = models.TextField()
    meeting_link = models.URLField(default='https://gmail.com/')
    FollowupNote = models.TextField(null=True, blank=True)

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

    class Meta:
        unique_together = ('doctor', 'time_slot', 'appointment_date')

    def __str__(self):
        return f"{self.doctor} - {self.appointment_date}"
