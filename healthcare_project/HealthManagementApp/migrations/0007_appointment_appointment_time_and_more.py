# Generated by Django 4.2.6 on 2023-12-26 21:15

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0006_remove_appointment_date_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='appointment_time',
            field=models.TimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='appointment_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
