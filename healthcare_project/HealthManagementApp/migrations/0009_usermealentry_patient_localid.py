# Generated by Django 4.2.6 on 2024-05-03 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0008_usermealentry'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermealentry',
            name='patient_localID',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]