from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from HealthManagementApp.models.roles import Role
from HealthManagementApp.models.medical_license import MedicalLicense
import datetime

"""
create_user is for creating regular users within the application
and to include any additional fields
The function will do some validation and then create and save the user 
to the database
It creates a superuser with administrative privileges
"""

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, middle_name, last_name, password):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()

        return user
   
    def create_superuser(self, first_name, last_name, email, middle_name=None, password=None):
        user = self.create_user (
            email=email,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            password=password,
        )

        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save()

        return user

TYPE = [
    ('Doctor', 'Doctor'),
    ('Patient', 'Patient'),
]
class CustomUser(AbstractUser, PermissionsMixin):
    first_name = models.CharField(max_length=100, blank=False, null=False, )
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=False, null=False)
    email = models.EmailField(unique=True, max_length=100)
    type = models.CharField(max_length=50, choices=TYPE, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    patient = models.OneToOneField('HealthManagementApp.Patient', on_delete=models.CASCADE, blank=True, null=True, related_name='patient_user')
    doctor = models.OneToOneField('HealthManagementApp.Doctor', on_delete=models.CASCADE, blank=True, null=True, related_name='doctor_user')

    class Role(models.TextChoices):
        PATIENT = 'patient','Patient'
        DOCTOR = 'doctor','Doctor'
        ADMIN = 'admin','Admin'

    # Identifying the user role based on this (by default it will be patient if no role assigned)
    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.PATIENT
    )
    username = None
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()  


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="doctor_user")
    patients = models.ManyToManyField('HealthManagementApp.Patient', related_name='treated_by_doctors', null=True,
                                      blank=True)
    speciality = models.CharField(max_length=50, blank=True, null=True)
    years_of_experience = models.CharField(max_length=50, blank=True, null=True)
    medical_license = models.OneToOneField(MedicalLicense, on_delete=models.CASCADE, null=True, blank=True, related_name="licensed_doctor")
    year_of_issue = models.CharField(max_length=50, blank=True, null=True)
    diabetes_management_experience = models.TextField(blank=True, null=True)
    treatment_approach = models.TextField(blank=True, null=True)    
    contact_hours = models.CharField(max_length=50, blank=True, null=True)
    tel_number = models.CharField(max_length=50, blank=True, null=True)
    emergency_consultations = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'Dr. {self.user.first_name} {self.user.last_name}'


class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="patient_user")
    doctors = models.ManyToManyField('Doctor', related_name='patients_treated')
    current_diabetes_medication = models.TextField(blank=True, null=True)
    dietary_habits = models.TextField(blank=True, null=True)
    type_of_diabetes = models.CharField(max_length=50, blank=True, null=True)
    date_of_diagnosis = models.DateField(blank=True, null=True)
    blood_sugar_level = models.IntegerField(blank=True, null=True)
    target_blood_sugar_level = models.IntegerField(blank=True, null=True)
    family_medical_history = models.TextField(blank=True, null=True)    
    medical_history = models.TextField(blank=True, null=True) 
    medication_adherence = models.TextField(blank=True, null=True)
    physical_activity_level = models.TextField(blank=True, null=True)
    smoking_habits = models.CharField(max_length=50, blank=True, null=True)
    alcohol_consumption = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
    