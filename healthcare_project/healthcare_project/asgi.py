import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_project.settings')
django.setup()

# Import routing from both apps
from chat import routing as chat_routing
from HealthManagementApp import routing as health_management_routing

# Combine the routing from both apps
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    'http': get_asgi_application(),  # Django's ASGI application to handle traditional HTTP requests
    'websocket': AuthMiddlewareStack(  # Handles WebSocket connections
        URLRouter(
            chat_routing.websocket_urlpatterns + 
            health_management_routing.websocket_urlpatterns  # Combine WebSocket routes from both apps
        )
    ),
})