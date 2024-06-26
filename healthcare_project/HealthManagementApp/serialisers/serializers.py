from HealthManagementApp.models import (
    SupportInquiry
)
from HealthManagementApp.models.users import Doctor, Patient
from HealthManagementApp.models.doctor_appointment import DoctorAppointment
from HealthManagementApp.models.patient_appointment import PatientAppointment
from HealthManagementApp.models.doctor_availability import WeeklyAvailability, TimeSlot
from HealthManagementApp.models.customform import Form, Section, Field, FieldChoice, FormResponse, FieldResponse
from HealthManagementApp.models.foodentry import UserMealEntry
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q
from HealthManagementApp.models.users import CustomUser
from HealthManagementApp.models.prescription import *
from HealthManagementApp.models import *

"""
The serializers are used to convert complex data types like 
querysets and model instances to native Python datatypes that can then be easily rendered into JSON, XML, or other 
content types. Serializers also provide deserialization, allowing parsed data to be converted back into complex types, 
after first validating the incoming data.

The serializers in this module handle data for various models including User, Doctor, Patient, Appointments, 
Prescriptions, and Weekly Availabilities. They ensure that data sent to and from the front-end is in the correct 
format and adheres to specified data structures. This is crucial for maintaining data integrity and for the 
application's front-end to function correctly.

Each serializer is tailored to a specific model, with some serializers handling related models through nested 
serialization. This allows for efficient data handling and manipulation, especially useful in scenarios where 
related data is required in a single request/response cycle.

"""


User = get_user_model()

class loginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class SupportInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportInquiry
        fields = ['name', 'email', 'subject', 'message', 'submitted_at']

class DoctorSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    # id = serializers.CharField(source='user.id')
    license_number = serializers.CharField(source='medical_license.license_number', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'first_name', 'last_name', 'email', 'speciality', 'years_of_experience', 'license_number', 'diabetes_management_experience', 'contact_hours', 'emergency_consultations', 'tel_number', 'treatment_approach']

    def update(self, instance, validated_data):
        # Handle the user data
        user_data = {
            'first_name': validated_data.pop('first_name', instance.user.first_name),
            'last_name': validated_data.pop('last_name', instance.user.last_name),
            'email': validated_data.pop('email', instance.user.email)
        }
        # Update the user instance
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update the doctor instance
        return super(DoctorSerializer, self).update(instance, validated_data)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'middle_name', 'last_name', 'email', 'type', 'is_active', 'is_staff']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def update(self, instance, validated_data):
        # Update the CustomUser instance
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.middle_name = validated_data.get('middle_name', instance.middle_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.type = validated_data.get('type', instance.type)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.save()
        return instance


class NewPatientSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    #id = serializers.CharField(source='user.id')

    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'email', 'type_of_diabetes', 'date_of_diagnosis', 'blood_sugar_level', 'target_blood_sugar_level', 'current_diabetes_medication', 'dietary_habits', 'physical_activity_level', 'smoking_habits', 'alcohol_consumption', 'medical_history', 'family_medical_history', 'medication_adherence']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        super(NewPatientSerializer, self).update(instance, validated_data)
        
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.email = user_data.get('email', user.email)
            user.save()
        return instance


class loginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class UserSerializersData(serializers.ModelSerializer):

    def get_pic(self, User):
        request = self.context.get('request')
        if User.pic:
            pic = User.pic.url
            return request.build_absolute_uri(pic)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'middle_name', 'last_name', 'type')

class PatientDropdownSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='user.id')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name']

class FieldChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldChoice
        fields = ["id", "choice_text"]


class FieldSerializer(serializers.ModelSerializer):
    choices = FieldChoiceSerializer(many=True)

    class Meta:
        model = Field
        fields = ["id", "label", "field_type", "choices"]


class SectionSearializer(serializers.ModelSerializer):
    form_fields = FieldSerializer(many=True)

    class Meta:
        model = Section
        fields = ["id", "name", "form_fields"]


class FormSerializer(serializers.ModelSerializer):
    sections = SectionSearializer(many=True)

    class Meta:
        model = Form
        fields = ["id", "name", "sections", "doctor", "patient"]

    def create(self, validated_data):
        # extracting sections from validated data
        sections = validated_data.pop("sections", [])
        # save the form data
        form = Form.objects.create(**validated_data)
        # loop through all sections
        for section_data in sections:
            # extract fields from section
            fields = section_data.pop("form_fields", [])
            # save the section data
            section = Section.objects.create(form=form, **section_data)
            # loop through all fields
            for field in fields:
                # extract choices from each field
                choices = field.pop("choices", [])
                # save the field data
                field = Field.objects.create(section=section, **field)
                # loop through all choices and save the choice data
                for choice in choices:
                    FieldChoice.objects.create(field=field, **choice)

        return form

    def update(self, instance, validated_data):
        sections_data = validated_data.pop("sections")

        # get existing sections
        existing_sections = instance.sections.all()
        existing_sections = list(existing_sections)

        # save the form data
        instance.name = validated_data.get("name", instance.name)
        instance.save()

        # loop throught the sections data
        for section_data in sections_data:
            if section_id := section_data.get("id"):
                # Update the existing section
                section = existing_sections.pop(0)
                section.name = section_data.get("name", section.name)
                section.save()
            else:
                # create new section
                section = Section.objects.create(
                    name=section_data.get("name"), form=instance
                )

            # get the form fields
            fields_data = section_data.pop("form_fields", [])

            # get the existing fields
            existing_fields = section.form_fields.all()
            existing_fields = list(existing_fields)

            # loop through the fields data
            for field_data in fields_data:
                if field_id := field_data.get("id", None):
                    # update existing fields
                    field = existing_fields.pop(0)
                    field.label = field_data.get("label", field.label)
                    field.field_type = field_data.get("field_type", field.field_type)
                    field.save()
                else:
                    # create new field
                    field = Field.objects.create(
                        label=field_data.get("label"),
                        field_type=field_data.get("field_type"),
                        section=section,
                    )

                # get the choices data
                choices_data = field_data.get("choices", [])

                # existing choices data
                existing_choices = field.choices.all()
                existing_choices = list(existing_choices)

                # loop through the choices data
                for choice_data in choices_data:
                    if choice_id := choice_data.get("id", None):
                        # update the existing choices
                        choice = existing_choices.pop(0)
                        choice.choice_text = choice_data.get(
                            "choice_text", choice.choice_text
                        )
                        choice.save()
                    else:
                        # create a new choice
                        choice = FieldChoice.objects.create(
                            choice_text=choice_data.get("choice_text"), field=field
                        )
                # delete any existing choices
                for choice in existing_choices:
                    choice.delete()
            # delete any existing fields
            for field in existing_fields:
                field.delete()
        # delete any existing sections
        for section in existing_sections:
            section.delete()

        return instance
    
class FormResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormResponse
        fields = ["id", "form", "doctor", "patient", "created_at"]


class FieldResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldResponse
        fields = ["id", "form_response", "field", "response"]

class UserMealEntrySerializer(serializers.ModelSerializer):
    patient = NewPatientSerializer(read_only=True)
    class Meta:
        model = UserMealEntry
        fields = ['id', 'user_input', 'patient','ai_advice', 'created_at']

    def create(self, validated_data):
        """
        Creates a new UserMealEntry instance.

        This method overrides the default create method to ensure that the UserMealEntry is associated
        with the correct patient. It retrieves the patient from the currently authenticated user's associated
        patient profile, ensuring that the meal entry is correctly linked to the user making the request.

        The `patient_user` attribute is expected to be a direct link from the user model to a patient model,
        representing the patient profile associated with the user. This link is crucial for maintaining
        accurate patient records and ensuring that data is only modified by or visible to the correct patient.

        Args:
        validated_data (dict): The data validated by the serializer, used to create the UserMealEntry.

        Returns:
        UserMealEntry: The newly created UserMealEntry instance.
        """
        patient = self.context['request'].user.patient_user

        validated_data['patient'] = patient # UserMealEntry instance with the specific patient who is linked to the authenticated user making the reques

        return UserMealEntry.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.user_input = validated_data.get('user_input', instance.user_input)
        instance.ai_advice = validated_data.get('ai_advice', instance.ai_advice)
        instance.save()
        return instance


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'


class DrugsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drugs
        fields = '__all__'


class SymptomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptoms
        fields = '__all__'


class TestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tests
        fields = '__all__'



class AdvicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advices
        fields = '__all__'


class FollowUpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUps
        fields = '__all__'


class SaltSerializer(serializers.ModelSerializer):
    medicines = MedicineSerializer(many=True, read_only=True)

    class Meta:
        model = Salt
        fields = '__all__'


class DrugSerializerdetail(serializers.ModelSerializer):
    class Meta:
        model = Drugs
        fields = '__all__'
        depth = 2


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class PrescriptionDetailSerializer(serializers.ModelSerializer):
    Drug = DrugSerializerdetail(many=True)
    patient = NewPatientSerializer()

    class Meta:
        model = Prescription
        fields = '__all__'
        depth = 1


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAppointment
        fields = ['id', 'patient', 'appointment_date', 'start_time', 'end_time', 'reason_for_visit', 'appointment_type']


class TimeSlotSerializer(serializers.ModelSerializer):
    # is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = TimeSlot
        depth = 1
        fields = '__all__'


class PatientAppointmentSerializer(serializers.ModelSerializer):
    time_slot = serializers.PrimaryKeyRelatedField(queryset=TimeSlot.objects.all())

    class Meta:
        model = PatientAppointment
        fields = ['id', 'patient', 'doctor', 'time_slot', 'appointment_type', 'reason_for_appointment',
                  'appointment_date']

    def create(self, validated_data):
        # Custom create method to handle creation of the appointment
        appointment = PatientAppointment.objects.create(**validated_data)
        return appointment


class PatientAppointmentSerializerOther(serializers.ModelSerializer):
    class Meta:
        model = PatientAppointment
        fields = '__all__'


class PatientAppointmentSerializerDepth(serializers.ModelSerializer):
    # meeting_link = serializers.CharField(source='meeting_link.start_url')
    """
    Serializer for deep serialization of PatientAppointment model instances.

    This serializer is designed to provide a comprehensive representation of a PatientAppointment,
    including detailed information about related entities up to two levels deep. It is particularly
    useful in contexts where complete details about the appointment, including associated objects like
    the patient's and doctor's detailed information, are required in a single API response.

    The `depth = 2` setting enables the serializer to automatically include not only the direct
    relationships of PatientAppointment (such as the linked Patient and Doctor) but also the relationships
    of those related objects (e.g., the Doctor's clinic details or the Patient's medical history).

    Attributes:
        Meta:
            model (Model): The main model class that this serializer handles, which is PatientAppointment.
            fields (list of str): Specifies that all fields of the PatientAppointment model should be included in the serialization.
            depth (int): Indicates the levels of related data to include. A depth of 2 means that the serializer
                         includes the main object, its direct relations, and their direct relations.
    """
    class Meta:
        model = PatientAppointment
        depth = 2
        fields = '__all__'


class WeeklyAvailabilitySerializer(serializers.ModelSerializer):
    """
    Serializer for WeeklyAvailability model, handling serialization and deserialization of weekly availability data
    for doctors including their available time slots.

    This serializer extends the ModelSerializer and includes nested serialization for the related TimeSlot instances.
    It provides custom create and update methods to handle the complexities of nested data and ensure data integrity
    when creating or updating a doctor's weekly availability and their specific time slots.

    Attributes:
        time_slots (TimeSlotSerializer): A nested serializer to handle serialization of multiple TimeSlot instances.
    """
    time_slots = TimeSlotSerializer(many=True, required=False)

    class Meta:
        model = WeeklyAvailability
        fields = ['id', 'doctor', 'day_of_week', 'is_working', 'time_slots']

    def create(self, validated_data):
        """
        Custom create method for creating a WeeklyAvailability instance along with associated TimeSlot instances.

        Args:
            validated_data (dict): The validated data from the request.

        Returns:
            WeeklyAvailability: The newly created WeeklyAvailability instance.
        """
        time_slots_data = validated_data.pop('time_slots', [])
        weekly_availability = WeeklyAvailability.objects.create(**validated_data)
        for time_slot_data in time_slots_data:
            TimeSlot.objects.create(weekly_availability=weekly_availability, **time_slot_data)
        return weekly_availability

    def update(self, instance, validated_data):
        """
        Custom update method for updating a WeeklyAvailability instance and its associated TimeSlot instances.

        This method handles the complexity of updating or creating new time slots while removing those that are
        no longer associated with the weekly availability.

        Args:
            instance (WeeklyAvailability): The instance being updated.
            validated_data (dict): The validated data from the request.

        Returns:
            WeeklyAvailability: The updated WeeklyAvailability instance.
        """
        time_slots_data = validated_data.pop('time_slots', [])
        instance.day_of_week = validated_data.get('day_of_week', instance.day_of_week)
        instance.is_working = validated_data.get('is_working', instance.is_working)
        instance.save()

        # Existing time slots keyed by a tuple of their unique fields
        existing_time_slots = {(ts.start_time, ts.end_time, ts.location): ts for ts in instance.time_slots.all()}

        # IDs of time slots that should remain after the update
        updated_time_slot_ids = []

        # Update existing time slots and mark new ones for creation
        for time_slot_data in time_slots_data:
            time_slot_id = time_slot_data.get('id', None)
            time_slot_key = (time_slot_data['start_time'], time_slot_data['end_time'], time_slot_data['location'])

            if time_slot_id:
                # Update existing time slot
                time_slot_instance = existing_time_slots.pop(time_slot_key, None)
                if time_slot_instance:
                    for key, value in time_slot_data.items():
                        setattr(time_slot_instance, key, value)
                    time_slot_instance.save()
                    updated_time_slot_ids.append(time_slot_instance.id)
                else:
                    pass
            else:
                # Create new time slot if no existing slot matches
                if time_slot_key not in existing_time_slots:
                    new_time_slot = TimeSlot.objects.create(weekly_availability=instance, **time_slot_data)
                    updated_time_slot_ids.append(new_time_slot.id)
                else:
                    # If the time slot already exists, update it instead of creating a new one
                    existing_slot = existing_time_slots[time_slot_key]
                    for key, value in time_slot_data.items():
                        setattr(existing_slot, key, value)
                    existing_slot.save()
                    updated_time_slot_ids.append(existing_slot.id)

        # Delete time slots that were not included in the update
        time_slots_to_delete = [ts for ts in existing_time_slots.values() if ts.id not in updated_time_slot_ids]
        for time_slot in time_slots_to_delete:
            time_slot.delete()

        return instance


class PatientDropdownSerializer(serializers.ModelSerializer):
    # id = serializers.CharField(source='user.id')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name']

class locationSerializer(serializers.ModelSerializer):
    class Meta:
        model = location
        fields = '__all__'
