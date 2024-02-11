from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin

from .models import Patient, Doctor, Prescription, Appointment, SupportInquiry, CustomUser
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Custom Fields'), {'fields': ('role', 'patient', 'doctor')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active', 'role'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'role')
    search_fields = ('email', 'first_name', 'last_name', 'role')
    ordering = ('email',)



    
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
    list_display = ('user', 'speciality', 'years_of_experience', 'medical_license_number')
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['speciality', 'years_of_experience']

class PatientAdminForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'

class PatientAdmin(admin.ModelAdmin):
    fieldsets = [
        ('User Information', {'fields': ['user']}),
        ('Diabetes Information', {'fields': ['type_of_diabetes', 'date_of_diagnosis',
                                             'blood_sugar_level', 'target_blood_sugar_level']}),
        ('Lifestyle', {'fields': ['dietary_habits', 'physical_activity_level',
                                  'smoking_habits', 'alcohol_consumption']}),
        ('Medical Details', {'fields': ['current_diabetes_medication', 'medical_history'],
                             'classes': ['collapse']}),
    ]

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Prescription)
admin.site.register(Appointment)
admin.site.register(Doctor, DoctorAdmin)
