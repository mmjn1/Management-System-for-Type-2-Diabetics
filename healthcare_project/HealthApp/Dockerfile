# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY HealthApp/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the application files from healthcare_project
COPY . /app/

# Copy the shared entrypoint script
# The entrypoint.sh file is now within the HealthApp directory
COPY HealthApp/entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose port 8000 for web connections
EXPOSE 8000

# Use the entrypoint script to configure the container
ENTRYPOINT ["/app/entrypoint.sh"]

# Remove the specific CMD for Gunicorn
# This allows external configuration (e.g., ECS task definitions) to dictate the service to start
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "healthcare_project.wsgi:application"]
CMD []