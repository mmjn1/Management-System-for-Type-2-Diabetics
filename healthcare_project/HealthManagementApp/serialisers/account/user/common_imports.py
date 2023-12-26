import sys
import logging


from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from djoser.serializers import  UserCreatePasswordRetypeSerializer


from HealthManagementApp.models import CustomUser, Role

# from .base_user_serialiser import UserSerializer