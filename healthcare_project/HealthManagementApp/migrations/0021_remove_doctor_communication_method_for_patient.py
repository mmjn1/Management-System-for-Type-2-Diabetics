# Generated by Django 4.2.6 on 2024-01-27 20:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0020_remove_patient_insurance_information'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctor',
            name='communication_method_for_patient',
        ),
    ]
