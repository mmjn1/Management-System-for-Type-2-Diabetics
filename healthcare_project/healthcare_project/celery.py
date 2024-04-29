from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_project.settings')

app = Celery('django_celery_project') # This instance will be used to define tasks and configure the Celery worker.

"""
Configures the timezones for Celery. This is important for scheduling tasks that are sensitive to timezones.
"""
app.conf.enable_utc = False
app.conf.update(timezone='Europe/London')


app.config_from_object(settings, namespace='CELERY')

# Celery Beat Settings
app.conf.beat_schedule = {
    'send-mail-every-day': {
        'task': 'HealthManagementApp.tasks.automated',
        'schedule': crontab(hour='*/22')
    }
}

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


"""
This module configures Celery for the healthcare_project, setting up asynchronous task management
and scheduled tasks using Celery Beat. It integrates Celery with Django's settings and schedules
specific tasks to run at defined intervals.

Celery is used here to handle background tasks asynchronously, 
so the web server can remain responsive to user requests while performing 
time-consuming operations in the background

Key Components:
- Celery instance initialization with Django settings integration.
- Timezone configuration for task scheduling.
- Definition of periodic tasks using Celery Beat for automated execution.
- Automatic discovery of task modules in Django applications.
- Example of a simple Celery task for debugging purposes.
"""