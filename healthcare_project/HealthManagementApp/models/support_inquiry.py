from django.db import models
from django.utils import timezone


class SupportInquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=100)
    message = models.TextField()
    submitted_at = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return self.name