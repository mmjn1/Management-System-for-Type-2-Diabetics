from HealthManagementApp.serialisers import CustomTokenObtainPairSerializer, InActiveUser

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
    Takes a set of user credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    Returns HTTP 406 when user is inactive and HTTP 401 when login credentials are invalid.
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