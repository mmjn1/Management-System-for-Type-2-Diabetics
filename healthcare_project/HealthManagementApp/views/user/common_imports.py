# django imports
from django.shortcuts import get_object_or_404

# rest framework imports
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view

# djoser imports
from djoser.views import UserViewSet

# local imports

from HealthManagementApp.models import CustomUser

from rest_framework import generics, permissions, status
