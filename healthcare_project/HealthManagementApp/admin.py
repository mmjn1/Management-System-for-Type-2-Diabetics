from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin

from .models import(Patient, Doctor, 
                    Prescription, 
                    PatientAppointment, 
                    SupportInquiry, 
                    CustomUser, 
                    DoctorAppointment, 
                    MedicalLicense,
                    WeeklyAvailability,
                    TimeSlot, Form, Section, Field, FieldChoice,
                    FieldResponse, FormResponse, UserMealEntry
                    )
from django.utils.translation import gettext_lazy as _

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

class TimeSlotInline(admin.TabularInline):
    model = TimeSlot
    extra = 1  
    fields = ['start_time', 'end_time', 'location', 'is_available']

@admin.register(WeeklyAvailability)
class WeeklyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'day_of_week', 'is_working')  
    list_filter = ('doctor', 'day_of_week', 'is_working')  
    search_fields = ('doctor__name', 'day_of_week')  
    inlines = [TimeSlotInline]  

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('get_day_of_week', 'start_time', 'end_time', 'location', 'is_available')
    list_filter = ('weekly_availability__day_of_week', 'location', 'is_available')
    search_fields = ('weekly_availability__doctor__name', 'location')

    def get_day_of_week(self, obj):
        return obj.weekly_availability.day_of_week
    get_day_of_week.admin_order_field = 'weekly_availability__day_of_week'  
    get_day_of_week.short_description = 'Day of the Week'  


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
    list_display = ('user_input', 'patient', 'ai_advice', 'created_at')  # Fields to display in the list view
    search_fields = ('user_input', 'patient__name', 'ai_advice')  # Fields to search in the admin
    list_filter = ('created_at', 'patient')  # Filters to apply in the sidebar
    date_hierarchy = 'created_at'  # Navigate through dates
    ordering = ('-created_at',)  # Order by created_at descending by default

    # If you want to customize the form for adding/editing
    # fields = ('user_input', 'patient', 'ai_advice')

admin.site.register(UserMealEntry, UserMealEntryAdmin)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Prescription)
admin.site.register(PatientAppointment, PatientAppointmentAdmin)
admin.site.register(Doctor, DoctorAdmin)
admin.site.register(MedicalLicense, MedicalLicenseAdmin)

