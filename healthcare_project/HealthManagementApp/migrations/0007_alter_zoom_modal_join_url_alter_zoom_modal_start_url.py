# Generated by Django 4.2.6 on 2024-04-30 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0006_zoom_modal_start_time_alter_zoom_modal_agenda_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='zoom_modal',
            name='join_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='zoom_modal',
            name='start_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
