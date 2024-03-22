from django.urls import path
from .consumers import DoctorAvailabilityConsumer


websocket_urlpatterns = [
    path('ws/availability-updates/<int:doctor_id>/', DoctorAvailabilityConsumer.as_asgi()),
]