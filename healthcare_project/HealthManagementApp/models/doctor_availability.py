from django.db import models


class WeeklyAvailability(models.Model):
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

class TimeSlot(models.Model):

    GP = 'Victoria Park Health Centre'
    ONLINE = 'Online'
    LOCATION_CHOICES = [
        (GP, 'Victoria Park Health Centre'),
        (ONLINE, 'Online'),
    ]
    weekly_availability = models.ForeignKey('WeeklyAvailability', on_delete=models.CASCADE, related_name='time_slots', null=True, blank=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255, blank=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('weekly_availability', 'start_time', 'end_time', 'location')

    def __str__(self):
        return f"{self.weekly_availability.day_of_week}: {self.start_time} to {self.end_time} at {self.location}"