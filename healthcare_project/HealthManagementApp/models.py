from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models

"""
create_user is for creating regular users within the application
and to include any additional fields
The function will do some validation and then create and save the user 
to the database

It creates a superuser with administrative privileges
"""

class CustomUserManager(BaseUserManager):   
    def create_user(self, first_name, last_name, email, password=None):
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
        user.save(using=self._db)

        return user

    def create_superuser(self, first_name, last_name, email, password=None):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
        )

        user_is_staff = True
        user_is_superuser = True
        user.save(using=self._db)

        return self.create_user(email, password)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
       
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
        
    def __str__(self):
        return self.email


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    patients = models.ManyToManyField('Patient', related_name='treated_by_doctors')

class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    doctors = models.ManyToManyField('Doctor', related_name='patients_treated')
    medical_conditions = models.TextField(blank=True)
    prescription = models.CharField(max_length=100)
    medical_history = models.TextField(blank=True)
    height = models.FloatField()
