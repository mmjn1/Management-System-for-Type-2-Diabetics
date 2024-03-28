from django.db import models

class MedicalLicense(models.Model):
    license_number = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=50)
    doctor_initials = models.CharField(max_length=50)
    is_valid = models.BooleanField(default=True)
    gmc_registration_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    complaints_history = models.TextField(blank=True, null=True)
    last_review_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.license_number} - {self.location}"
    
