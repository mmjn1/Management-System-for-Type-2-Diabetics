from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from HealthManagementApp.models.roles import Role

"""
create_user is for creating regular users within the application
and to include any additional fields
The function will do some validation and then create and save the user 
to the database
It creates a superuser with administrative privileges
"""

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, first_name, last_name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)

class CustomUser(AbstractUser, PermissionsMixin):
    first_name= models.CharField(max_length=100, blank=False, null=False,)
    last_name = models.CharField(max_length=100, blank=False, null=False,)
    email = models.EmailField(unique=True, max_length=100)
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
    REQUIRED_FIELDS = []


    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.first_name + " " + self.last_name


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, related_name="doctor_user")
    speciality = models.CharField(max_length=50, blank=True, null=True)
    years_of_experience = models.CharField(max_length=50, blank=True, null=True)
    medical_license_number = models.CharField(max_length=50, blank=True, null=True)
    country_of_issue = models.CharField(max_length=50, blank=True, null=True)
    year_of_issue = models.CharField(max_length=50, blank=True, null=True)

    diabetes_management_experience = models.TextField(blank=True, null=True)
    treatement_approach = models.TextField(blank=True, null=True)    
    contact_hours = models.CharField(max_length=50, blank=True, null=True)
    tel_number = models.CharField(max_length=50, blank=True, null=True)
    emergency_consultations = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
            # Make sure the field names here match exactly with the ones defined in the model
        return f'Doctor {self.user.get_full_name()}: Specialty - {self.speciality}, Years of Experience - {self.years_of_experience}'

    


class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, related_name="patient_user")
    doctors = models.ManyToManyField('Doctor', related_name='patients_treated')
    current_diabetes_medication = models.TextField(blank=True, null=True)
    dietary_habits = models.CharField(max_length=100, blank=True, null=True)
     
    type_of_diabetes = models.CharField(max_length=50, blank=True, null=True)
    date_of_diagnosis = models.DateField(blank=True, null=True)
    blood_sugar_level = models.IntegerField(blank=True, null=True)
    target_blood_sugar_level = models.IntegerField(blank=True, null=True)    
    medical_history = models.TextField(blank=True, null=True)    

    physical_activity_level = models.CharField(max_length=50, blank=True, null=True)
    smoking_habits = models.CharField(max_length=50, blank=True, null=True)
    alcohol_consumption = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
            # Combined the multiple __str__ methods into one
        return (f'Patient {self.user.get_full_name()}: Type of Diabetes - {self.type_of_diabetes}, '
                f'Date of Diagnosis - {self.date_of_diagnosis}, Physical Activity Level - '
                f'{self.physical_activity_level}, Smoking Habits - {self.smoking_habits}, '
                f'Alcohol Consumption - {self.alcohol_consumption}, Dietary Habits - {self.dietary_habits}')
