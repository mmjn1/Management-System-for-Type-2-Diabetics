from django.db import models


class WeeklyAvailability(models.Model):
    """
    Represents the weekly availability of a doctor for a specific day of the week.
    Each record defines whether the doctor is working on that particular day.

    Attributes:
        doctor (ForeignKey): Reference to the Doctor model.
        day_of_week (CharField): Day of the week.
        is_working (BooleanField): Flag indicating if the doctor is working on the specified day.
    """
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=9, choices=[
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ])
    is_working = models.BooleanField(default=False)

    class Meta:
        unique_together = ('doctor', 'day_of_week')

    def __str__(self):
        return f"{self.doctor} - {self.day_of_week} - {'Working' if self.is_working else 'Off'}"


class location(models.Model):
    """
    Represents a location where services are provided, which can be either in-person or online.

    Attributes:
        name (CharField): The name of the location.
        mode (CharField): The mode of service delivery, either 'In-Person' or 'Online'.
    """
    name = models.CharField(max_length=244, null=True, blank=True)
    mode = models.CharField(max_length=255, choices=[
        ('In-Person', 'In-Person'),
        ('Online', 'Online'),
    ], default='In-Person')

    def __str__(self):
        return f"{self.name} ({self.mode})"


class TimeSlot(models.Model):
    """
    Represents a specific time slot for a doctor's availability within a week, including the location and availability status.

    Attributes:
        weekly_availability (ForeignKey): Reference to the WeeklyAvailability model.
        start_time (TimeField): The start time of the time slot.
        end_time (TimeField): The end time of the time slot.
        location (ForeignKey): Reference to the Location model where the time slot is applicable.
        is_available (BooleanField): Flag indicating if the time slot is available for appointments.
    """
    weekly_availability = models.ForeignKey('WeeklyAvailability', on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.ForeignKey(location, on_delete=models.CASCADE, null=True, blank=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('weekly_availability', 'start_time', 'end_time', 'location')

    def __str__(self):
        return f"{self.weekly_availability.doctor}-{self.weekly_availability.day_of_week}: {self.start_time} to {self.end_time} at {self.location}"
