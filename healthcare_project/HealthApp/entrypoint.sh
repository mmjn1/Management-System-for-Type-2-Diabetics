#!/bin/bash

set -e  # Exit on error

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Installed Python packages:"
pip freeze
echo "Current PATH: $PATH"

if [ "$SERVICE" == "worker" ]; then
    exec celery -A healthcare_project worker -l info
elif [ "$SERVICE" == "beat" ]; then
    exec celery -A healthcare_project beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
elif [ "$SERVICE" == "asgi" ]; then
    exec daphne -b 0.0.0.0 -p 8000 healthcare_project.asgi:application
else
    exec gunicorn --bind 0.0.0.0:8000 healthcare_project.wsgi:application
fi
