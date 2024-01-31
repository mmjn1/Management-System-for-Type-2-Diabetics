from django.contrib import admin
from .models import Patient, Doctor, Prescription, Appointment

# @admin.register(Patient)
# class PatientAdmin(admin.ModelAdmin):
#     list_display = ('name', 'type_of_diabetes', 'date_of_diagnosis', 'current_diabetes_medication', 'dietary_habits')

admin.site.register(Patient)
admin.site.register(Doctor)
admin.site.register(Prescription)
admin.site.register(Appointment)