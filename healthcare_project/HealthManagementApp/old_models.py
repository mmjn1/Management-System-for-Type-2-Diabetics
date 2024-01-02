from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models

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
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=100)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True)
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)


    objects = CustomUserManager()
       
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','gender','phone_number', 'date_of_birth']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    years_of_experience = models.IntegerField()
    patients = models.ManyToManyField('Patient', related_name='treated_by_doctors')

    def __str__(self):
        return self.user.name

class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    doctors = models.ManyToManyField('Doctor', related_name='patients_treated')
    medical_conditions = models.TextField(blank=True)
    prescription = models.CharField(max_length=100)
    medical_history = models.TextField(blank=True)
    weight = models.FloatField()
    height = models.FloatField()

    def __str__(self):
        return self.user.name

