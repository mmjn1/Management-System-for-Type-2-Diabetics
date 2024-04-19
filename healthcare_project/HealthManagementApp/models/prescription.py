from datetime import timezone
from HealthManagementApp.models.users import *


class Salt(models.Model): # For example - Metformin, Paracetamol, etc.
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.name)


class Medicine(models.Model): # Represents the brand name that produce the Salt (Medicine) for example - Panadol, Axpinet, Diagemet, etc.
    salt = models.ForeignKey(Salt, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class Drugs(models.Model):
    Medical_name = models.ForeignKey(Medicine, on_delete=models.CASCADE, max_length=200)
    frequency = models.CharField(max_length=200, null=True, blank=True)
    Time_of_day = models.CharField(max_length=200, null=True, blank=True)
    duration = models.CharField(max_length=200, null=True, blank=True)
    dosage = models.CharField(max_length=50)

    def __str__(self):
        return str(self.Medical_name)


class Symptoms(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True, unique=True)

    def __str__(self):
        return str(self.name)


class Tests(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f'{self.name}'


class Vitals(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    reading = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateField(auto_created=True, auto_now_add=True)

    def __str__(self):
        return f'{self.name}: {self.reading} - {self.date}'


class Diagnoses(models.Model):
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Histories(models.Model):
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Advices(models.Model):
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class FollowUps(models.Model):
    name = models.TextField(null=True, blank=True, max_length=500)

    def __str__(self):
        return str(self.name)


class Prescription(models.Model):
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
        self.refill_request_pending = True
        self.save()

    def approve_refill(self):
        self.refill_count += 1
        self.last_refilled_date = timezone.now()
        self.refill_request_pending = False
        self.save()