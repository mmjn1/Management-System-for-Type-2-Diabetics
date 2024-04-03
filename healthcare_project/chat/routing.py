from django.urls import path
from chat import consumers

"""
The routing.py contains the routing configuration for the chat application.

This line tells Django Channels to use the ChatConsumer class for handling WebSocket connections to URLs
that match the given pattern.
"""

websocket_urlpatterns = [
    path('ws/chat/<int:user_id>/<int:other_user_id>/', consumers.ChatConsumer.as_asgi()),
]