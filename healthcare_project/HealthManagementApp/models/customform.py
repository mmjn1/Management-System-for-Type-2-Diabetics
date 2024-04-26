from django.db import models
from .users import Doctor, Patient

class Form(models.Model):
    """
    Represents a form which can be filled out by a patient, linked to a specific doctor.
    Each form can have multiple sections and responses.
    """
    name = models.CharField(max_length=255)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="forms")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="forms", null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Section(models.Model):
    """
    Represents a section within a form. Each section can contain multiple fields.
    """
    name = models.CharField(max_length=255)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="sections")

    def __str__(self) -> str:
        return self.name


class Field(models.Model):
    """
    Represents a field within a section of a form. Fields have specific types such as text, email, etc.
    """
    FIELD_TYPE_CHOICES = [
        ("text", "Text"),
        ("password", "Password"),
        ("number", "Number"),
        ("email", "Email"),
        ("phone", "Phone"),
        ("radio", "radio"),
        ("checkbox", "Checkbox"),
        ("select", "Select"),
    ]
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPE_CHOICES)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="form_fields"
    )

    def __str__(self) -> str:
        return self.label


class FieldChoice(models.Model):
    """
    Represents a choice for a field that has selectable options, such as radio buttons or dropdowns.
    """
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.choice_text


class FormResponse(models.Model):
    """
    Represents a response to a form, 
    containing answers filled out by a patient, associated with a doctor.
    """
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="responses")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="form_responses")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="form_responses")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Response to {self.form.name} by {self.doctor.user.get_full_name()}"

class FieldResponse(models.Model):
    """
    Represents a response to a specific field within a form response.
    """
    form_response = models.ForeignKey(FormResponse, on_delete=models.CASCADE, related_name="field_responses")
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="+")  # '+' indicates no reverse relation
    value = models.TextField()

    def __str__(self) -> str:
        return f"Response: {self.value}"



