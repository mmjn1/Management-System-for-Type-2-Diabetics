from django.db import models
from .users import Patient

class UserMealEntry(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='meal_entries', null=True, blank=True)
    user_input = models.TextField()
    ai_advice = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_input

    