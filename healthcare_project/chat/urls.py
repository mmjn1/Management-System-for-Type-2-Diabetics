from django.urls import path
from . import views

"""
This file contains URL patterns for the chat application.
Endpoints include:
- /api/messages/ for retrieving messages
- /api/messages/new/ for posting new messages
- /upload/ for uploading attachments

It will recieve requests from the frontend and call the appropriate view function to handle the request.

"""

urlpatterns = [
    path('api/messages/', views.get_messages, name='get_messages'),
    path('api/messages/new/', views.post_message, name='post_message'),
    path('upload/', views.upload_attachment, name='upload_attachment'),
    path('container-health/', views.health_check, name='health-check'),


]