import os
import threading
from django.contrib.auth import get_user_model
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives

User = get_user_model()
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
site_name = os.environ.get('SITE_NAME')


class EmailThreading(threading.Thread):
    def __init__(self, data):
        self.data = data
        threading.Thread.__init__(self)

    def run(self):
        sender_id = self.data['sender_id']
        receiver_id = self.data['recipient_id']
        message = self.data['message']
        if message:
            message = message.strip()
        user_sender = User.objects.get(id=sender_id)
        user_recipient = User.objects.get(id=receiver_id)
        subject, from_email, to = f'{user_recipient.first_name} sent you a message ', EMAIL_HOST_USER, user_recipient.email
        data_format = {
            'message': message,
            'sender_name': user_sender.first_name,
            'receiver_name': user_recipient.first_name,
            'site_name': site_name,
        }
        htmly = get_template('MessageEmail.html')
        html_content = htmly.render(data_format)
        msg = EmailMultiAlternatives(
            subject, html_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()