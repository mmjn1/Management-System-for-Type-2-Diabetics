# Generated by Django 4.2.6 on 2023-12-26 00:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='height',
        ),
        migrations.RemoveField(
            model_name='patient',
            name='medical_conditions',
        ),
        migrations.RemoveField(
            model_name='patient',
            name='prescription',
        ),
        migrations.AddField(
            model_name='patient',
            name='alcohol_consumption',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='blood_sugar_level',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='current_diabetes_medication',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='date_last_HbA1c_test_and_result',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='date_of_diagnosis',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='dietary_habits',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='physical_activity_level',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='smoking_habits',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='type_of_diabetes',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='medical_history',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
