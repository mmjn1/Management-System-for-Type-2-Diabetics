from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator


User = get_user_model()

"""
This file contains the models for the chat application.
It includes the Message model that represents messages sent between users.

The Message model represents a column in the database that stores messages sent between users.

"""

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='attachments/', null=True, blank=True,
                                  validators=[
                                      FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'mp4'])])


    def __str__(self):
        return f'{self.sender} to {self.recipient}'
