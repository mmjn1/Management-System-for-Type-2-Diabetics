# Generated by Django 4.2.6 on 2024-04-16 10:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('HealthManagementApp', '0010_remove_usermealentry_patient'),
    ]

    operations = [
        migrations.CreateModel(
            name='Advices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Diagnoses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FollowUps',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Histories',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Salt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Symptoms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tests',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Vitals',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_created=True, auto_now_add=True)),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('reading', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='dosage_info',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='drug_name',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='frequency',
        ),
        migrations.AddField(
            model_name='prescription',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='notes',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='HealthManagementApp.patient'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='prescribing_doctor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='HealthManagementApp.doctor'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='reason_for_medication',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='refill_count',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='start_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.CreateModel(
            name='Medicine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('salt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medicines', to='HealthManagementApp.salt')),
            ],
        ),
        migrations.CreateModel(
            name='Drugs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frequency', models.CharField(blank=True, max_length=200, null=True)),
                ('Time_of_day', models.CharField(blank=True, max_length=200, null=True)),
                ('duration', models.CharField(blank=True, max_length=200, null=True)),
                ('dosage', models.CharField(max_length=50)),
                ('Medical_name', models.ForeignKey(max_length=200, on_delete=django.db.models.deletion.CASCADE, to='HealthManagementApp.medicine')),
            ],
        ),
        migrations.AddField(
            model_name='prescription',
            name='Advices',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.advices'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Diagnoses',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.diagnoses'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Drug',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.drugs'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='FollowUps',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.followups'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Histories',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.histories'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Symptoms',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.symptoms'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Tests',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.tests'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='Vitals',
            field=models.ManyToManyField(blank=True, null=True, to='HealthManagementApp.vitals'),
        ),
    ]
