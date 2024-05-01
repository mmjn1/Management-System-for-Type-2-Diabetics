import os
import django

# Set the default Django settings module for the 'asgi' process.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_project.settings')
# Setup Django (prepare the environment).
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat import routing
from channels.auth import AuthMiddlewareStack 

# Get the ASGI application from Django which handles HTTP requests.
asgi_app = get_asgi_application()

# Define the main ASGI application to handle different types of connections.
application = ProtocolTypeRouter({
    'http': asgi_app,  # Use the Django ASGI application to handle HTTP protocols.
    'websocket': AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))  # Use WebSocket protocol with authentication.
})