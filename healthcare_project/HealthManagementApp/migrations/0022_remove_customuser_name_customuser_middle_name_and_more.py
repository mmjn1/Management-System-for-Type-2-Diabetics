# Generated by Django 4.2.6 on 2024-01-28 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0021_remove_doctor_communication_method_for_patient'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='name',
        ),
        migrations.AddField(
            model_name='customuser',
            name='middle_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='first_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='last_name',
            field=models.CharField(max_length=100),
        ),
    ]
