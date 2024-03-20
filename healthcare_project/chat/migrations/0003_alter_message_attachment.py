# Generated by Django 4.2.6 on 2024-03-13 05:16

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_message_attachment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='attachment',
            field=models.FileField(blank=True, null=True, upload_to='attachments/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'mp4'])]),
        ),
    ]
