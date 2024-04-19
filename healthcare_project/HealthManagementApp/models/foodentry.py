from django.db import models
from .users import Patient

class UserMealEntry(models.Model):
    user_input = models.TextField()
    ai_advice = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_input

    