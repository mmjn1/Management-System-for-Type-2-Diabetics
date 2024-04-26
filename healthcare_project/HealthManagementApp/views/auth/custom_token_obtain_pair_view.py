from HealthManagementApp.serialisers import CustomTokenObtainPairSerializer, InActiveUser
from rest_framework import status
from .common_imports import (
    TokenViewBase, # from rest_framework_simplejwt.views import TokenViewBase
    AllowAny, # from rest_framework.permissions import AllowAny
    Response, # from rest_framework.response import Response
    AuthenticationFailed, # from rest_framework_simplejwt.exceptions import AuthenticationFailed
    InvalidToken, # from rest_framework_simplejwt.exceptions import InvalidToken
    TokenError, # from rest_framework_simplejwt.exceptions import TokenError

)


class CustomTokenObtainPairView(TokenViewBase):
    """
     A view that handles the authentication process and returns JWT access and refresh tokens using custom validations.
    This view uses the CustomTokenObtainPairSerializer to validate the credentials provided in the request.
    It is designed to handle specific cases such as inactive user accounts and other custom validation scenarios.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            raise 
        except TokenError:
            raise InvalidToken()

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
    