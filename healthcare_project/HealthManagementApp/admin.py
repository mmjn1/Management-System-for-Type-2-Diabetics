from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin

from .models import *
from django.utils.translation import gettext_lazy as _
from .models.prescription import *
from .models.users import *
from .models.doctor_availability import *
from .models.patient_appointment import *
from .models.doctor_appointment import *


from django.contrib import admin


class DrugsInline(admin.TabularInline):
    model = Prescription.Drug.through
    extra = 1

class SymptomsInline(admin.TabularInline):
    model = Prescription.Symptoms.through
    extra = 1

class TestsInline(admin.TabularInline):
    model = Prescription.Tests.through
    extra = 1

class VitalsInline(admin.TabularInline):
    model = Prescription.Vitals.through
    extra = 1

class DiagnosesInline(admin.TabularInline):
    model = Prescription.Diagnoses.through
    extra = 1

class HistoriesInline(admin.TabularInline):
    model = Prescription.Histories.through
    extra = 1

class AdvicesInline(admin.TabularInline):
    model = Prescription.Advices.through
    extra = 1

class FollowUpsInline(admin.TabularInline):
    model = Prescription.FollowUps.through
    extra = 1

@admin.register(Salt)
class SaltAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'salt')
    list_filter = ('salt',)
    search_fields = ('name', 'salt__name')

@admin.register(Drugs)
class DrugsAdmin(admin.ModelAdmin):
    list_display = ('Medical_name', 'dosage', 'frequency', 'Time_of_day', 'duration')
    list_filter = ('Medical_name', 'frequency', 'Time_of_day')
    search_fields = ('Medical_name__name', 'dosage')

@admin.register(Symptoms)
class SymptomsAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Tests)
class TestsAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Vitals)
class VitalsAdmin(admin.ModelAdmin):
    list_display = ('name', 'reading', 'date')

@admin.register(Diagnoses)
class DiagnosesAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Histories)
class HistoriesAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Advices)
class AdvicesAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(FollowUps)
class FollowUpsAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('patient', 'prescribing_doctor', 'start_date', 'end_date', 'prescription_approved')
    list_filter = ('prescribing_doctor', 'prescription_approved', 'start_date')
    search_fields = ('patient__user__first_name', 'patient__user__last_name', 'prescribing_doctor__user__first_name', 'prescribing_doctor__user__last_name')
    inlines = [
        DrugsInline, SymptomsInline, TestsInline, VitalsInline, DiagnosesInline, HistoriesInline, AdvicesInline, FollowUpsInline
    ]
    readonly_fields = ('updated_at',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            # Only set the prescribing_doctor on the initial save.
            obj.prescribing_doctor = request.user
        super().save_model(request, obj, form, change)


class FieldResponseInline(admin.TabularInline):
    model = FieldResponse
    extra = 0  
    fields = ('field', 'value')
    readonly_fields = ('field', 'value')  

@admin.register(FormResponse)
class FormResponseAdmin(admin.ModelAdmin):
    list_display = ('form', 'doctor', 'patient', 'created_at')
    list_filter = ('form', 'doctor', 'patient', 'created_at')
    search_fields = ('doctor__user__first_name', 'doctor__user__last_name', 'patient__user__first_name', 'patient__user__last_name')
    inlines = [FieldResponseInline]
    readonly_fields = ('form', 'doctor', 'patient', 'created_at')  

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(FieldResponse)
class FieldResponseAdmin(admin.ModelAdmin):
    list_display = ('form_response', 'field', 'value')
    list_filter = ('form_response', 'field')
    search_fields = ('value',)

    def has_add_permission(self, request, obj=None):
        return False


class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'role')
    ordering = ('email',)  

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'role')}),  
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    
@admin.register(SupportInquiry)
class SupportInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'message', 'submitted_at') 
    search_fields = ('name', 'email')

class DoctorAdminForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = '__all__'

class DoctorAdmin(admin.ModelAdmin):
    form = DoctorAdminForm
    list_display = ('user', 'speciality', 'years_of_experience', 'medical_license', 'year_of_issue', 
                    'diabetes_management_experience', 'treatment_approach', 'contact_hours', 'tel_number', 'emergency_consultations')
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['speciality', 'years_of_experience']

class MedicalLicenseAdminForm(forms.ModelForm):
    class Meta:
        model = MedicalLicense
        fields = '__all__'

class MedicalLicenseAdmin(admin.ModelAdmin):
    form = MedicalLicenseAdminForm
    list_display = (
        'license_number', 
        'doctor_initials', 
        'location', 
        'gmc_registration_date', 
        'last_review_date',
        'expiry_date', 
        'is_valid', 
    )
    search_fields = [
        'license_number', 
        'location', 
        'doctor_initials',
    ]
    list_filter = [
        'location', 
        'is_valid', 
        'gmc_registration_date', 
        'expiry_date', 
        'last_review_date'  
    ]

class PatientAdminForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'

class PatientAdmin(admin.ModelAdmin):
    form = PatientAdminForm
    list_display = ('user', 'get_doctors', 'type_of_diabetes', 'date_of_diagnosis', 'blood_sugar_level', 'target_blood_sugar_level',
                    'current_diabetes_medication', 'dietary_habits', 'physical_activity_level', 'family_medical_history', 'medical_history', 
                    'medication_adherence', 'smoking_habits','alcohol_consumption')
    def get_doctors(self, obj):
        return ", ".join([doctor.user.get_full_name() for doctor in obj.doctors.all()])
    get_doctors.short_description = 'Doctors'

@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ('name', 'doctor', 'patient')
    search_fields = ('name', 'doctor__user__first_name', 'doctor__user__last_name', 'patient__user__first_name', 'patient__user__last_name')
    list_filter = ('doctor', 'patient')

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'form')
    search_fields = ('name', 'form__name')
    list_filter = ('form',)

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('label', 'field_type', 'section')
    search_fields = ('label', 'section__name')
    list_filter = ('field_type', 'section')

@admin.register(FieldChoice)
class FieldChoiceAdmin(admin.ModelAdmin):
    list_display = ('choice_text', 'field')
    search_fields = ('choice_text', 'field__label')
    list_filter = ('field',)


class UserMealEntryAdmin(admin.ModelAdmin):
    list_display = ('user_input', 'ai_advice', 'created_at')  
    search_fields = ('user_input', 'ai_advice')  
    date_hierarchy = 'created_at'  
    ordering = ('-created_at',)  


class PatientAppointmentAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'appointment_date', 'time_slot', 'appointment_type', 'reason_for_appointment')
    search_fields = ('doctor__name', 'patient__name', 'appointment_type', 'reason_for_appointment')
    date_hierarchy = 'appointment_date'
    ordering = ('appointment_date', 'time_slot')
    fieldsets = (
        ('Appointment Information', {
            'fields': ('doctor', 'patient', 'appointment_date', 'time_slot', 'appointment_type')
        }),
        ('Additional Details', {
            'fields': ('reason_for_appointment',),
            'description': 'Reason for the appointment and additional notes.'
        }),
    )

class WeeklyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'day_of_week', 'is_working')
    list_filter = ('doctor', 'day_of_week', 'is_working')
    search_fields = ('doctor__name', 'day_of_week')

class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'mode')
    list_filter = ('mode',)
    search_fields = ('name',)

class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('weekly_availability', 'start_time', 'end_time', 'location', 'is_available')
    list_filter = ('weekly_availability__doctor', 'location', 'is_available')
    search_fields = ('weekly_availability__doctor__name', 'location__name')


admin.site.register(WeeklyAvailability, WeeklyAvailabilityAdmin)
admin.site.register(location, LocationAdmin)
admin.site.register(TimeSlot, TimeSlotAdmin)

admin.site.register(UserMealEntry, UserMealEntryAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(PatientAppointment, PatientAppointmentAdmin)
admin.site.register(Doctor, DoctorAdmin)
admin.site.register(MedicalLicense, MedicalLicenseAdmin)

