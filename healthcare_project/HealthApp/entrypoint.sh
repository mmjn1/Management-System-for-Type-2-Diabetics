#!/bin/bash

# Exit script in case of error
set -e

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Check if celery command is passed
if [[ "$1" == "celery" ]]; then
    # Shift command line arguments left
    shift 1
    # Execute the celery command with the passed arguments
    exec celery -A healthcare_project "$@"
else
    # Start command passed to the script. For example:
    # if passed "gunicorn", it starts Gunicorn; if passed "daphne", it starts Daphne
    exec "$@"
fi