from datetime import timezone
from HealthManagementApp.models.users import *


class Salt(models.Model): # For example - Metformin, Paracetamol, etc.
    """
    Represents a chemical compound or substance used as the base ingredient in medications.
    Attributes:
        name (models.CharField): The name of the salt, unique across the model.
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.name)


class Medicine(models.Model): # Represents a specific brand of medication that contains a particular salt.
    """
    Represents a specific brand of medication that contains a particular salt.
    Attributes:
        salt (models.ForeignKey): A reference to the Salt instance that this medicine contains.
        name (models.CharField): The commercial name of the medicine.
    """
    salt = models.ForeignKey(Salt, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class Drugs(models.Model):
    """
    Represents a prescribed drug including its dosage and administration details.
    Attributes:
        Medical_name (models.ForeignKey): A reference to the Medicine instance prescribed.
        frequency (models.CharField): How often the drug should be taken.
        Time_of_day (models.CharField): Recommended time(s) of the day for taking the drug.
        duration (models.CharField): The length of time the drug should be taken.
        dosage (models.CharField): The amount of drug to be taken each time.
    """
    Medical_name = models.ForeignKey(Medicine, on_delete=models.CASCADE, max_length=200)
    frequency = models.CharField(max_length=200, null=True, blank=True)
    Time_of_day = models.CharField(max_length=200, null=True, blank=True)
    duration = models.CharField(max_length=200, null=True, blank=True)
    dosage = models.CharField(max_length=50)

    def __str__(self):
        return str(self.Medical_name)


class Symptoms(models.Model):
    """
    Represents symptoms reported by the patient or observed by the healthcare provider.
    Attributes:
        name (models.CharField): Description of the symptom, unique across the model.
    """
    name = models.CharField(max_length=200, null=True, blank=True, unique=True)

    def __str__(self):
        return str(self.name)


class Tests(models.Model):
    """
    Represents medical tests that may be ordered as part of the patient's diagnosis.
    Attributes:
        name (models.CharField): The name of the test.
    """
    name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f'{self.name}'


class Vitals(models.Model):
    """
    Represents vital signs measurements recorded during patient visits.
    Attributes:
        name (models.CharField): The type of vital sign measured.
        reading (models.CharField): The recorded value of the vital sign.
        date (models.DateField): The date when the measurement was taken.
    """
    name = models.CharField(max_length=200, null=True, blank=True)
    reading = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateField(auto_created=True, auto_now_add=True)

    def __str__(self):
        return f'{self.name}: {self.reading} - {self.date}'


class Diagnoses(models.Model):
    """
    Represents medical diagnoses made based on patient symptoms, tests, and other assessments.
    Attributes:
        name (models.TextField): Detailed description of the diagnosis.
    """
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Histories(models.Model):
    """
    Represents historical medical information about the patient, including past conditions and treatments.
    Attributes:
        name (models.TextField): Detailed description of the patient's medical history.
    """
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Advices(models.Model):
    """
    Represents medical advice given to the patient by healthcare providers.
    Attributes:
        name (models.TextField): The content of the advice provided.
    """
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class FollowUps(models.Model):
    """
    Represents follow-up actions or appointments recommended for the patient.
    Attributes:
        name (models.TextField): Description of the follow-up required.
    """
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Prescription(models.Model):
    """∫
    Represents a medical prescription issued to a patient.
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    prescribing_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)

    Drug = models.ManyToManyField(Drugs, blank=True)
    Symptoms = models.ManyToManyField(Symptoms, blank=True)
    Tests = models.ManyToManyField(Tests, blank=True)
    Vitals = models.ManyToManyField(Vitals, blank=True)
    Diagnoses = models.ManyToManyField(Diagnoses, blank=True)
    Histories = models.ManyToManyField(Histories, blank=True)
    Advices = models.ManyToManyField(Advices, blank=True)
    FollowUps = models.ManyToManyField(FollowUps, blank=True)

    reason_for_medication = models.TextField(blank=True, null=True, max_length=500)
    notes = models.TextField(blank=True, null=True, max_length=500)
    intake_instructions = models.CharField(blank=True, null=True, max_length=100)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    refill_count = models.IntegerField(default=0, null=True, blank=True)
    last_refilled_date = models.DateField(null=True, blank=True)
    refill_request_pending = models.BooleanField(default=False)
    prescription_approved = models.BooleanField(default=False)
    refill_requested = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)

    def request_refill(self):
        """
        Sets the refill request status to pending and saves the prescription instance.
        """
        self.refill_request_pending = True
        self.save()

    def approve_refill(self):
        """
        Approves a refill request by incrementing the refill count, updating the last refilled date,
        resetting the refill request status, and saving the prescription instance.
        """
        self.refill_count += 1
        self.last_refilled_date = timezone.now()
        self.refill_request_pending = False
        self.save()