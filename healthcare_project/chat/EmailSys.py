import os
import threading
from django.contrib.auth import get_user_model
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives

User = get_user_model()
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
site_name = os.environ.get('SITE_NAME')

class EmailThreading(threading.Thread):
    """
    A class that extends threading.Thread to send emails asynchronously.

    This class handles the preparation and sending of an email in a separate thread,
    allowing the main application to continue running without waiting for the email
    sending process to complete. It uses Django's email and template systems to
    construct and send the email.

    Attributes:
        data (dict): A dictionary containing the necessary information to construct
                     the email, including sender_id, recipient_id, message, and file_name.
    """
    def __init__(self, data):
        """
        Initializes the EmailThreading object with the data needed to send an email.

        Args:
            data (dict): Information about the email to be sent.
        """
        self.data = data
        threading.Thread.__init__(self)

    def run(self):
        """
        The entry point for the thread, where the email is constructed and sent.
        """
        sender_id = self.data['sender_id']
        recipient_id = self.data['recipient_id']
        message = self.data['message']
        file_name = self.data['file_name']
        
        if message:
            message = message.strip()
        user_sender = User.objects.get(id=sender_id)
        user_recipient = User.objects.get(id=recipient_id)

        subject, from_email, to = f'{user_recipient.first_name} send you a message ', EMAIL_HOST_USER, user_recipient.email
        data_format = {
            'message': message,
            'sender_name': user_sender.first_name,
            'receiver_name': user_recipient.first_name,
            'site_name': site_name,
            'file_name': file_name
        }
        htmly = get_template('MessageEmail.HTML')
        html_content = htmly.render(data_format)
        msg = EmailMultiAlternatives(
            subject, html_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()