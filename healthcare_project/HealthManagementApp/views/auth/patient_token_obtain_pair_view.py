from .common_imports import (
    TokenViewBase, # from rest_framework_simplejwt.views import TokenViewBase
    AllowAny, # from rest_framework.permissions import AllowAny
    Response, # from rest_framework.response import Response
    AuthenticationFailed, # from rest_framework_simplejwt.exceptions import AuthenticationFailed
    InvalidToken, # from rest_framework_simplejwt.exceptions import InvalidToken
    TokenError, # from rest_framework_simplejwt.exceptions import TokenError
    status, # from rest_framework import status
)


from HealthManagementApp.serialisers.auth import (
    PatientAuthTokenSerializer, # from .serializers.auth import PatientAuthTokenSerializer
)

class PatientTokenObtainPairView(TokenViewBase):
    """
    A view that handles the authentication of patients and returns JWT access and refresh tokens.
    This view uses the PatientAuthTokenSerializer to validate the credentials provided in the request.
    It allows any user to attempt authentication but will only succeed if the credentials match a patient user.

    """
    permission_classes = [AllowAny]

    serializer_class = PatientAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to authenticate a patient user and issue JWT tokens.
        """
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            raise
        except TokenError:
            raise InvalidToken()

        return Response(serializer.validated_data, status=status.HTTP_200_OK)