# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
# Copy the requirements.txt from the HealthApp directory
COPY ../HealthApp/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the application files from the Chat directory
COPY . /app/

# Copy the shared entrypoint script from the HealthApp directory
COPY ../HealthApp/entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose port 8000 for web connections
EXPOSE 8000

# Use the entrypoint script to configure the container
ENTRYPOINT ["/app/entrypoint.sh"]

# Start Daphne for the Django ASGI application
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "healthcare_project.asgi:application"]


