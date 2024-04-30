from celery import shared_task
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives
from django.conf import settings  # Import settings for email configuration
from datetime import date, timedelta

from HealthManagementApp.models import PatientAppointment


@shared_task(bind=True)
def automated(self):
    """
    This Celery task sends automated reminder emails to both patients and doctors for upcoming appointments.
    It retrieves all appointments from today onwards and sends a detailed email reminder to each patient and their respective doctor.
    
    The email includes:
    - Appointment date and time
    - Doctor's name for the patient
    - Patient's name for the doctor
    - Reason for the appointment
    - Meeting link for virtual appointments

    The task counts and returns the total number of emails sent, which is useful for monitoring and logging purposes.

    Returns:
        str: A message indicating the total number of reminder emails sent.
    """
    today = date.today()
    upcoming_bookings = PatientAppointment.objects.filter(appointment_date__gte=today)

    num_emails_sent = 0
    for booking in upcoming_bookings:
        
        # Separate email content for patient and doctor
        patient_subject = f"Reminder: Upcoming Appointment with Dr. {booking.doctor.user.first_name} {booking.doctor.user.last_name}"
        doctor_subject = f"Upcoming Appointment with {booking.patient.user.first_name} {booking.patient.user.last_name}"

        patient_body = f"""
            Dear {booking.patient.user.first_name} {booking.patient.user.last_name},

            This is a friendly reminder about your upcoming appointment with Dr. {booking.doctor.user.first_name} {booking.doctor.user.last_name} on 
            {booking.appointment_date} at {booking.time_slot.start_time}.

            Appointment details:
              - Doctor: Dr. {booking.doctor.user.first_name} {booking.doctor.user.last_name}
              - Date: {booking.appointment_date}
              - Time: {booking.time_slot.start_time} - {booking.time_slot.end_time}
              - Reason for appointment: {booking.reason_for_appointment}

            Meeting link: {booking.meeting_link.start_url}

            Please don't hesitate to contact us if you have any questions or need to reschedule.

            Sincerely,

            The GlucoCare Team
            """

        doctor_body = f"""
            Dear Dr. {booking.doctor.user.first_name} {booking.doctor.user.last_name},

            This is a reminder about your upcoming appointment with {booking.patient.user.first_name} {booking.patient.user.last_name} on 
            {booking.appointment_date} at {booking.time_slot.start_time}.

            Appointment details:
              - Patient: {booking.patient.user.first_name} {booking.patient.user.last_name}
              - Date: {booking.appointment_date}
              - Time: {booking.time_slot.start_time} - {booking.time_slot.end_time}
              - Reason for appointment: {booking.reason_for_appointment}

            Meeting link: {booking.meeting_link.start_url}

            Sincerely,

            The GlucoCare Team
            """

        # Send email to patient
        patient_email = EmailMultiAlternatives(
            subject=patient_subject,
            body=patient_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[booking.patient.user.email],
        )
        patient_email.send()

        # Send email to doctor
        doctor_email = EmailMultiAlternatives(
            subject=doctor_subject,
            body=doctor_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[booking.doctor.user.email],
        )
        doctor_email.send()

        num_emails_sent += 2  # Increment by 2 as two emails are sent

    return f"Reminder emails sent for {num_emails_sent} bookings"