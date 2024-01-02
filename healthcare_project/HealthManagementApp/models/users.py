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
    def create_user(self, name, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(email=email,name=name)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, name,email, password=None):
        user = self.create_user(
            email=email,
            name=name,
            password=password,
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user 

class CustomUser(AbstractUser, PermissionsMixin):
    name = models.CharField(max_length=100, blank=False, null=False,)
    email = models.EmailField(unique=True, max_length=100)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    patient = models.OneToOneField('HealthManagementApp.Patient', on_delete=models.CASCADE, blank=True, null=True, related_name='patient_user')
    doctor = models.OneToOneField('HealthManagementApp.Doctor', on_delete=models.CASCADE, blank=True, null=True, related_name='doctor_user')


    class Role(models.TextChoices):
        PATIENT = 'patient'
        DOCTOR = 'doctor'
        ADMIN = 'admin'

    # Identifying the user role based on this (by default it will be patient if no role assigned)
    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.PATIENT,
    ),

    username = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']


    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, related_name="doctor_user")
    patients = models.ManyToManyField('HealthManagementApp.Patient', related_name='treated_by_doctors')

    speciality = models.CharField(max_length=50, blank=True, null=True)
    years_of_experience = models.CharField(max_length=50, blank=True, null=True)
    medical_license_number = models.CharField(max_length=50, blank=True, null=True)
    country_of_issue = models.CharField(max_length=50, blank=True, null=True)
    year_of_issue = models.CharField(max_length=50, blank=True, null=True)

    diabetes_management_experience = models.CharField(max_length=50, blank=True, null=True)
    treatement_approach = models.CharField(max_length=50, blank=True, null=True)
    contact_hours = models.CharField(max_length=50, blank=True, null=True)
    communication_method_for_patient = models.CharField(max_length=50, blank=True, null=True)
    tel_number = models.CharField(max_length=50, blank=True, null=True)
    emergency_consultations = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'Doctor {self.user.name}: Specialty - {self.specialty}, Years of Experience - {self.years_of_experience}'

    


class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, related_name="patient_user")
    doctors = models.ManyToManyField('Doctor', related_name='patients_treated')
    current_diabetes_medication = models.TextField(blank=True, null=True)
    dietary_habits = models.CharField(max_length=100, blank=True, null=True)
     
    type_of_diabetes = models.CharField(max_length=50, blank=True, null=True)
    date_of_diagnosis = models.DateField(blank=True, null=True)
    blood_sugar_level = models.CharField(max_length=50, blank=True, null=True)
    target_blood_sugar_level = models.CharField(max_length=50, blank=True, null=True)
    medical_history = models.CharField(max_length=50, blank=True, null=True)

    physical_activity_level = models.CharField(max_length=50, blank=True, null=True)
    smoking_habits = models.CharField(max_length=50, blank=True, null=True)
    alcohol_consumption = models.CharField(max_length=50, blank=True, null=True)

    date_last_HbA1c_test_and_result = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'Patient {self.user.name}: Type of Diabetes - {self.type_of_diabetes}, Date of Diagnosis - {self.date_of_diagnosis}'

    def __str__(self):
        return f'Patient {self.user.name}: Physical Activity Level - {self.physical_activity_level}, Smoking Habits - {self.smoking_habits}, Alcohol Consumption - {self.alcohol_consumption}, Dietary Habits - {self.dietary_habits}'

